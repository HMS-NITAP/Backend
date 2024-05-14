const {uploadMedia} = require('../utilities/MediaUploader')
const {AccountType} = require('../constant/AccountType')

const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();

exports.createAnnouncement = async(req,res) => {
    try{
        const {id} = req.user;
        const  {title,textContent} = req.body;
        const {file} = req.files;

        if(!id || !title || !textContent || !file){
            return res.status(404).json({
                success:false,
                message:"Data missing",
            })
        }

        const officiaDetails = await Prisma.official.findFirst({where : {userId:id}});
        if(!officiaDetails){
            return res.status(404).json({
                success:false,
                message:"Official Account Not Found",
            })
        }

        const uploadedFile = await uploadMedia(file,process.env.FOLDER_NAME);
        if(!uploadedFile){
            return res.status(403).json({
                success:false,
                message:"File Upload Failed",
            })
        }

        await Prisma.announcement.create({data : {title,textContent,fileUrl:uploadedFile.secure_url,createdById:officiaDetails.id}});

        return res.status(200).json({
            success:true,
            message:"Announcement Creation Successful",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Announcement Creation Failed",
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

        const officialDetails = await Prisma.official.findFirst({userId:id});
        if(!officialDetails){
            return res.status(404).json({
                success:false,
                message:"Official Account Not Found",
            })
        }

        const announcementDetails = await Prisma.announcement.findUnique({where : {id:announcementId}});
        if(!announcementDetails){
            return res.status(404).json({
                success:false,
                message:"Announcement Not Found",
            })
        }

        if(announcementDetails.createdById !== officialDetails.id){
            return res.status(403).json({
                success:false,
                message:"This announcement is not created by you",
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

exports.getPendingOutingApplicationsByWardenBlock = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"Data Missing",
            })
        }

        const officialDetails = await Prisma.official.findFirst({where : {userId:id}});
        if(!officialDetails){
            return res.status(404).json({
                success:false,
                message:"Official Account Not Found",
            })
        }

        const blockIdOfWarder = officialDetails?.hostelBlockId;
        if(!blockIdOfWarder){
            return res.status(404).json({
                success:false,
                message:"Warden Block Details Not Found",
            })
        }

        const pendingApplications = await Prisma.outingApplication.findMany({where:{hostelBlockId:blockIdOfWarder,status:"PENDING"}});

        return res.status(200).json({
            success:true,
            message:"All pending Applications of Warden's Block Fetched Successfully",
            data:pendingApplications,
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Applications",
        })
    }
}

exports.getAcceptedOutingApplicationsByWardenBlock = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"Data Missing",
            })
        }

        const officialDetails = await Prisma.official.findFirst({where : {userId:id}});
        if(!officialDetails){
            return res.status(404).json({
                success:false,
                message:"Official Account Not Found",
            })
        }

        const blockIdOfWarder = officialDetails?.hostelBlockId;
        if(!blockIdOfWarder){
            return res.status(404).json({
                success:false,
                message:"Warden Block Details Not Found",
            })
        }

        const acceptedApplications = await Prisma.outingApplication.findMany({where:{hostelBlockId:blockIdOfWarder,status:"ACCEPTED"}});

        return res.status(200).json({
            success:true,
            message:"All Accepted Applications of Warden's Block Fetched Successfully",
            data:acceptedApplications,
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Applications",
        })
    }
}

exports.getRejectedOutingApplicationsByWardenBlock = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"Data Missing",
            })
        }

        const officialDetails = await Prisma.official.findFirst({where : {userId:id}});
        if(!officialDetails){
            return res.status(404).json({
                success:false,
                message:"Official Account Not Found",
            })
        }

        const blockIdOfWarder = officialDetails?.hostelBlockId;
        if(!blockIdOfWarder){
            return res.status(404).json({
                success:false,
                message:"Warden Block Details Not Found",
            })
        }

        const rejectedApplications = await Prisma.outingApplication.findMany({where:{hostelBlockId:blockIdOfWarder,status:"REJECTED"}});

        return res.status(200).json({
            success:true,
            message:"All Rejected Applications of Warden's Block Fetched Successfully",
            data:rejectedApplications,
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Applications Failed",
        })
    }
}

exports.approvePendingOutingApplication = async(req,res) => {
    try{
        const {id} = req.user;
        const {applicationId} = req.body;

        if(!id || !applicationId){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        const applicationDetails = await Prisma.outingApplication.findUnique({id:applicationId});
        if(!applicationDetails){
            return res.status(404).json({
                success:false,
                message:"Application Not Found",
            })
        }

        if(applicationDetails?.status !== "PENDING"){
            return res.status(400).json({
                success:false,
                message:"Application is not in Pending status",
            })
        }

        await Prisma.outingApplication.update({where:{id:applicationDetails},data:{status:"ACCEPTED"}});
        return res.status(200).json({
            success:false,
            message:"Approved Application Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Approve the Application",
        })
    }
}

exports.rejectPendingOutingApplication = async(req,res) => {
    try{
        const {id} = req.user;
        const {applicationId} = req.body;

        if(!id || !applicationId){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        const applicationDetails = await Prisma.outingApplication.findUnique({id:applicationId});
        if(!applicationDetails){
            return res.status(404).json({
                success:false,
                message:"Application Not Found",
            })
        }

        if(applicationDetails?.status !== "PENDING"){
            return res.status(400).json({
                success:false,
                message:"Application is not in Pending status",
            })
        }

        await Prisma.outingApplication.update({where:{id:applicationDetails},data:{status:"REJECTED"}});
        return res.status(200).json({
            success:false,
            message:"Rejected Application Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Reject the Application",
        })
    }
}
