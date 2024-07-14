const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();
const {uploadMedia} = require('../utilities/MediaUploader');
const bcrypt = require("bcrypt")
const PdfGenerator = require("../utilities/PdfGenerator");
const SendEmail = require('../utilities/MailSender');
const fs = require("fs");
const acknowledgementLetter = require('../mailTemplates/acknowledgementLetter');
const acknowledgementAttachment = require('../mailTemplates/acknowledgementAttachment');
const rejectionLetter = require('../mailTemplates/rejectionLetter');

exports.createHostelBlock = async(req,res) => {
    try{
        const {name,roomType,gender,floorCount,capacity,year} = req.body;
        const {image} = req.files;
        if(!name || !image || !roomType || !gender || !floorCount || !capacity || !year){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        const uploadedFile = await uploadMedia(image,process.env.FOLDER_NAME_IMAGES,null,50);
        if(!uploadedFile){
            return res.status(400).json({
                success:false,
                message:"Image Upload Failed",
            })
        }

        await Prisma.hostelBlock.create({data : {name,image:uploadedFile.secure_url,gender,roomType,floorCount,capacity,year}});
        return res.status(200).json({
            success:true,
            message:"Hostel Block Created Successfully",
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Hostel Block creation Failed",
        })
    }
}

exports.deleteHostelBlock = async(req,res) => {
    try{
        const {hostelBlockId} = req.body;

        if(!hostelBlockId){
            return res.status(404).json({
                success:false,
                message:"HostelBlock Id is missing",
            })
        }

        await Prisma.hostelBlock.delete({where : {id:hostelBlockId}});

        return res.status(200).json({
            success:true,
            message:"Deletion of HostelBlock Successful",
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Deletion of Hostel Block Failed",
        })
    }
}

exports.addWardenToHostelBlock = async(req,res) => {
    try{
        let {newWardenId,hostelBlockId} = req.body;
        newWardenId = parseInt(newWardenId);
        hostelBlockId = parseInt(hostelBlockId);

        if(!newWardenId || !hostelBlockId){
            return res.status(404).json({
                success:false,
                message:"Id's missing",
            })
        }

        const wardenDetails = await Prisma.official.findUnique({where : {id : newWardenId}});
        if(!wardenDetails){
            return res.status(404).json({
                success:false,
                message:"Warden Not Found",
            })
        }

        const hostelBlockDetails = await Prisma.hostelBlock.findUnique({where : {id : hostelBlockId}});
        if(!hostelBlockDetails){
            return res.status(404).json({
                success:false,
                message:"Hostel Block Not Found",
            })
        }

        await Prisma.official.update({where:{id:newWardenId}, data:{hostelBlockId:hostelBlockId}})

        return res.status(200).json({
            success:true,
            message:"Warden Added Successfully",
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Error adding Warden to Hostel Block",
        })
    }
}

exports.removeWardenFromHostelBlock = async(req,res) => {
    try{
        let {removeWardenId,hostelBlockId} = req.body;
        removeWardenId = parseInt(removeWardenId);
        hostelBlockId = parseInt(hostelBlockId);
        
        if(!removeWardenId || !hostelBlockId){
            return res.status(404).json({
                success:false,
                message:"Id's missing",
            })
        }

        const wardenDetails = await Prisma.official.findUnique({where : {id : removeWardenId}});
        if(!wardenDetails){
            return res.status(404).json({
                success:false,
                message:"Warden Not Found",
            })
        }

        const hostelBlockDetails = await Prisma.hostelBlock.findUnique({where : {id : hostelBlockId}});
        if(!hostelBlockDetails){
            return res.status(404).json({
                success:false,
                message:"Hostel Block Not Found",
            })
        }

        await Prisma.official.update({where:{id:removeWardenId},data:{hostelBlockId:null}});

        return res.status(200).json({
            success:true,
            message:"Warden Removed Successfully",
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Error Removing Warden From Hostel Block",
        })
    }
}

exports.createMessHall = async(req,res) => {
    try{
        const{hallName, gender, capacity} = req.body;
        if(!hallName || !gender || !capacity){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        await Prisma.messHall.create({data : { hallName, gender, capacity}});
        return res.status(200).json({
            success:true,
            message:"Mess Hall Created Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to create Mess Hall",
        })
    }
}

exports.deleteMessHall = async(req,res) => {
    try{
        const {messHallId} = req.body;
        if(!messHallId){
            return res.status(404).json({
                success:false,
                message:"Mess Hall ID is missing",
            })
        }

        await Prisma.messHall.delete({where : {id : messHallId}});
        return res.status(200).json({
            success:true,
            message:"Mess Hall Deleted Successfully",
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to delete Mess Hall",
        })
    }
}

exports.createOfficialAccount = async(req,res) => {
    try{
        const {email,password,name,designation,gender,phone} = req.body;

        if(!email || !password || !name || !designation || !gender || !phone){
            return res.status(404).json({
                success:false,
                message:"Data Missing",
            })
        }

        const ifUserAlreadyExists = await Prisma.user.findFirst({where : {email}});
        if(ifUserAlreadyExists){
            return res.status(400).json({
                success:false,
                message:"Email Already Registered",
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const user = await Prisma.user.create({data : {email,password:hashedPassword,accountType:"OFFICIAL",status:"ACTIVE"}});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Unable to create Account",
            })
        }

        await Prisma.official.create({data : {name,designation,gender,phone,userId:user?.id}});
        
        return res.status(200).json({
            success:true,
            message:"Account created Successfully",
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Failed to Create Account",
        })
    }
}

exports.deleteOfficialAccount = async(req,res) => {
    try{
        const {officialId} = req.body;
        if(!officialId){
            return res.status(404).json({
                success:false,
                message:"Data missing",
            })
        }

        const officialAccount = await Prisma.official.findUnique({where : {id : officialId}});
        if(!officialAccount){
            return res.status(404).json({
                success:false,
                message:"Official Account Not Found",
            })
        }
        const userId = officialAccount?.userId;
        if(!userId){
            return res.status(404).json({
                success:false,
                message:"User Not Found",
            })
        }
        await Prisma.official.delete({where : {id : officialAccount?.id}});

        const userAccount = await Prisma.user.findUnique({where : {id : userId}});
        if(!userAccount){
            return res.status(404).json({
                success:false,
                message:"User Account Not Found",
            })
        }
        await Prisma.user.delete({where : {id : userId}});

        return res.status(200).json({
            success:true,
            message:"Account Deleted Successfully",
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to delete account",
        })
    }
}

exports.fetchOfficialAccounts = async(_,res) => {
    try{
        const accounts = await Prisma.official.findMany({
            include : {user : true,hostelBlock:true}
        });

        return res.status(200).json({
            success:true,
            message:"Fetched Accounts Successfully",
            data : accounts,
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable To Fetch Accounts",
        })
    }
}

exports.fetchRegistrationApplications = async(_,res) => {
    try{
        const studentApplication = await Prisma.user.findMany({
            where : {
                accountType : "STUDENT",
                status : "INACTIVE",
            },
            include:{
                instituteStudent:{
                    include:{
                        cot : {
                            include : {room : true}
                        },
                        hostelBlock : true,
                    }
                }   
            }
        })

        return res.status(200).json({
            success:true,
            message:"Fetched Applications Successfully",
            data:studentApplication,
        })
    }catch(e){
        return res.status(403).json({
            success:false,
            message:"Unable to fetch Applications",
        })
    }
}

exports.acceptRegistrationApplication = async(req,res) => {
    try{
        let {userId} = req.body;
        if(userId === null){
            return res.status(404).json({
                success:false,
                message:"User Id Not Found",
            })
        }

        userId = parseInt(userId);

        const userDetails = await Prisma.user.findUnique({where : {id : userId}});
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User Details Not Found",
            })
        }

        if(userDetails?.status !== "INACTIVE"){
            return res.status(400).json({
                success:false,
                message:"Account Already Active",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId},include:{hostelBlock:true}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Details Not Found",
            })
        }

        if(studentDetails?.cotId === null){
            return res.status(404).json({
                success:false,
                message:"Cot Id Not Found",
            })
        }

        await Prisma.user.update({where : {id:userId}, data : {status:"ACTIVE"}});
        const cotDetails = await Prisma.cot.update({where : {id : studentDetails?.cotId}, data : {status : "BOOKED"}, include:{room : true}});
        await Prisma.studentAttendence.create({data : {studentId:studentDetails?.id,presentDays:[],absentDays:[]}});
        await Prisma.studentMessRecords.create({data : {studentId : studentDetails?.id, availed:{}}});
        
        try{
            let date = new Date();
            date = date.toLocaleDateString();
            const pdfPath = await PdfGenerator(acknowledgementAttachment(date,studentDetails?.image,studentDetails?.name,studentDetails?.phone,studentDetails?.year,studentDetails?.rollNo,studentDetails?.regNo,studentDetails?.paymentMode,studentDetails?.amountPaid,studentDetails?.hostelBlock?.name,cotDetails?.room?.roomNumber,cotDetails?.cotNo), `${studentDetails?.rollNo}.pdf`);
            await SendEmail(userDetails?.email,"HOSTEL ALLOTMENT CONFIRMATION | NIT ANDHRA PRADESH",acknowledgementLetter(),pdfPath,`${studentDetails?.rollNo}.pdf`);
            fs.unlinkSync(pdfPath);
        }catch(e){
            console.log(e);
            return res.status(400).json({
                success:false,
                message:"Error Sending Confirmation Email",
            });
        };

        return res.status(200).json({
            success:true,
            message:"Accepted Registration Application",
        })


    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to Accept Registration Application",
        })
    }
}

exports.rejectRegistrationApplication = async(req,res) => {
    try{
        let {userId,remarks} = req.body;
        if(!userId || !remarks){
            return res.status(404).json({
                success:false,
                message:"Data Missing",
            })
        }

        userId = parseInt(userId);
        const userDetails = await Prisma.user.findUnique({where : {id : userId}});
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User Account Not Found",
            })
        }


        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Not Created",
            })
        }

        if(studentDetails?.cotId === null){
            return res.status(404).json({
                success:false,
                message:"Cot Not Found",
            })
        }

        await Prisma.cot.update({where : {id : studentDetails?.cotId}, data : {status:"AVAILABLE"}});
        await Prisma.instituteStudent.delete({where : {id : studentDetails?.id}});
        await Prisma.user.delete({where : {id : userId}});

        try{
            await SendEmail(userDetails?.email,"HOSTEL ALLOTMENT APPLICATION DECLINED | NIT ANDHRA PRADESH",rejectionLetter(remarks));
        }catch(e){
            console.log(e);
            return res.status(400).json({
                success:false,
                message:"Error Sending Rejection Email",
            });
        };

        return res.status(200).json({
            success:true,
            message:"Application Rejected",
        })
    }catch(e){
        console.log("ERROR",e);
        return res.status(400).json({
            success:false,
            message:"Unable to Reject Registration Application"
        })
    }
}