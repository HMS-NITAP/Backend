const OTPgenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SendEmail = require("../utilities/MailSender")
const emailVerification = require('../mailTemplates/emailVerification');
// const {passwordUpdated} = require('../mailTemplates/passwordUpdate');
const resetPassword = require('../mailTemplates/resetPassword');
const crypto = require('crypto');

const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();


exports.sendOTP = async (req,res) => {
    try{
        const {email} = req.body;


        // const isEmailExistsAlready = await Prisma.user.findUnique({where:{email}});
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
            OTP:otp, // REMOVE THIS LINE BEFORE DEPLOYMENT
            message:"OTP Successfully Created in DB",
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"OTP Gereration Failed",
        })
    }
}

// Handle expire date of OTP --> delete them after 5 mins time
exports.signup = async(req,res) => {
    try{
        console.log("Here");
        const {email,password,confirmPassword,accountType,otp} = req.body;

        if(!email || !password || !confirmPassword || !accountType || !otp){
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

        const hashedPassword = await bcrypt.hash(password,10);
        const details = await Prisma.user.create({data:{email,password:hashedPassword,accountType}});
        console.log("Details : ",details);
        if(accountType === "STUDENT"){
            await Prisma.instituteStudent.create({data : {regNo:null,rollNo:null,name:null,year:null,branch:null,gender:null,pwd:null,community:null,aadharNumber:null,dob:null,bloodGroup:null,fatherName:null,motherName:null,phone:null,parentsPhone:null,emergencyPhone:null,address:null,isHosteller:null,outingRating:5.0,disciplineRating:5.0,user: {connect: { id: details.id }}}});
        }else if(accountType === "OFFICIAL"){
            await Prisma.official.create({data : {empId:null,name:null,designation:null,gender:null,phone:null,user: {connect: { id: details.id }}}});
        }
        return res.status(200).json({
            success:true,
            message:"User Registered Successfully",
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Signup Operation Failed",
        })
    }
}

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

        const passwordMatch = await bcrypt.compare(password,ifUserExists.password);
        if(passwordMatch){
            const payload = {
                email : ifUserExists.email,
                id : ifUserExists.id,
                accountType : ifUserExists.accountType,
            }

            const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"100h"});
            ifUserExists.token = token;
            ifUserExists.password = undefined;

            const options2 = {
                expires : new Date(Date.now() + 7*24*60*60*1000), // 7days
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

// exports.changePassword = async(req,res) => {
//     try{
//         const {oldPassword,newPassword} = req.body;
//         const id = req.user.id;

//         const user = await Prisma.user.findFirst({where : {id}});
//         if(!user){
//             return res.status(404).json({
//                 success:false,
//                 message:"Invalid User Id",
//             })
//         }

//         const passwordValid = await bcrypt.compare(oldPassword,user.password);

//         if(!passwordValid){
//             return res.status(400).json({
//                 success:false,
//                 message:"Old Password Incorrect",
//             });
//         };

//         const newHashedPassword = await bcrypt.hash(newPassword,10);
//         const updatedUser = await Prisma.user.update({where : {id:req.user.id},data:{password:newHashedPassword}});

//         try{
//             await SendEmail(updatedUser.email,"Password Reset Successful | NIT Andhra Pradesh HMS",passwordUpdated(updatedUser.email));
//         }catch(e){
//             return res.status(400).json({
//                 success:false,
//                 message:"Error sending Updated Password Email",
//             });
//         }
//     }catch(e){
//         return res.status(400).json({
//             success:false,
//             message:"Password cannot be changed",
//         })
//     }
// }

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
        await SendEmail(email,"Reset Password Link | NIT Andhra Pradesh HMS",resetPassword(token));
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