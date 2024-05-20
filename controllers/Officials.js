const {uploadMedia} = require('../utilities/MediaUploader')

const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();

exports.createAnnouncement = async(req,res) => {
    try{
        console.log("GERE");
        const {id} = req.user;
        const {title,textContent} = req.body;
        const {file} = req.files;

        if(!id || !title || !textContent){
            return res.status(404).json({
                success:false,
                message:"Data missing",
            })
        }

        const officialDetails = await Prisma.official.findFirst({where : {userId:id}});
        if(!officialDetails){
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

        await Prisma.announcement.create({data : {title,textContent,fileUrl:[uploadedFile.secure_url],createdById:officialDetails.id}});

        return res.status(200).json({
            success:true,
            message:"Announcement Creation Successful",
        })

    }catch(e){
        console.log(e);
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

        const applicationDetails = await Prisma.outingApplication.findUnique({where : {id:applicationId}});
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

        await Prisma.outingApplication.update({where:{id:applicationId},data:{status:"ACCEPTED"}});
        return res.status(200).json({
            success:true,
            message:"Approved Application Successfully",
        })

    }catch(e){
        console.log(e);
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

        const applicationDetails = await Prisma.outingApplication.findUnique({where :{id:applicationId}});
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

        await Prisma.outingApplication.update({where:{id:applicationId},data:{status:"REJECTED"}});
        return res.status(200).json({
            success:true,
            message:"Rejected Application Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Reject the Application",
        })
    }
}

exports.getAllUnresolvedComplaintsByHostelBlock = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"Id Not Found",
            })
        }

        const officialDetails = await Prisma.official.findFirst({where : {userId : id}});
        if(!officialDetails){
            return res.status(404).json({
                success:false,
                message:"Official Account Not Found",
            })
        }

        const hostelBlockId = officialDetails?.hostelBlockId;
        if(!hostelBlockId){
            return res.status(404).json({
                success:false,
                message:"Hostel Block ID Not Found",
            })
        }

        const unresolvedComplaints = await Prisma.hostelComplaint.findMany({where:{hostelBlockId:hostelBlockId,status:"UNRESOLVED"}, orderBy:{createdAt:'asc'}});
        return res.status(200).json({
            success:true,
            message:"Successfully Fetched All UnResolved Complaints",
            data:unresolvedComplaints,
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Complaints"
        })
    }
}

exports.getAllResolvedComplaintsByHostelBlock = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"Id Not Found",
            })
        }

        const officialDetails = await Prisma.official.findFirst({where : {userId : id}});
        if(!officialDetails){
            return res.status(404).json({
                success:false,
                message:"Official Account Not Found",
            })
        }

        const hostelBlockId = officialDetails?.hostelBlockId;
        if(!hostelBlockId){
            return res.status(404).json({
                success:false,
                message:"Hostel Block ID Not Found",
            })
        }

        const resolvedComplaints = await Prisma.hostelComplaint.findMany({where:{hostelBlockId:hostelBlockId,status:"RESOLVED"}, orderBy:{createdAt:'asc'}});
        return res.status(200).json({
            success:true,
            message:"Successfully Fetched All Resolved Complaints",
            data:resolvedComplaints,
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Complaints"
        })
    }
}

exports.resolveHostelComplaint = async(req,res) => {
    try{
        const {id} = req.user;
        const {complaintId} = req.body;

        if(!id || !complaintId){
            return res.status(404).json({
                success:false,
                message:"Id's Missing",
            })
        }

        const complaintDetails = await Prisma.hostelComplaint.findUnique({where : {id:complaintId}});
        if(!complaintDetails){
            return res.status(404).json({
                success:false,
                message:"Complaint Not Found",
            })
        }

        if(complaintDetails?.status === "RESOLVED"){
            return res.status(402).json({
                success:false,
                message:"Complaint Is Already Resolved",
            })
        }

        await Prisma.hostelComplaint.update({where:{id:complaintId}, data:{status:"RESOLVED"}});
        return res.status(200).json({
            success:true,
            message:"Resolved the Complaint Successfully",
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:true,
            message:"Unable to Resolve the Hostel Complaint",
        })
    }
}

exports.unresolveHostelComplaint = async(req,res) => {
    try{
        const {id} = req.user;
        const {complaintId} = req.body;

        if(!id || !complaintId){
            return res.status(404).json({
                success:false,
                message:"Id's Missing",
            })
        }

        const complaintDetails = await Prisma.hostelComplaint.findUnique({where : {id:complaintId}});
        if(!complaintDetails){
            return res.status(404).json({
                success:false,
                message:"Complaint Not Found",
            })
        }

        if(complaintDetails?.status === "UNRESOLVED"){
            return res.status(402).json({
                success:false,
                message:"Complaint Is Already Unresolved",
            })
        }

        await Prisma.hostelComplaint.update({where:{id:complaintId}, data:{status:"UNRESOLVED"}});
        return res.status(200).json({
            success:true,
            message:"Unresolved the Complaint Successfully",
        })
        
    }catch(e){
        return res.status(400).json({
            success:true,
            message:"Unable to unresolve the Hostel Complaint",
        })
    }
}

exports.getAllStudentsByHostelBlockForAttendence = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"ID is Missing",
            })
        }

        const officialDetails = await Prisma.official.findFirst({where:{userId:id}});
        if(!officialDetails || !(officialDetails?.hostelBlockId)){
            return res.status(404).json({
                success:false,
                message:"Data Not Found",
            })
        }

        const attendenceRecords = await Prisma.studentAttendence.findMany({
            where: {
              hostelBlockId: officialDetails?.hostelBlockId,
            },
            include: {
              student: true,
            },
            orderBy: [
              {
                student: {
                  floorNo: 'asc', 
                },
              },
              {
                student: {
                  roomNo: 'asc', 
                },
              },
            ],
          });
          
        return res.status(200).json({
            success:true,
            message:"Fetched Attendence Records Successfully",
            data:attendenceRecords,
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Students",
        })
    }
}

exports.markStudentPresent = async(req,res) => {
    try{
        const {presentDate,attendenceRecordId} = req.body;
        if(!presentDate || !attendenceRecordId){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        await Prisma.studentAttendence.update({where:{id:attendenceRecordId}, data:{presentDays:{push:presentDate}}});
        return res.status(200).json({
            success:true,
            message:"Student Marked Present Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Give Student Present",
        })
    }
}

exports.unMarkStudentPresent = async(req,res) => {
    try{
        const {presentDate,attendenceRecordId} = req.body;
        if(!presentDate || !attendenceRecordId){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        await Prisma.studentAttendence.update({where:{id:attendenceRecordId}, data:{presentDays:{pop:presentDate}}});
        return res.status(200).json({
            success:true,
            message:"Student Unmarked Present Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Unmark Student Present",
        })
    }
}

exports.markStudentAbsent = async(req,res) => {
    try{
        const {absentDate,attendenceRecordId} = req.body;
        if(!absentDate || !attendenceRecordId){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        await Prisma.studentAttendence.update({where:{id:attendenceRecordId}, data:{absentDays:{push:absentDate}}});
        return res.status(200).json({
            success:true,
            message:"Student Marked Absent Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Give Student Absent",
        })
    }
}

exports.unMarkStudentAbsent = async(req,res) => {
    try{
        const {absentDate,attendenceRecordId} = req.body;
        if(!absentDate || !attendenceRecordId){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        await Prisma.studentAttendence.update({where:{id:attendenceRecordId}, data:{absentDays:{pop:absentDate}}});
        return res.status(200).json({
            success:true,
            message:"Student Unmarked Absent Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Unmark Student Absent",
        })
    }
}