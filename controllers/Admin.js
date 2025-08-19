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
const { uploadMediaToS3 } = require('../utilities/S3mediaUploader');
const firstYearAcknowlegdementLetterAttachment = require('../mailTemplates/firstYearAcknowlegdementLetterAttachment');

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

        let studentDetails;

        if(idNumber.length === 6){
            studentDetails = await Prisma.instituteStudent.findFirst({where : {rollNo : idNumber}, include:{user:true, outingApplication: {include: { verifiedBy: { select: { name: true,designation: true}}, hostelBlock: true } }, hostelComplaints: { include: {resolvedBy: { select: { name: true, designation: true }},hostelBlock: true} }, messHall:true, cot:{include:{room:{include : {hostelBlock:true}}}}}});
        }else if(idNumber.length === 7){
            studentDetails = await Prisma.instituteStudent.findFirst({where : {regNo : idNumber}, include:{user:true, outingApplication: {include: { verifiedBy: { select: { name: true,designation: true}}, hostelBlock: true } }, hostelComplaints: { include: {resolvedBy: { select: { name: true, designation: true }},hostelBlock: true} }, messHall:true, cot:{include:{room:{include : {hostelBlock:true}}}}}});
        }else{
            return res.status(402).json({
                success:false,
                message:"Invalid ID number",
            })
        }

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

        await SendEmail("hmsnitap@gmail.com", "Hostel Block Student Details | HMS NIT AP", emailBody, filePath, fileName);

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
            "hmsnitap@gmail.com", 
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
        const { rollNo, regNo, name, gender, branch, amountPaid} = req.body;
        if(!rollNo || !regNo || !name || !gender || !branch || !amountPaid){
            console.log(rollNo, regNo, name, gender, branch, amountPaid);
            return res.status(404).json({
                success: false,
                message: "Required data is missing",
            });
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where: { rollNo: rollNo}});
        if(studentDetails){
            return res.status(400).json({
                success: false,
                message: "Student with this Roll Number already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(rollNo,10);
        const user = await Prisma.user.create({data : {email:`${rollNo}@student.nitandhra.ac.in`,password:hashedPassword,accountType:"STUDENT",status:"INACTIVE"}});
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
        await Prisma.instituteStudent.create({data : {regNo,rollNo,name,year: "1",branch,gender,amountPaid,outingRating:5.0,disciplineRating:5.0,userId}});

        return res.status(200).json({
            success: true,
            message: "New student account created successfully.",
        })
    }catch(e){
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
        
        await Prisma.cot.update({where : {id:parseInt(cotId)}, data : {status:"BLOCKED"}});
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
        });

        let uploadedPdf = null;
        try{
            let date = new Date();
            date = date.toLocaleDateString();
            const pdfPath = await PdfGenerator(firstYearAcknowlegdementLetterAttachment(date,studentDetails?.name,studentDetails?.year,studentDetails?.rollNo,studentDetails?.regNo,studentDetails?.amountPaid,studentDetails?.hostelBlock?.name,cotDetails?.room?.roomNumber,cotDetails?.cotNo, studentDetails?.gender, cotDetails?.room?.floorNumber), `${studentDetails?.rollNo}.pdf`);
            const dummyFile = { tempFilePath: pdfPath, name: `${studentDetails?.rollNo}.pdf`, mimetype: "application/pdf" };
            uploadedPdf = await uploadMediaToS3(dummyFile, process.env.FOLDER_NAME_ACKNOWLEDGEMENT_LETTERS, studentDetails?.rollNo);
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