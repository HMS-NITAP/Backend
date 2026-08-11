const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();
// const {UploadMedia} = require('../utilities/MediaUploader');
const bcrypt = require("bcrypt")
const PdfGenerator = require("../utilities/PdfGenerator");
const SendEmail = require('../utilities/MailSender');
const fs = require("fs");
const acknowledgementLetter = require('../mailTemplates/acknowledgementLetter');
const acknowledgementAttachment = require('../mailTemplates/acknowledgementAttachment');
const rejectionLetter = require('../mailTemplates/rejectionLetter');
const freezeLetter = require('../mailTemplates/freezeLetter');
const XLSX = require('xlsx');
const evenSemAcknowledgementAttachement = require('../mailTemplates/evenSemAcknowledgementAttachement');
const evenSemAcknowledgementLetter = require('../mailTemplates/evenSemAcknowledgementLetter');
const evenSemRejectionLetter = require('../mailTemplates/evenSemRejectionLetter');
const { uploadMediaToS3, buildS3ObjectUrl, s3ObjectExists } = require('../utilities/S3mediaUploader');
const { findRegNoConflict, findRollNoConflict, validateRollNoFormat } = require('../utilities/StudentIdentifiers');
const firstYearAcknowlegdementLetterAttachment = require('../mailTemplates/firstYearAcknowlegdementLetterAttachment');
const messIdCardAttachment = require('../mailTemplates/messIdCardAttachment');

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

        // const uploadedFile = await UploadMedia(image,process.env.FOLDER_NAME_IMAGES);
        const uploadedFile = await uploadMediaToS3(image,process.env.FOLDER_NAME_EXTRAS,name);
        if(!uploadedFile){
            return res.status(400).json({
                success:false,
                message:"Image Upload Failed",
            })
        }

        await Prisma.hostelBlock.create({data : {name,image:uploadedFile.url,gender,roomType,floorCount,capacity,year}});
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
            const pdfPath = await PdfGenerator(acknowledgementAttachment(date,studentDetails?.image,studentDetails?.name,studentDetails?.phone,studentDetails?.year,studentDetails?.rollNo,studentDetails?.regNo,studentDetails?.paymentMode,studentDetails?.amountPaid,studentDetails?.hostelBlock?.name,cotDetails?.room?.roomNumber,cotDetails?.cotNo, studentDetails?.gender, cotDetails?.room?.floorNumber), `${studentDetails?.rollNo}.pdf`);
            await SendEmail(userDetails?.email,`HOSTEL ALLOTMENT CONFIRMATION - ${studentDetails?.rollNo} | NIT ANDHRA PRADESH`,acknowledgementLetter(),pdfPath,`${studentDetails?.rollNo}.pdf`);
            // await SendEmail("hosteloffice@nitandhra.ac.in",`${studentDetails?.rollNo} - HMS 1st Year Confirmation  | NIT Andhra Pradesh`,acknowledgementLetter(),pdfPath,`${studentDetails?.rollNo}.pdf`);
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

exports.freezeRegistrationApplication = async(req,res) => {
    try{
        let {userId,remarks} = req.body;
        if(!userId || !remarks){
            return res.status(404).json({
                success:false,
                message:"data Is Missing",
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

        if(userDetails?.status !== "INACTIVE"){
            return res.status(400).json({
                success:false,
                message:"Account Already Active",
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

        await Prisma.user.update({where : {id:userId}, data : {status:"FREEZED"}});

        try{
            await SendEmail(userDetails?.email,"Registration Temporarily Suspended | NIT ANDHRA PRADESH",freezeLetter(remarks));
        }catch(e){
            console.log(e);
            return res.status(400).json({
                success:false,
                message:"Error Sending Email",
            });
        };

        return res.status(200).json({
            success:true,
            message:"Application Freezed Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Freeze",
        })
    }
}

exports.confirmFreezedStudentRegistration = async(req,res) => {
    try{
        let {userId} = req.body;
        console.log(req.body);
        if(!userId){
            return res.status(404).json({
                success:false,
                message:"Unable to Confirm Freezed Student registration",
            })
        }

        userId = parseInt(userId);

        const userDetails = await Prisma.user.findUnique({where : {id : userId}});
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User Not Found",
            })
        }

        if(userDetails?.status !== "FREEZED"){
            return res.status(400).json({
                success:false,
                message:"Account Not Already Freezeds",
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
            const pdfPath = await PdfGenerator(acknowledgementAttachment(date,studentDetails?.image,studentDetails?.name,studentDetails?.phone,studentDetails?.year,studentDetails?.rollNo,studentDetails?.regNo,studentDetails?.paymentMode,studentDetails?.amountPaid,studentDetails?.hostelBlock?.name,cotDetails?.room?.roomNumber,cotDetails?.cotNo,studentDetails?.gender, cotDetails?.room?.floorNumber), `${studentDetails?.rollNo}.pdf`);
            await SendEmail(userDetails?.email,`HOSTEL ALLOTMENT CONFIRMATION - ${studentDetails?.rollNo} | NIT ANDHRA PRADESH`,acknowledgementLetter(),pdfPath,`${studentDetails?.rollNo}.pdf`);
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
            message:"Unable to Accept the Application"
        })
    }
}

exports.deleteFreezedStudentApplication = async(req, res) => {
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

        if(userDetails?.status !== "FREEZED"){
            return res.status(402).json({
                success:false,
                message:"Account is not in Freezed state",
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
        return res.status(400).json({
            success: false,
            message: "Unable to delete application",
        })
    }
}

exports.fetchFreezedApplications = async(_,res) => {
    try{
        const studentApplication = await Prisma.user.findMany({
            where : {
                accountType : "STUDENT",
                status : "FREEZED",
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
            message:"Successfully fetched Applications",
            data : studentApplication,
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Fetched Application Successfully",
        })
    }
}

exports.deleteAnnouncement = async(req,res) => {
    try{
        const {announcementId} = req.body;
        const {id} = req.user;

        if(!announcementId || !id){
            return res.status(404).json({
                success:false,
                message:"Data missing",
            })
        }

        await Prisma.announcement.delete({where : {id : announcementId}});

        return res.status(200).json({
            success:true,
            message:"Deleted Announcement Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Announcement Deletion Failed",
        })
    }
}

exports.getDashboardData = async (_, res) => {
    try {
      const result = await Prisma.hostelBlock.findMany({
        include: {
          rooms: {
            include: {
              cots: true,
            },
          },
        },
      });

      let overallAvailableCots = 0;
      let overallBookedCots = 0;
      let overallBlockedCots = 0;

      const formattedResult = result.map((block) => {
        const totalRooms = block.rooms.length;
        const totalCots = block.rooms.reduce((acc, room) => acc + room.cots.length, 0);
        const bookedCots = block.rooms.reduce((acc, room) => acc + room.cots.filter(cot => cot.status === 'BOOKED').length, 0);
        const blockedCots = block.rooms.reduce((acc, room) => acc + room.cots.filter(cot => cot.status === 'BLOCKED').length, 0);
        const availableCots = block.rooms.reduce((acc, room) => acc + room.cots.filter(cot => cot.status === 'AVAILABLE').length, 0);

        overallAvailableCots += availableCots;
        overallBookedCots += bookedCots;
        overallBlockedCots += blockedCots;

        return {
          blockId: block.id,
          blockName: block.name,
          floorCount : block.floorCount,
          totalRooms,
          totalCots,
          bookedCots,
          blockedCots,
          availableCots,
        };
      });

      const activeStudentsCount = await Prisma.user.count({
        where: {
          accountType: 'STUDENT',
          OR: [
            { status: 'ACTIVE' },
            { status: 'ACTIVE1' },
          ],
        },
      });


      const inactiveStudentsCount = await Prisma.user.count({
        where: {
          accountType: 'STUDENT',
          status: 'INACTIVE',
        },
      });

      const freezedStudentsCount = await Prisma.user.count({
        where: {
          accountType: 'STUDENT',
          status: 'FREEZED',
        },
      });

      return res.status(200).json({
        success: true,
        message: "Fetched Data Successfully",
        data : {formattedResult,overallAvailableCots,overallBookedCots,overallBlockedCots,activeStudentsCount,inactiveStudentsCount,freezedStudentsCount}
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Unable to Fetch Data",
      });
    }
};

exports.sendAcknowledgementLetter = async(req,res) => {
    try{
        const {userId} = req.body;
        if(!userId){
            return res.status(404).json({
                success:false,
                message:"ID missing",
            })
        }

        const userDetails = await Prisma.user.findUnique({where : {id : userId}});
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User Details Not Found",
            })
        }

        if(userDetails?.status !== "ACTIVE"){
            return res.status(400).json({
                success:false,
                message:"Account Not Active",
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

        const cotDetails = await Prisma.cot.findUnique({where : {id : studentDetails?.cotId}, include:{room : true}});
        if(!cotDetails || cotDetails?.status!=="BOOKED"){
            return res.status(401).json({
                success:false,
                message:"Invalid Details",
            })
        }

        try{
            let date = new Date();
            date = date.toLocaleDateString();
            if(studentDetails?.hostelFeeReceipt2 === null){
                // ODD SEM
                const pdfPath = await PdfGenerator(acknowledgementAttachment(date,studentDetails?.image,studentDetails?.name,studentDetails?.phone,studentDetails?.year,studentDetails?.rollNo,studentDetails?.regNo,studentDetails?.paymentMode,studentDetails?.amountPaid,studentDetails?.hostelBlock?.name,cotDetails?.room?.roomNumber,cotDetails?.cotNo, studentDetails?.gender, cotDetails?.room?.floorNumber), `${studentDetails?.rollNo}.pdf`);
                await SendEmail(userDetails?.email,`HOSTEL ALLOTMENT CONFIRMATION - ${studentDetails?.rollNo} | NIT ANDHRA PRADESH`,acknowledgementLetter(),pdfPath,`${studentDetails?.rollNo}.pdf`);
                // await SendEmail('hosteloffice@nitandhra.ac.in',`HOSTEL ALLOTMENT CONFIRMATION ${studentDetails?.rollNo}`,acknowledgementLetter(),pdfPath,`${studentDetails?.rollNo}.pdf`);
                fs.unlinkSync(pdfPath);
            }else{
                // EVEN SEM
                const pdfPath = await PdfGenerator(evenSemAcknowledgementAttachement(date,studentDetails?.image,studentDetails?.name,studentDetails?.phone,studentDetails?.year,studentDetails?.rollNo,studentDetails?.regNo,studentDetails?.paymentMode2,studentDetails?.amountPaid2,studentDetails?.hostelBlock?.name,cotDetails?.room?.roomNumber,cotDetails?.cotNo, studentDetails?.gender, cotDetails?.room?.floorNumber), `${studentDetails?.rollNo}.pdf`);
                await SendEmail(userDetails?.email,"HOSTEL ALLOTMENT CONFIRMATION | NIT ANDHRA PRADESH",evenSemAcknowledgementLetter(),pdfPath,`${studentDetails?.rollNo}.pdf`);
                fs.unlinkSync(pdfPath);
            }
        }catch(e){
            console.log(e);
            return res.status(400).json({
                success:false,
                message:"Error Sending Confirmation Email",
            });
        };

        return res.status(200).json({
            success:true,
            message:"Sent Letter Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Send Acknowledgement Letter",
        })
    }
}

exports.fetchRoomsInHostelBlock = async(req,res) => {
    try{
        const {hostelBlockId} = req.body;
        if(!hostelBlockId){
            return res.status(404).json({
                success:false,
                message:"Hostel Block Id Missing",
            })
        }

        const hostelBlockRooms = await Prisma.room.findMany({where : {hostelBlockId}, orderBy: [{ floorNumber: 'asc' }, { roomNumber: 'asc' }]});
        if(!hostelBlockRooms){
            return res.status(404).json({
                success:false,
                message:"Unable to Fetch Block Rooms",
            })
        }

        return res.status(200).json({
            success:true,
            message:"Successfully fetched Rooms",
            data : hostelBlockRooms,
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to fetch Rooms",
        })
    }
}

exports.fetchCotsInRooms = async(req,res) => {
    try{
        const {roomId} = req.body;
        if(!roomId){
            return res.status(400).json({
                success:false,
                message:"Room ID not Found",
            })
        }

        const roomDetails = await Prisma.room.findFirst({
            where: { id: roomId },
            include: {
              cots: {
                orderBy: [{ cotNo: 'asc' }],
                include: { student: true },
              },
            },
        });

        if(!roomDetails){
            return res.status(404).json({
                success:false,
                message:"Room Details Not Found",
            })
        }

        return res.status(200).json({
            success:true,
            message:"Room Details Found Successfully",
            data : roomDetails,
        })

    }catch(e){
        console.log("error",e);
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Cots",
        })
    }
}

exports.fetchStudentByRollNoAndRegNo = async(req,res) => {
    try{
        const {idNumber} = req.body;
        if(!idNumber){
            return res.status(404).json({
                success:false,
                message:"ID is missing",
            })
        }

        const trimmedIdNumber = String(idNumber).trim();
        if(!/^[0-9]+$/.test(trimmedIdNumber)){
            return res.status(402).json({
                success:false,
                message:"Invalid ID number",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {OR : [{rollNo : trimmedIdNumber},{regNo : trimmedIdNumber}]}, include:{user:true, outingApplication: {include: { verifiedBy: { select: { name: true,designation: true}}, hostelBlock: true } }, hostelComplaints: { include: {resolvedBy: { select: { name: true, designation: true }},hostelBlock: true} }, messHall:true, cot:{include:{room:{include : {hostelBlock:true}}}}}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Not Found",
            })
        }

        return res.status(200).json({
            success:true,
            message:"Fetched Student Data",
            data : studentDetails,
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"unable to Fetch Student",
        })
    }
}

const STUDENT_LIST_MAX_PAGE_SIZE = 200;
const STUDENT_LIST_DEFAULT_PAGE_SIZE = 25;
const BRANCH_VALUES = ["CSE","ECE","EEE","MECH","CIVIL","BIOTECH","CHEM","MME"];

const STUDENT_LIST_SELECT = {
    id: true,
    name: true,
    rollNo: true,
    regNo: true,
    year: true,
    branch: true,
    gender: true,
    user: { select: { status: true } },
    hostelBlock: { select: { id: true, name: true } },
    cot: { select: { cotNo: true, room: { select: { roomNumber: true, floorNumber: true } } } },
};

const STUDENT_BASIC_EXPORT_SELECT = {
    ...STUDENT_LIST_SELECT,
    dateOfJoining: true,
    user: { select: { email: true, status: true } },
};

const STUDENT_FULL_EXPORT_INCLUDE = {
    user: { select: { email: true, status: true } },
    hostelBlock: { select: { id: true, name: true } },
    cot: { include: { room: true } },
};

const STUDENT_LIST_ORDER_BY = [
    { hostelBlock: { name: 'asc' } },
    { rollNo: 'asc' },
];

// Shared by the paginated list and the xlsx export so both always agree on what "matches the filters" means.
const buildStudentListFilters = ({ year, branch, hostelBlockId, floorNumber, search }) => {
    const where = {};

    if(year){
        where.year = String(year);
    }

    if(branch){
        if(!BRANCH_VALUES.includes(branch)){
            throw new Error(`Invalid branch: ${branch}`);
        }
        where.branch = branch;
    }

    if(hostelBlockId){
        const parsedHostelBlockId = parseInt(hostelBlockId);
        if(isNaN(parsedHostelBlockId)){
            throw new Error(`Invalid hostel block: ${hostelBlockId}`);
        }
        where.hostelBlockId = parsedHostelBlockId;
    }

    if(floorNumber !== undefined && floorNumber !== null && floorNumber !== ""){
        const parsedFloorNumber = parseInt(floorNumber);
        if(isNaN(parsedFloorNumber)){
            throw new Error(`Invalid floor: ${floorNumber}`);
        }
        where.cot = { room: { floorNumber: parsedFloorNumber } };
    }

    const trimmedSearch = typeof search === "string" ? search.trim() : "";
    if(trimmedSearch){
        where.OR = [
            { name: { contains: trimmedSearch, mode: "insensitive" } },
            { rollNo: { contains: trimmedSearch, mode: "insensitive" } },
            { regNo: { contains: trimmedSearch, mode: "insensitive" } },
        ];
    }

    return where;
};

const parsePagination = ({ page, limit }) => {
    const parsedPage = Math.max(parseInt(page) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit) || STUDENT_LIST_DEFAULT_PAGE_SIZE, 1), STUDENT_LIST_MAX_PAGE_SIZE);
    return { parsedPage, parsedLimit };
};

const mapStudentToBasicExportRow = (student) => ({
    Name: student.name,
    Roll_Number: student.rollNo,
    Registration_Number: student.regNo,
    Email: student.user?.email ?? 'N/A',
    Year: student.year,
    Branch: student.branch,
    Gender: student.gender,
    Block_Name: student.hostelBlock?.name ?? 'N/A',
    Floor_Number: student.cot?.room?.floorNumber ?? 'N/A',
    Room_Number: student.cot?.room?.roomNumber ?? 'N/A',
    Cot_Number: student.cot?.cotNo ?? 'N/A',
    Date_Of_Joining: student.dateOfJoining ? new Date(student.dateOfJoining).toISOString().split('T')[0] : 'N/A',
    Account_Status: student.user?.status ?? 'N/A',
});

const mapStudentToSensitiveExportFields = (student) => ({
    Community: student.community ?? 'N/A',
    PWD: student.pwd ? 'Yes' : 'No',
    Date_Of_Birth: student.dob ?? 'N/A',
    Blood_Group: student.bloodGroup ?? 'N/A',
    Aadhaar_Number: student.aadhaarNumber ?? 'N/A',
    Father_Name: student.fatherName ?? 'N/A',
    Mother_Name: student.motherName ?? 'N/A',
    Phone_Number: student.phone ?? 'N/A',
    Parents_Number: student.parentsPhone ?? 'N/A',
    Emergency_Number: student.emergencyPhone ?? 'N/A',
    Address: student.address ?? 'N/A',
    Amount_Paid: student.amountPaid ?? 'N/A',
});

const mapStudentToExportRow = (student, includeSensitive) => ({
    ...mapStudentToBasicExportRow(student),
    ...(includeSensitive ? mapStudentToSensitiveExportFields(student) : {}),
});

exports.fetchAllStudents = async (req, res) => {
    try{
        let where;
        try{
            where = buildStudentListFilters(req.body);
        }catch(e){
            return res.status(400).json({
                success: false,
                message: e.message,
            });
        }

        const { parsedPage, parsedLimit } = parsePagination(req.body);

        const total = await Prisma.instituteStudent.count({ where });
        const totalPages = Math.max(Math.ceil(total / parsedLimit), 1);
        const currentPage = Math.min(parsedPage, totalPages);

        const students = await Prisma.instituteStudent.findMany({
            where,
            select: STUDENT_LIST_SELECT,
            orderBy: STUDENT_LIST_ORDER_BY,
            skip: (currentPage - 1) * parsedLimit,
            take: parsedLimit,
        });

        return res.status(200).json({
            success: true,
            message: "Successfully fetched students.",
            data: {
                students,
                total,
                page: currentPage,
                limit: parsedLimit,
                totalPages,
            },
        });
    }catch(e){
        console.log("ERROR WHILE FETCHING ALL STUDENTS:", e);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch students.",
        });
    }
};

exports.exportStudentsXlsxFile = async (req, res) => {
    try{
        let where;
        try{
            where = buildStudentListFilters(req.body);
        }catch(e){
            return res.status(400).json({
                success: false,
                message: e.message,
            });
        }

        // scope "page" exports only what the admin currently has on screen, anything else exports every match.
        const isCurrentPageOnly = req.body?.scope === "page";
        // Sensitive columns require an explicit opt-in, so anything but "full" yields the basic sheet.
        const includeSensitive = req.body?.detail === "full";
        const { parsedPage, parsedLimit } = parsePagination(req.body);

        const students = await Prisma.instituteStudent.findMany({
            where,
            ...(includeSensitive ? { include: STUDENT_FULL_EXPORT_INCLUDE } : { select: STUDENT_BASIC_EXPORT_SELECT }),
            orderBy: STUDENT_LIST_ORDER_BY,
            ...(isCurrentPageOnly ? { skip: (parsedPage - 1) * parsedLimit, take: parsedLimit } : {}),
        });

        if(students.length === 0){
            return res.status(404).json({
                success: false,
                message: "No students matched the applied filters.",
            });
        }

        if(includeSensitive){
            console.log(`FULL PII EXPORT: adminId=${req.user?.id} email=${req.user?.email} rows=${students.length} scope=${isCurrentPageOnly ? "page" : "all"}`);
        }

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(students.map((student) => mapStudentToExportRow(student, includeSensitive)));
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        const fileName = `Students_${includeSensitive ? 'full' : 'basic'}_${isCurrentPageOnly ? `page_${parsedPage}_` : ''}${new Date().toISOString().split('T')[0]}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        return res.status(200).send(buffer);
    }catch(e){
        console.log("ERROR WHILE EXPORTING STUDENTS:", e);
        return res.status(500).json({
            success: false,
            message: "Unable to export students.",
        });
    }
};

exports.downloadStudentDetailsInHostelBlockXlsxFile = async (req, res) => {
    try{
        const { hostelBlockId } = req.body;

        if(!hostelBlockId){
            return res.status(404).json({
                success: false,
                message: "Hostel Block ID",
            });
        }

        const studentDetails = await Prisma.instituteStudent.findMany({
            where: { hostelBlockId: hostelBlockId },
            include: {
                user: true,
                cot: {
                    include : {
                        room : true
                    }
                },
            }
        });

        if(!studentDetails){
            return res.status(404).json({
                success: false,
                message: "Unable to fetch student details in the hostel block",
            });
        }

        if(studentDetails?.length === 0){
            return res.status(200).json({
                success: true,
                message: "No Students present in this block",
            });
        }

        const hostelBlockData = await Prisma.hostelBlock.findUnique({where : {id : hostelBlockId}});
        if(!hostelBlockData){
            return res.status(404).json({
                success:false,
                message:"Unable to Fetch Data",
            })
        }

        const data = studentDetails.map(student => ({
            Registration_Number: student.regNo,
            Roll_Number: student.rollNo,
            Name: student.name,
            Year: student.year,
            Branch: student.branch,
            Gender: student.gender,
            PWD: student.pwd,
            Community: student.community,
            Aadhar_Number: student.aadhaarNumber,
            Date_Of_Birth: student.dob,
            Blood_Group: student.bloodGroup,
            Father_Name: student.fatherName,
            Mother_Name: student.motherName,
            Phone_Number: student.phone,
            Parents_Number: student.parentsPhone,
            Emergency_Number: student.emergencyPhone,
            Address: student.address,
            Outing_Rating: String(student.outingRating),
            Discipline_Rating: String(student.disciplineRating),
            Cot_Number: student.cot?.cotNo,
            Room_Number: student.cot?.room?.roomNumber,
            Floor_Number: student.cot?.room?.floorNumber,
            Email: student.user.email,
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(workbook, worksheet, 'StudentDetails');

        const fileName = `students_in_HostelBlock_${hostelBlockData?.name}.xlsx`;
        const filePath = `./${fileName}`;
        XLSX.writeFile(workbook, filePath);

        const emailBody = `<p>Please find the attached .xlsx file containing the student details ${hostelBlockData?.name} Hall of Residence.</p>`;

        await SendEmail("hosteloffice@nitandhra.ac.in", "Hostel Block Student Details | HMS NIT AP", emailBody, filePath, fileName);

        fs.unlinkSync(filePath);

        return res.status(200).json({
            success: true,
            message: "File has been sent to the provided email.",
        });

    }catch(e){
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch student details or send email. Please try again later!",
        });
    }
}

exports.deleteStudentAccount = async(req,res) => {
    try{
        const {userId} = req.body;
        if(!userId){
            return res.status(404).json({
                success:false,
                message:"ID is missing",
            })
        }

        const userDetails = await Prisma.user.findUnique({where : {id : userId}, include:{instituteStudent:true}});
        if(!userDetails || !userDetails.instituteStudent){
            return res.status(404).json({
                success:false,
                message:"User Account Not Found",
            })
        }

        if(userDetails?.status === "FREEZED" || userDetails?.status === "INACTIVE"){
            return res.status(404).json({
                success:false,
                message:"Can't Delete this account",
            })
        }

        try{
            await Prisma.messRatingAndReview.deleteMany({where : {createdById : userDetails?.instituteStudent?.id}});
        }catch(e){}

        try{
            await Prisma.outingApplication.deleteMany({where : {instituteStudentId : userDetails?.instituteStudent?.id}});
        }catch(e){}

        try{
            await Prisma.hostelComplaint.deleteMany({where : {instituteStudentId : userDetails?.instituteStudent?.id}});
        }catch(e){}

        try{
            await Prisma.studentAttendence.delete({where : {studentId : userDetails?.instituteStudent?.id}});
        }catch(e){}

        try{
            await Prisma.studentMessRecords.delete({where : {studentId : userDetails?.instituteStudent?.id}});
        }catch(e){}

        try{
            await Prisma.cot.update({where : {id : userDetails?.instituteStudent?.cotId}, data : {status : "AVAILABLE"}});
        }catch(e){}

        await Prisma.instituteStudent.delete({where : {id : userDetails?.instituteStudent?.id}});
        await Prisma.user.delete({where : {id : userDetails?.id}});

        return res.status(200).json({
            success:true,
            message:"Deleted Student Account",
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to Delete Student Account",
        })
    }
}

exports.changeStudentProfilePhoto = async(req,res) => {
    try{
        let {instituteStudentId} = req.body;
        const {newProfilePic} = req.files;
        if(!instituteStudentId || !newProfilePic){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        instituteStudentId = parseInt(instituteStudentId);

        // const uploadedProfilePic = await UploadMedia(newProfilePic,process.env.FOLDER_NAME_IMAGES);
        const uploadedProfilePic = await uploadMediaToS3(newProfilePic,process.env.FOLDER_NAME_PROFILE_IMAGES);
        if(!uploadedProfilePic){
            return res.status(400).json({
                success:false,
                message:"Profile Picture Upload Failed",
            })
        }

        await Prisma.instituteStudent.update({where : {id : instituteStudentId}, data:{image:uploadedProfilePic?.url}});
        return res.status(200).json({
            success:true,
            message:"Changed Image Successfully",
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to Change Student Profile Photo",
        })
    }
}

exports.fetchCotsForChangeCotOption = async(req,res) => {
    try{
        let {userId} = req.body;
        if(!userId){
            return res.status(404).json({
                success:false,
                message:"ID is missing",
            })
        }
        userId = parseInt(userId);

        const userDetails = await Prisma.user.findUnique({where : {id : userId}, include:{instituteStudent : true}});
        if(!userDetails || !userDetails?.instituteStudent){
            return res.status(404).json({
                success:false,
                message:"Student Account Not Found",
            })
        }

        const studentYear = userDetails?.instituteStudent?.year;
        const studentGender = userDetails?.instituteStudent?.gender;
        if(!studentGender || !studentYear){
            return res.status(403).json({
                success:false,
                message:"Data is Missing",
            })
        }

        const requiredData = await Prisma.hostelBlock.findMany({
            where : {
                gender : studentGender,
                year : studentYear
            },
            include: {
              rooms: {
                include: {
                  cots: {
                    orderBy: {
                      cotNo: 'asc',
                    },
                  },
                },
                orderBy: [
                  {
                    floorNumber: 'asc',
                  },
                  {
                    roomNumber: 'asc',
                  },
                ],
              },
            },
            orderBy: {
              id: 'asc',
            },
          });


        return res.status(200).json({
            success:true,
            message:"Fetched Data",
            data:requiredData,
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Rooms",
        })
    }
}

exports.swapOrExchangeCot = async(req,res) => {
    try{
        let {currentCotId,changeToCotId} = req.body;
        if(!currentCotId || !changeToCotId){
            return res.status(404).json({
                success:false,
                message:"Data Not Found",
            })
        }

        currentCotId = parseInt(currentCotId);

        const currentCotDetails = await Prisma.cot.findUnique({where : {id : currentCotId}, include : {student:{include:{user:true}}, room:true}});
        const changeToCotDetails = await Prisma.cot.findUnique({where : {id : changeToCotId}, include : {student:{include:{user:true}}, room:true}});

        if(currentCotDetails?.student?.user?.status !== ("ACTIVE" || "ACTIVE1")){
            return res.status(402).json({
                success:false,
                message:"Invalid Operation",
            })
        }

        if(currentCotDetails?.student?.user?.status==="FREEZED" || currentCotDetails?.student?.user?.status==="INACTIVE" || changeToCotDetails?.student?.user?.status==="FREEZED" || changeToCotDetails?.student?.user?.status==="INACTIVE"){
            return res.status(402).json({
                success:false,
                message:"Invalid Operation",
            })
        }

        if(changeToCotDetails?.status === "BLOCKED" || currentCotDetails?.status === "BLOCKED" || currentCotDetails?.status === "AVAILABLE"){
            return res.status(402).json({
                success:false,
                message:"Cot is in BLOCKED State",
            })
        }else if(changeToCotDetails?.status === "AVAILABLE"){
            await Prisma.cot.update({where : {id : changeToCotId}, data : {status : "BOOKED"}});
            await Prisma.instituteStudent.update({where : {id : currentCotDetails?.student?.id}, data : {cotId : changeToCotId, hostelBlockId : changeToCotDetails?.room?.hostelBlockId}});
            await Prisma.cot.update({where : {id : currentCotId}, data : {status : "AVAILABLE"}});

        }else if(changeToCotDetails?.status === "BOOKED"){
            await Prisma.instituteStudent.update({where : {id : currentCotDetails?.student?.id}, data: {cot: {disconnect: true}}});
            await Prisma.instituteStudent.update({where : {id : changeToCotDetails?.student?.id}, data : {cotId : currentCotId, hostelBlockId:currentCotDetails?.room?.hostelBlockId}});
            await Prisma.instituteStudent.update({where : {id : currentCotDetails?.student?.id}, data : {cotId : changeToCotId, hostelBlockId:changeToCotDetails?.room?.hostelBlockId}});

        }else{
            return res.status(402).json({
                success:false,
                message:"Invalid Operation",
            })
        }

        return res.status(200).json({
            success:true,
            message:"Changed Cot Successfully",
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to change Cot"
        })
    }
}

exports.fetchEvenSemRegistrationApplications = async(_,res) => {
    try{
        const studentApplication = await Prisma.user.findMany({
            where: {
              accountType: "STUDENT",
              status: "ACTIVE1",
              instituteStudent: {
                hostelFeeReceipt2: {
                  not: null,
                },
              },
            },
            include: {
              instituteStudent: {
                include: {
                  cot: {
                    include: { room: true },
                  },
                  hostelBlock: true,
                },
              },
            },
        });

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

exports.acceptEvenSemRegistrationApplication = async(req,res) => {
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

        if(userDetails?.status !== "ACTIVE1"){
            return res.status(400).json({
                success:false,
                message:"INVALID OPERATION",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId}, include:{hostelBlock:true}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Details Not Found",
            })
        }

        await Prisma.user.update({where : {id:userId}, data : {status:"ACTIVE"}});
        const cotDetails = await Prisma.cot.findUnique({where : {id : studentDetails?.cotId},include:{room : true}});

        try{
            let date = new Date();
            date = date.toLocaleDateString();
            const pdfPath = await PdfGenerator(evenSemAcknowledgementAttachement(date,studentDetails?.image,studentDetails?.name,studentDetails?.phone,studentDetails?.year,studentDetails?.rollNo,studentDetails?.regNo,studentDetails?.paymentMode2,studentDetails?.amountPaid2,studentDetails?.hostelBlock?.name,cotDetails?.room?.roomNumber,cotDetails?.cotNo, studentDetails?.gender, cotDetails?.room?.floorNumber), `${studentDetails?.rollNo}.pdf`);
            await SendEmail(userDetails?.email,"HOSTEL ALLOTMENT CONFIRMATION | NIT ANDHRA PRADESH",evenSemAcknowledgementLetter(),pdfPath,`${studentDetails?.rollNo}.pdf`);
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

exports.rejectEvenSemRegistrationApplication = async(req,res) => {
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

        if(userDetails?.status !== "ACTIVE1"){
            return res.status(400).json({
                success:false,
                message:"INVALID OPERATION",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Not Created",
            })
        }

        await Prisma.instituteStudent.update({where:{id:studentDetails?.id}, data:{hostelFeeReceipt2:null}});

        try{
            await SendEmail(userDetails?.email,"HOSTEL ALLOTMENT APPLICATION DECLINED | NIT ANDHRA PRADESH",evenSemRejectionLetter(remarks));
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

exports.sendAcknowledgementLetterEvenSem = async(req,res) => {
    try{
        const {userId} = req.body;
        if(!userId){
            return res.status(404).json({
                success:false,
                message:"ID missing",
            })
        }

        const userDetails = await Prisma.user.findUnique({where : {id : userId}});
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User Details Not Found",
            })
        }

        if(userDetails?.status !== "ACTIVE"){
            return res.status(400).json({
                success:false,
                message:"Account Not Already Active",
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

        const cotDetails = await Prisma.cot.findUnique({where : {id : studentDetails?.cotId}, include:{room : true}});
        if(!cotDetails || cotDetails?.status!=="BOOKED"){
            return res.status(401).json({
                success:false,
                message:"Invalid Details",
            })
        }

        try{
            let date = new Date();
            date = date.toLocaleDateString();
            const pdfPath = await PdfGenerator(evenSemAcknowledgementAttachement(date,studentDetails?.image,studentDetails?.name,studentDetails?.phone,studentDetails?.year,studentDetails?.rollNo,studentDetails?.regNo,studentDetails?.paymentMode2,studentDetails?.amountPaid2,studentDetails?.hostelBlock?.name,cotDetails?.room?.roomNumber,cotDetails?.cotNo, studentDetails?.gender, cotDetails?.room?.floorNumber), `${studentDetails?.rollNo}.pdf`);
            await SendEmail("tanneriabhiram@gmail.com","HOSTEL ALLOTMENT CONFIRMATION EVEN SEM | NIT ANDHRA PRADESH",evenSemAcknowledgementLetter(),pdfPath,`${studentDetails?.rollNo}.pdf`);
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
            message:"Sent Letter Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Send Acknowledgement Letter",
        })
    }
}

exports.startEvenSemRegistration = async(_, res) => {
    try{
        const freezedStudentAccount = await Prisma.user.findFirst({where: {status: "FREEZED"}});
        if(freezedStudentAccount){
            return res.status(400).json({
                success: false,
                message: "Delete Freezed students before starting even sem registration",
            })
        }

        const inactiveStudentAccount = await Prisma.user.findFirst({where: {status: "INACTIVE"}});
        if(inactiveStudentAccount){
            return res.status(400).json({
                success: false,
                message: "Delete pending odd semester registrations before starting even sem registration",
            })
        }

        await Prisma.user.updateMany({where : {accountType : "STUDENT"}, data : {status : "ACTIVE1"}});
        return res.status(200).json({
            success: true,
            message: "Started Even Sem Registration Successfully",
        })
    }catch(e){
        return res.status(400).json({
            success: false,
            message: "Something went wrong",
        })
    }
}

exports.viewPendingComplaints = async(_, res) => {
    try{
        const pendingComplaints = await Prisma.hostelComplaint.findMany({
                                                    where: {
                                                        status: "UNRESOLVED",
                                                    },
                                                    orderBy: {
                                                        createdAt: 'asc',
                                                    },
                                                    select: {
                                                        createdAt: true,
                                                        category: true,
                                                        about: true,
                                                        fileUrl: true,
                                                        instituteStudent: {
                                                        select: {
                                                            name: true,
                                                            cot: {
                                                            select: {
                                                                cotNo: true,
                                                                room: {
                                                                select: {
                                                                    roomNumber: true,
                                                                },
                                                                },
                                                            },
                                                            },
                                                            hostelBlock: {
                                                            select: {
                                                                name: true,
                                                            },
                                                            },
                                                        },
                                                        },
                                                    },
                                                    });

        return res.status(200).json({
            success: true,
            message: "Successfully fetched data",
            data: pendingComplaints,
        })
    }catch(e){
        return res.status(400).json({
            success: false,
            message: "Something went wrong",
        })
    }
}

exports.downloadAllStudentDetailsXlsxFile = async (_, res) => {
    try {
        const allStudentDetails = await Prisma.instituteStudent.findMany({
            include: {
                hostelBlock: true,
                cot: {
                    include: {
                        room: true,
                    },
                },
            },
            orderBy: [
                {
                    hostelBlock: {
                        name: 'asc',
                    },
                },
                {
                    rollNo: 'asc',
                },
            ],
        });

        if (!allStudentDetails || allStudentDetails.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No students found in the database to export.",
            });
        }

        const dataForExcel = allStudentDetails.map(student => ({
            'Name': student.name,
            'Roll Number': student.rollNo,
            'Registration Number': student.regNo,
            'Gender': student.gender,
            'Room Number': student.cot?.room?.roomNumber ?? 'N/A',
            'Floor Number': student.cot?.room?.floorNumber ?? 'N/A',
            'Block Name': student.hostelBlock?.name ?? 'N/A',
            'Year': student.year,
            'Phone Number': student.phone ?? 'N/A',
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

        worksheet['!cols'] = [
            { wch: 25 },
            { wch: 15 },
            { wch: 18 },
            { wch: 10 },
            { wch: 15 },
            { wch: 15 },
            { wch: 20 },
            { wch: 10 },
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, 'AllStudents');

        const fileName = `All_Student_Details_${new Date().toISOString().split('T')[0]}.xlsx`;
        const filePath = `./${fileName}`;
        XLSX.writeFile(workbook, filePath);

        const emailBody = `<p>Dear Admin,</p><p>Please find the attached .xlsx file containing the details of all students registered in the HMS portal.</p><p>This is an auto-generated email.</p>`;

        await SendEmail(
            "hosteloffice@nitandhra.ac.in",
            "All Student Details Report | HMS NIT AP",
            emailBody,
            filePath,
            fileName
        );

        fs.unlinkSync(filePath);

        return res.status(200).json({
            success: true,
            message: "File with all student details has been sent to the designated email.",
        });

    } catch (e) {
        console.error("Error in downloadAllStudentDetailsXlsxFile:", e);
        return res.status(500).json({
            success: false,
            message: "An error occurred while generating the report. Please try again later.",
        });
    }
};

exports.editStudentAccount = async (req, res) => {
    try {
        const { studentId, rollNo, regNo, name, aadhaarNumber, fatherName, motherName, phone, parentsPhone, emergencyPhone, address } = req.body;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: "Student ID (studentId) is required in the request body.",
            });
        }

        const parsedStudentId = parseInt(studentId);
        if (isNaN(parsedStudentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Student ID provided.",
            });
        }

        const existingStudent = await Prisma.instituteStudent.findUnique({
            where: { id: parsedStudentId },
        });

        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: "Student with the given ID not found.",
            });
        }

        const editRollNoFormatError = validateRollNoFormat(rollNo);
        if (editRollNoFormatError) {
            return res.status(400).json({
                success: false,
                message: editRollNoFormatError,
            });
        }

        const editRegNoConflict = await findRegNoConflict(Prisma, regNo, parsedStudentId);
        if (editRegNoConflict) {
            return res.status(400).json({
                success: false,
                message: editRegNoConflict,
            });
        }

        const editRollNoConflict = await findRollNoConflict(Prisma, rollNo, parsedStudentId);
        if (editRollNoConflict) {
            return res.status(400).json({
                success: false,
                message: editRollNoConflict,
            });
        }

        const updateData = {
            rollNo,
            regNo,
            name,
            aadhaarNumber,
            fatherName,
            motherName,
            phone,
            parentsPhone,
            emergencyPhone,
            address,
        };

        await Prisma.instituteStudent.update({
            where: { id: parsedStudentId },
            data: updateData,
        });

        return res.status(200).json({
            success: true,
            message: "Student details updated successfully.",
        });

    } catch (e) {
        console.log("ERROR WHILE EDITING STUDENT ACCOUNT:", e);
        return res.status(500).json({
            success: false,
            message: "Unable to update student account due to an internal server error.",
        });
    }
};

exports.createNewStudentFirstYear = async(req, res) => {
    try{
        const { regNo, name, gender, branch, amountPaid, dateOfJoining, pwd } = req.body;

        // First years are often admitted before roll numbers are issued, so rollNo is optional.
        const rollNo = typeof req.body.rollNo === "string" && req.body.rollNo.trim() ? req.body.rollNo.trim() : null;

        if(!regNo || !name || !gender || !branch || !amountPaid || !dateOfJoining){
            return res.status(400).json({
                success: false,
                message: "Required data is missing",
            });
        }

        const normalizedPwd = String(pwd ?? "").trim().toLowerCase();
        if(!["true", "false"].includes(normalizedPwd)){
            return res.status(400).json({
                success: false,
                message: "Invalid PWD status provided",
            });
        }
        const pwdStatus = normalizedPwd === "true";

        if(!/^[0-9]+$/.test(String(regNo).trim())){
            return res.status(400).json({
                success: false,
                message: "Registration Number must contain digits only",
            });
        }
        const trimmedRegNo = String(regNo).trim();

        const rollNoFormatError = validateRollNoFormat(rollNo);
        if(rollNoFormatError){
            return res.status(400).json({
                success: false,
                message: rollNoFormatError,
            });
        }

        const parsedDateOfJoining = new Date(dateOfJoining);
        if(isNaN(parsedDateOfJoining.getTime())){
            return res.status(400).json({
                success: false,
                message: "Invalid Date of Joining provided",
            });
        }

        const regNoConflict = await findRegNoConflict(Prisma, trimmedRegNo);
        if(regNoConflict){
            return res.status(400).json({
                success: false,
                message: regNoConflict,
            });
        }

        const rollNoConflict = await findRollNoConflict(Prisma, rollNo);
        if(rollNoConflict){
            return res.status(400).json({
                success: false,
                message: rollNoConflict,
            });
        }

        const loginIdentifier = rollNo || trimmedRegNo;
        const email = `${loginIdentifier}@student.nitandhra.ac.in`;

        const duplicateEmail = await Prisma.user.findUnique({where : {email}});
        if(duplicateEmail){
            return res.status(400).json({
                success: false,
                message: `An account already uses ${email}. Provide a different Roll/Registration Number.`,
            });
        }

        const hashedPassword = await bcrypt.hash(loginIdentifier,10);
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
        await Prisma.instituteStudent.create({data : {regNo:trimmedRegNo,rollNo,name,year: "1",branch,gender,pwd:pwdStatus,amountPaid,dateOfJoining:parsedDateOfJoining,outingRating:5.0,disciplineRating:5.0,userId}});
        return res.status(200).json({
            success: true,
            message: "New student account created successfully.",
        })
    }catch(e){
        console.log("ERROR WHILE CREATING NEW STUDENT ACCOUNT:");
        console.log(e);
        return res.status(400).json({
            success: false,
            message: "Failed to create new student account.",
        })
    }
}

exports.fetchFirstYearStudentApplications = async(_, res) => {
    try{
        const studentApplication = await Prisma.user.findMany({
            where: {
                accountType: "STUDENT",
                status: "INACTIVE",
                instituteStudent: {
                    year: "1"
                }
            },
            include: {
                instituteStudent: {
                include: {
                    cot: {
                    include: {
                        room: true
                    }
                    },
                    hostelBlock: true,
                }
                }
            }
        });
        return res.status(200).json({
            success: true,
            message: "Successfully fetched first year student applications.",
            data: studentApplication,
        })
    }catch(e){
        console.log("ERROR",e);
        return res.status(400).json({
            success: false,
            message: "Failed to fetch first year student applications.",
        })
    }
}

exports.allotRoomForStudentFirstYear = async(req,res) => {
    try{
        let {studentId, cotId} = req.body;
        if(!studentId || !cotId){
            return res.status(404).json({
                success: false,
                message: "Student ID is missing",
            });
        }

        studentId = parseInt(studentId);
        cotId = parseInt(cotId);
        let studentDetails = await Prisma.instituteStudent.findUnique({where : {id: studentId}});
        if(!studentDetails){
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        const cotDetails = await Prisma.cot.findUnique({where: { id: cotId }, include: { room: true }});
        if(!cotDetails || cotDetails.status !== "AVAILABLE"){
            return res.status(404).json({
                success: false,
                message: "Cot not available for allotment",
            });
        }

        await Prisma.cot.update({where : {id:parseInt(cotId)}, data : {status:"BOOKED"}});
        studentDetails = await Prisma.instituteStudent.update({
            where: { id: studentId },
            data: {
                cot: {
                connect: { id: cotId }
                },
                hostelBlock: {
                connect: { id: cotDetails.room.hostelBlockId }
                },
                user: {
                update: {
                    status: "ACTIVE"
                }
                }
            },
            include: {
                hostelBlock: true,
                cot: true,
                user: true
            }
        });

        let uploadedPdf = null;
        try{
            let date = new Date();
            date = date.toLocaleDateString();

            // Falls back to the registration number for first years without a roll number yet.
            const letterName = letterIdentifier(studentDetails);
            const pdfPath = await PdfGenerator(firstYearAcknowlegdementLetterAttachment(date,studentDetails?.name,studentDetails?.year,studentDetails?.rollNo,studentDetails?.regNo,studentDetails?.amountPaid,studentDetails?.hostelBlock?.name,cotDetails?.room?.roomNumber,cotDetails?.cotNo, studentDetails?.gender, cotDetails?.room?.floorNumber), `${letterName}.pdf`);
            const dummyFile = { tempFilePath: pdfPath, name: `${letterName}.pdf`, mimetype: "application/pdf" };
            uploadedPdf = await uploadMediaToS3(dummyFile, process.env.FOLDER_NAME_ACKNOWLEDGEMENT_LETTERS, letterName);
            if(!uploadedPdf){
                return res.status(400).json({
                    success:false,
                    message:"File Upload Failed",
                })
            }
            if(!uploadedPdf?.success){
                return res.status(400).json({
                    success: false,
                    message: "PDF Upload Failed",
                });
            }
            await Prisma.instituteStudent.update({
                where: { id: studentDetails.id },
                data: { allotmentLetterUrl: uploadedPdf.url },
            });
            fs.unlinkSync(pdfPath);
        }catch(e){
            console.log(e);
            return res.status(400).json({
                success:false,
                message:"Error Generating Allotment Letter",
            });
        };

        return res.status(200).json({
            success: true,
            message: "Room allotted successfully and acknowledgement letter generated.",
            data : uploadedPdf?.url,
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success: false,
            message: "Failed to allot room for the student.",
        })
    }
}

// Admin-created first years may not have a roll number yet, so the registration number stands in
// as the letter's filename and S3 key.
const letterIdentifier = (student) => student?.rollNo || student?.regNo;

const renderAllotmentLetterHtml = (student, date) => {
    const room = student.cot?.room;
    if(student.paymentMode2 || student.amountPaid2){
        return evenSemAcknowledgementAttachement(date, student.image, student.name, student.phone, student.year, student.rollNo, student.regNo, student.paymentMode2, student.amountPaid2, student.hostelBlock?.name, room?.roomNumber, student.cot?.cotNo, student.gender, room?.floorNumber);
    }
    if(student.paymentMode){
        return acknowledgementAttachment(date, student.image, student.name, student.phone, student.year, student.rollNo, student.regNo, student.paymentMode, student.amountPaid, student.hostelBlock?.name, room?.roomNumber, student.cot?.cotNo, student.gender, room?.floorNumber);
    }
    return firstYearAcknowlegdementLetterAttachment(date, student.name, student.year, student.rollNo, student.regNo, student.amountPaid, student.hostelBlock?.name, room?.roomNumber, student.cot?.cotNo, student.gender, room?.floorNumber);
};

const printable = (value) => (value === null || value === undefined || value === "" ? "-" : value);

// Serial number -> NITAP/MESS/2026/00042.
const messCardSerialNo = (student) => `NITAP/MESS/${new Date().getFullYear()}/${String(student.id).padStart(5, "0")}`;

const floorPrefixedRoomNo = (room) => (room ? `${room.floorNumber}${room.roomNumber}` : null);

const renderMessIdCardHtml = (student) => messIdCardAttachment({
    serialNo: messCardSerialNo(student),
    image: student.image,
    name: printable(student.name),
    rollNo: printable(letterIdentifier(student)),
    course: "B.Tech",
    branch: printable(student.branch),
    contact: printable(student.phone),
    blockName: printable(student.hostelBlock?.name),
    roomNo: printable(floorPrefixedRoomNo(student.cot?.room)),
    messHall: printable(student.messHall?.hallName),
});

let letterGenerationQueue = Promise.resolve();
const inFlightLetterGenerations = new Map();

const buildAndStoreStudentDocument = async (student, { html, folder, fileName, field, pdfOptions }) => {
    const pdfPath = await PdfGenerator(html, `${fileName}.pdf`, pdfOptions);
    try{
        const dummyFile = { tempFilePath: pdfPath, name: `${fileName}.pdf`, mimetype: "application/pdf" };
        const uploadedPdf = await uploadMediaToS3(dummyFile, folder, fileName);
        if(!uploadedPdf?.success){
            throw new Error(uploadedPdf?.message || "S3 upload failed");
        }

        await Prisma.instituteStudent.update({
            where: { id: student.id },
            data: { [field]: uploadedPdf.url },
        });
        return uploadedPdf.url;
    }finally{
        // Always clear the temp file, even when the upload throws.
        if(fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }
};

const generateAndUploadDocument = (key, build) => {
    const existing = inFlightLetterGenerations.get(key);
    if(existing) return existing;

    const task = letterGenerationQueue.then(build);
    letterGenerationQueue = task.catch(() => { });

    const tracked = task
        .catch((e) => {
            console.log(`ERROR WHILE GENERATING STUDENT DOCUMENT (${key}):`, e);
            return null;
        })
        .finally(() => inFlightLetterGenerations.delete(key));

    inFlightLetterGenerations.set(key, tracked);
    return tracked;
};

const allotmentLetterDocument = {
    field: "allotmentLetterUrl",
    label: "Allotment letter",
    folder: () => process.env.FOLDER_NAME_ACKNOWLEDGEMENT_LETTERS,
    render: (student) => renderAllotmentLetterHtml(student, new Date().toLocaleDateString()),
};

const messIdCardDocument = {
    field: "messCardUrl",
    label: "Mess ID card",
    folder: () => process.env.FOLDER_NAME_MESS_ID_CARDS || "mess-id-cards",
    render: renderMessIdCardHtml,
    pdfOptions: { preferCSSPageSize: true },
};

const generateStudentDocument = (student, document) => {
    const folder = document.folder();
    const fileName = letterIdentifier(student);
    return generateAndUploadDocument(`${folder}/${fileName}`, () => buildAndStoreStudentDocument(student, {
        html: document.render(student),
        folder,
        fileName,
        field: document.field,
        pdfOptions: document.pdfOptions,
    }));
};

const serveStudentDocument = async (req, res, document) => {
    const { field, label } = document;
    try{
        const { studentId, regenerate } = req.body;
        if(!studentId){
            return res.status(400).json({
                success: false,
                message: "Student ID is required.",
            });
        }

        const parsedStudentId = parseInt(studentId);
        if(isNaN(parsedStudentId)){
            return res.status(400).json({
                success: false,
                message: "Invalid Student ID provided.",
            });
        }

        const studentDetails = await Prisma.instituteStudent.findUnique({
            where: { id: parsedStudentId },
            include: { hostelBlock: true, messHall: true, cot: { include: { room: true } } },
        });

        if(!studentDetails){
            return res.status(404).json({
                success: false,
                message: "Student not found.",
            });
        }

        if(!regenerate && studentDetails[field]){
            return res.status(200).json({
                success: true,
                message: `${label} located.`,
                data: studentDetails[field],
            });
        }

        if(!studentDetails.cot?.room){
            return res.status(404).json({
                success: false,
                message: "No room has been allotted to this student yet.",
            });
        }

        const generatedUrl = await generateStudentDocument(studentDetails, document);
        if(!generatedUrl){
            return res.status(500).json({
                success: false,
                message: `Unable to generate the ${label.toLowerCase()}.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: `${label} generated.`,
            data: generatedUrl,
        });
    }catch(e){
        console.log(`ERROR WHILE FETCHING ${label.toUpperCase()}:`, e);
        return res.status(500).json({
            success: false,
            message: `Unable to fetch the ${label.toLowerCase()}.`,
        });
    }
};

exports.fetchStudentAllotmentLetter = (req, res) => serveStudentDocument(req, res, allotmentLetterDocument);

exports.fetchStudentMessIdCard = (req, res) => serveStudentDocument(req, res, messIdCardDocument);
