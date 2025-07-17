const OTPgenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SendEmail = require("../utilities/MailSender")
const emailVerification = require('../mailTemplates/emailVerification');
// const {passwordUpdated} = require('../mailTemplates/passwordUpdate');
const resetPassword = require('../mailTemplates/resetPassword');
const crypto = require('crypto');
// const {UploadMedia} = require('../utilities/MediaUploader')
const { uploadMediaToS3 } = require('../utilities/S3mediaUploader');

const { PrismaClient } = require('@prisma/client');
const { IS_REGISTRATION_ON, yearWiseStudentList } = require("../config/constants");
const Prisma = new PrismaClient();

exports.sendOTP = async (req,res) => {
    try{

        if(!IS_REGISTRATION_ON){
            return res.status(400).json({
                success: false,
                message: "Registration not yet started",
            })
        }

        const {email} = req.body;
        if(!email){
            return res.status(404).json({
                success:false,
                message:"Email is missing",
            })
        }

        const isEmailExistsAlready = await Prisma.user.findUnique({where : {email :email}});
        if(isEmailExistsAlready){
            return res.status(400).json({
                success:false,
                message:"Account with this Email is Already Registered",
            });
        };

        const options = {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
            digits:true
        };

        let otp = OTPgenerator.generate(6,options);
        let result = await Prisma.oTP.findFirst({ where: { otp } });
        while(result){
            otp = OTPgenerator.generate(6,options);
            result = await Prisma.oTP.findFirst({ where: { otp } });
        }

        await Prisma.oTP.create({data:{email:email,otp:otp}});

        try{
            await SendEmail(email,"Verification OTP | NIT Andhra Pradesh",emailVerification(otp));
        }catch(e){
            console.log(e);
            return res.status(400).json({
                success:false,
                message:"Error Sending Verification Email",
            });
        };

        return res.status(200).json({
            success:true,
            message:"OTP Successfully Sent",
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"OTP Gereration Failed",
        })
    }
}

// exports.signup = async(req,res) => {
//     try{
//         const {email,password,confirmPassword,otp,accountType} = req.body;

//         if(!email || !password || !confirmPassword || !otp || !accountType){
//             return res.status(400).json({
//                 success:false,
//                 message:"Some data Not Found",
//             })
//         }

//         if(accountType !== "ADMIN"){
//             return res.status(404).json({
//                 success:false,
//                 message:"Only for ADMIN account creation",
//             })
//         }

//         if(password !== confirmPassword){
//             return res.status(400).json({
//                 success:false,
//                 message:"Both passwords are not matching",
//             });
//         };
//         const isUserExistsAlready = await Prisma.user.findFirst({where : {email}});
//         if(isUserExistsAlready){
//             return res.status(401).json({
//                 success:false,
//                 message:"User Already Registered",
//             });
//         };
        
//         const mostRecentOTP = await Prisma.oTP.findFirst({
//             where: { email },
//             orderBy: { createdAt: 'desc' }
//         });
//         if(!mostRecentOTP){
//             return res.status(404).json({
//                 success:false,
//                 message:"OTP not found",
//             });
//         }else if(mostRecentOTP.otp !== otp){
//             return res.status(401).json({
//                 success:false,
//                 message:"Invalid OTP",
//             })
//         };

//         const hashedPassword = await bcrypt.hash(password,10);

//         await Prisma.user.create({data:{email,password:hashedPassword,accountType:"ADMIN",status:"ACTIVE"}});

//         return res.status(200).json({
//             success:true,
//             message:"User Registered Successfully",
//         })
//     }catch(e){
//         console.log(e);
//         return res.status(400).json({
//             success:false,
//             message:"Signup Operation Failed",
//         })
//     }
// }

exports.login = async(req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(404).json({
                success:false,
                message:"Some Data not found",
            })
        }

        const ifUserExists = await Prisma.user.findFirst({where:{email}});
        if(!ifUserExists){
            return res.status(404).json({
                success:false,
                message:"User not Registered",
            });
        };
        if(ifUserExists && ifUserExists?.status !== "ACTIVE" && ifUserExists?.status !== "ACTIVE1"){
            return res.status(401).json({
                success:false,
                message:"Account Not Active",
            })
        }

        const passwordMatch = await bcrypt.compare(password,ifUserExists.password);
        if(passwordMatch){
            const payload = {
                email : ifUserExists.email,
                id : ifUserExists.id,
                accountType : ifUserExists.accountType,
            }

            const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"240h"});
            ifUserExists.token = token;
            ifUserExists.password = undefined;

            await Prisma.user.update({where:{id:ifUserExists.id}, data:{token:token}});

            const options2 = {
                expires : new Date(Date.now() + 10*24*60*60*1000), // 7days
                httpOnly : true,
            }

            res.cookie("token",token,options2).status(200).json({
                success:true,
                token,
                user : ifUserExists,
                message : "Logged In Successfully",
            })
        }else{
            console.log("Password Not Matching");
            return res.status(400).json({
                success:false,
                message:"Log In Unsuccessful",
            })
        }
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Login operation failed",
        })
    }
}

exports.changePassword = async(req,res) => {
    try{
        const {oldPassword,newPassword} = req.body;
        const id = req.user.id;

        const user = await Prisma.user.findFirst({where : {id}});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"Invalid User Id",
            })
        }

        const passwordValid = await bcrypt.compare(oldPassword,user.password);

        if(!passwordValid){
            return res.status(400).json({
                success:false,
                message:"Old Password Incorrect",
            });
        };

        const newHashedPassword = await bcrypt.hash(newPassword,10);
        const updatedUser = await Prisma.user.update({where : {id:req.user.id},data:{password:newHashedPassword}});

        try{
            await SendEmail(updatedUser.email,"Password Reset Successful | NIT Andhra Pradesh HMS",passwordUpdated(updatedUser.email));
        }catch(e){
            return res.status(400).json({
                success:false,
                message:"Error sending Updated Password Email",
            });
        }
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Password cannot be changed",
        })
    }
}

exports.resetPasswordToken = async(req,res) => {
    try{
        const {email} = req.body;

        const ifUserExists = await Prisma.user.findFirst({where : {email}});
        if(!ifUserExists){
            return res.status(404).json({
                success:false,
                message:"Email not yet Registered",
            });
        }

        const token = crypto.randomBytes(20).toString("hex");

        await Prisma.user.update({
            where: { email },
            data: {
              token:token,
              resetPasswordExpiresIn: new Date(Date.now() + 5 * 60 * 1000),
            },
        });
        await SendEmail(email,"Reset Password Token | NIT Andhra Pradesh HMS",resetPassword(token));
        return res.status(200).json({
            success:true,
            message:"Reset Password Token Mail Sent Successfully",
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Reset Password Token Generation Failed",
        })
    }
}

exports.resetPassword = async(req,res) => {
    try{
        const {token,newPassword,confirmNewPassword} = req.body;

        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"Both Passwords don't match",
            })
        }

        const user = await Prisma.user.findFirst({where:{token}});
        if(!user){
            console.log("fdfdfr");
            return res.status(404).json({
                success:false,
                message:"Token Invalid",
            });
        }
        console.log("user" ,user);
        if(user.resetPasswordExpiresIn < Date.now()){
            return res.status(400).json({
                success:false,
                message:"Token Expired",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);

        await Prisma.user.update({
            where: { id:user.id },
            data: {
              password:hashedPassword,
            },
        });

        return res.status(200).json({
            success:true,
            message:"Password Reset Successful",
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Reset Password Failed",
        })
    }
}

exports.verifyOTP = async(req,res) => {
    try{
        const {email,password,confirmPassword,otp} = req.body;

        if(!email || !password || !confirmPassword || !otp){
            return res.status(400).json({
                success:false,
                message:"Some data Not Found",
            })
        }
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Both passwords are not matching",
            });
        };
        const isUserExistsAlready = await Prisma.user.findFirst({where : {email}});
        if(isUserExistsAlready){
            return res.status(401).json({
                success:false,
                message:"User Already Registered",
            });
        };
        
        const mostRecentOTP = await Prisma.oTP.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' }
        });
        if(!mostRecentOTP){
            return res.status(404).json({
                success:false,
                message:"OTP not found",
            });
        }else if(mostRecentOTP.otp !== otp){
            return res.status(401).json({
                success:false,
                message:"Invalid OTP",
            })
        };

        return res.status(200).json({
            success:true,
            message:"OTP Verified!",
        })


    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unalbe to Verify OTP",
        })
    }
}

exports.createStudentAccount = async(req,res) => {
    try{
        const {email,password,confirmPassword,name,regNo,rollNo,year,branch,gender,pwd,community,aadhaarNumber,dob,bloodGroup,fatherName,motherName,phone,parentsPhone,emergencyPhone,address,paymentMode,paymentDate,amountPaid,hostelBlockId,cotId} = req.body;
        const {image,hostelFeeReceipt,instituteFeeReceipt} = req.files;

        if(!email || password===null || confirmPassword===null || !name || !regNo || !rollNo || !year || !branch || !gender || pwd===null || !community || !aadhaarNumber || !dob || !bloodGroup || !fatherName || !motherName || phone===null || parentsPhone===null || emergencyPhone===null || !address || !paymentMode || !paymentDate || !amountPaid || hostelBlockId===null || cotId===null){
            return res.status(404).json({
                success:false,
                message:"Data Missing",
            })
        }

        if(!image || !hostelFeeReceipt || !instituteFeeReceipt){
            return res.status(404).json({
                success:false,
                message:"File Missing",
            })
        }

        if(password !== confirmPassword){
            return res.status(401).json({
                success:false,
                message:"Both Passwords are Not Matching",
            })
        }

        // For 1st year Students
        // if(!email.trim().endsWith("@student.nitandhra.ac.in") && year !== "1"){
        //     return res.status(402).json({
        //         success:false,
        //         message:"Use Institute Email ID for Registration",
        //     })
        // }

        if(!email.trim().endsWith("@student.nitandhra.ac.in")){
            return res.status(402).json({
                success:false,
                message:"Use Institute Email ID for Registration",
            })
        }

        // HERE MANAGE FOR 1st Yeat Students
        const allowedRolls = yearWiseStudentList[year];
        if(!allowedRolls || !allowedRolls.includes(rollNo)){
            return res.status(403).json({
                success: false,
                message: "You have selected invalid year of study, select your current year of study",
            });
        }

        const ifUserExistsAlready = await Prisma.user.findFirst({where : {email}});
        if(ifUserExistsAlready){
            return res.status(402).json({
                success:false,
                message:"User Already Registered",
            })
        }

        const cotDetails = await Prisma.cot.findUnique({where : {id : parseInt(cotId)}});
        if(!cotDetails){
            return res.status(404).json({
                success:false,
                message:"Cot Not Found",
            })
        }
        if(cotDetails?.status !== "AVAILABLE"){
            return res.status(402).json({
                success:false,
                message:"Cot Not Available",
            })
        }

        // const uploadedImage = await UploadMedia(image,process.env.FOLDER_NAME_IMAGES);
        const uploadedImage = await uploadMediaToS3(image, process.env.FOLDER_NAME_PROFILE_IMAGES, rollNo);
        if(!uploadedImage){
            return res.status(400).json({
                success:false,
                message:"Image Upload Failed",
            })
        }

        // FOR OPTIONAL INSTITUTE FEE RECEIPT
        // let uploadedInstituteFeeReceipt = null;
        // if(instituteFeeReceipt){
        //     uploadedInstituteFeeReceipt = await uploadMediaToS3(instituteFeeReceipt,process.env.FOLDER_NAME_FEE_RECEIPTS, rollNo);
        //     if(!uploadedInstituteFeeReceipt){
        //         return res.status(400).json({
        //             success:false,
        //             message:"Institite Fee Receipt Upload Failed",
        //         })
        //     }
        // }

        // FOR COMPULSORY INSTITUTE FEE RECEIPT
        const uploadedInstituteFeeReceipt = await uploadMediaToS3(instituteFeeReceipt,process.env.FOLDER_NAME_FEE_RECEIPTS, rollNo);
        if(!uploadedInstituteFeeReceipt){
            return res.status(400).json({
                success:false,
                message:"Institite Fee Receipt Upload Failed",
            })
        }

        // const uploadedHostelFeeReceipt = await UploadMedia(hostelFeeReceipt,process.env.FOLDER_NAME_DOCS);
        const uploadedHostelFeeReceipt = await uploadMediaToS3(hostelFeeReceipt,process.env.FOLDER_NAME_FEE_RECEIPTS, rollNo);
        if(!uploadedHostelFeeReceipt){
            return res.status(400).json({
                success:false,
                message:"Hostel Fee Receipt Upload Failed",
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const user = await Prisma.user.create({data : {email,password:hashedPassword,accountType:"STUDENT",status:"INACTIVE"}});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Unable to Create User",
            })
        }

        const userId = user?.id;
        if(!userId){
            return res.status(404).json({
                success:false,
                message:"User ID Not Found",
            })
        }

        // await Prisma.instituteStudent.create({data : {regNo,rollNo,name,image:uploadedImage?.secure_url,year,branch,gender,pwd:pwd==="true"?true:false,community,aadhaarNumber,dob,bloodGroup,fatherName,motherName,phone,parentsPhone,emergencyPhone,address,instituteFeeReceipt:uploadedInstituteFeeReceipt ? uploadedInstituteFeeReceipt?.secure_url : null,hostelFeeReceipt:uploadedHostelFeeReceipt?.secure_url,paymentDate,amountPaid,paymentMode,outingRating:5.0,disciplineRating:5.0,userId,hostelBlockId:parseInt(hostelBlockId),cotId:parseInt(cotId)}});
        // await Prisma.instituteStudent.create({data : {regNo,rollNo,name,image:uploadedImage?.url,year,branch,gender,pwd:pwd==="true"?true:false,community,aadhaarNumber,dob,bloodGroup,fatherName,motherName,phone,parentsPhone,emergencyPhone,address,instituteFeeReceipt:uploadedInstituteFeeReceipt ? uploadedInstituteFeeReceipt?.url : null,hostelFeeReceipt:uploadedHostelFeeReceipt?.url,paymentDate,amountPaid,paymentMode,outingRating:5.0,disciplineRating:5.0,userId,hostelBlockId:parseInt(hostelBlockId),cotId:parseInt(cotId)}});
        await Prisma.instituteStudent.create({data : {regNo,rollNo,name,image:uploadedImage?.url,year,branch,gender,pwd:pwd==="true"?true:false,community,aadhaarNumber,dob,bloodGroup,fatherName,motherName,phone,parentsPhone,emergencyPhone,address,instituteFeeReceipt:uploadedInstituteFeeReceipt?.url,hostelFeeReceipt:uploadedHostelFeeReceipt?.url,paymentDate,amountPaid,paymentMode,outingRating:5.0,disciplineRating:5.0,userId,hostelBlockId:parseInt(hostelBlockId),cotId:parseInt(cotId)}});

        await Prisma.cot.update({where : {id:parseInt(cotId)}, data : {status:"BLOCKED"}});

        return res.status(200).json({
            success:true,
            message:"Student Account Registered Successfully",
        })
    }catch(e){
        console.log("ERROR",e);
        return res.status(401).json({
            success:false,
            message:"Unable to create Student Account",
        })
    }
}
