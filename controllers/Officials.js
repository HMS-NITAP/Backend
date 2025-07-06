// const {UploadMedia} = require('../utilities/MediaUploader')

const { PrismaClient } = require('@prisma/client');
const { uploadMediaToS3 } = require('../utilities/S3mediaUploader');
const Prisma = new PrismaClient();

exports.getDashboardData = async(req,res) => {
    try{
        const {id} = req.user;
        const data = await Prisma.user.findUnique({where : {id}, include:{official:{include:{hostelBlock:{select:{name:true}}}}}});

        return res.status(200).json({
            success:true,
            message:"Data fetched Successfully",
            data : data,
        })
        
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to fetch Dashboard Data",
        })
    }
}

exports.createAnnouncement = async(req,res) => {
    try{
        const {id} = req.user;
        const {title,textContent} = req.body;
        const { file = null } = req.files || {};

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

        let uploadedFile = null;
        if(file){
            // uploadedFile = await UploadMedia(file,process.env.FOLDER_NAME_DOCS);
            uploadedFile = await uploadMediaToS3(file, process.env.FOLDER_NAME_ANNOUCEMENTS);
            if(!uploadedFile){
                return res.status(403).json({
                    success:false,
                    message:"File Upload Failed",
                })
            }
        }

        // await Prisma.announcement.create({data : {title,textContent,fileUrl: uploadedFile ? [uploadedFile.secure_url] : [],createdById:officialDetails.id}});
        await Prisma.announcement.create({data : {title,textContent,fileUrl: uploadedFile ? [uploadedFile.url] : [],createdById:officialDetails.id}});

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

        const pendingApplications = await Prisma.outingApplication.findMany({
            where: {
              hostelBlockId: blockIdOfWarder,
              status: "PENDING"
            },
            orderBy: {
              createdAt: 'asc'
            },
            include: {
              instituteStudent: {
                select: {
                  name: true,
                  rollNo: true,
                  regNo: true,
                  phone: true,
                  cot: {
                    include: {
                      room: true
                    }
                  }
                }
              }
            }
          });
          
        
        return res.status(200).json({
            success:true,
            message:"All pending Applications of Warden's Block Fetched Successfully",
            data:pendingApplications,
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Applications",
        })
    }
}

exports.getCompletedOutingApplicationsByWardenBlock = async(req,res) => {
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

        const completedApplications = await Prisma.outingApplication.findMany({
            where: {
              hostelBlockId: blockIdOfWarder,
              status: "COMPLETED",
              returnedOn: {
                // ONLY FETCH 3 DAYS BACK OF returnedOn
                gte: new Date(new Date().setDate(new Date().getDate() - 3))
              }
            },
            orderBy: {
              returnedOn: 'desc'
            },
            include: {
              instituteStudent: {
                select: {
                  name: true,
                  rollNo: true,
                  regNo: true,
                  phone: true,
                  cot: {
                    include: {
                      room: true
                    }
                  }
                }
              },
              verifiedBy:true,
            }
          });

        return res.status(200).json({
            success:true,
            message:"All Completed Applications of Warden's Block Fetched Successfully",
            data:completedApplications,
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Applications",
        })
    }
}

exports.getInProgressOutingApplicationsByWardenBlock = async (req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success : false,
                message : "Data Missing",
            })
        }

        const officialDetails = await Prisma.official.findUnique({where : {userId : id}});
        if(!officialDetails){
            return res.status(404).json({
                success : false,
                message : "Official Account Not Found"
            })
        }

        const blockIdOfWarden = officialDetails?.hostelBlockId;
        if(!blockIdOfWarden){
            return res.status(404).json({
                success : false,
                message : "Warden Block Details Not Found"
            })
        }

        const inProgressOutingApplications = await Prisma.outingApplication.findMany({
            where: {
              hostelBlockId: blockIdOfWarden,
              status: "INPROGRESS"
            },
            orderBy: {
              to: 'asc'
            },
            include: {
              instituteStudent: {
                select: {
                  name: true,
                  rollNo: true,
                  regNo: true,
                  phone: true,
                  cot: {
                    include: {
                      room: true
                    }
                  }
                }
              },
              verifiedBy:true
            }
          });
          

        return res.status(200).json({
            success : true,
            message : "All In Progress Outing Applications Fetched Successfully",
            data : inProgressOutingApplications,
        })

    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : "Unable to Fetch Applications Failed"
        })
    }
}

exports.getReturnedOutingApplicationsByWardenBlock = async (req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success : false,
                message : "Data Missing",
            })
        }

        const officialDetails = await Prisma.official.findUnique({where : {userId : id}});
        if(!officialDetails){
            return res.status(404).json({
                success : false,
                message : "Official Account Not Found"
            })
        }

        const blockIdOfWarden = officialDetails?.hostelBlockId;
        if(!blockIdOfWarden){
            return res.status(404).json({
                success : false,
                message : "Warden Block Details Not Found"
            })
        }

        const returnedOutingApplications = await Prisma.outingApplication.findMany({
            where: {
              hostelBlockId: blockIdOfWarden,
              status: "RETURNED"
            },
            orderBy: {
              returnedOn: 'asc'
            },
            include: {
              instituteStudent: {
                select: {
                  name: true,
                  rollNo: true,
                  regNo: true,
                  phone: true,
                  cot: {
                    include: {
                      room: true
                    }
                  }
                }
              },
              verifiedBy:true,
            }
          });
          

        return res.status(200).json({
            success : true,
            message : "All Returned Outing Applications Fetched Successfully",
            data : returnedOutingApplications,
        })

    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : "Unable to Fetch Applications"
        })
    }
}

exports.acceptPendingOutingApplication = async(req,res) => {
    try{
        const {id} = req.user;
        const {applicationId} = req.body;

        if(!id || !applicationId){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        const officialDetails = await Prisma.official.findFirst({where : {userId : id}});
        if(!officialDetails){
            return res.status(404).json({
                success:false,
                message:"Official Account Not Found",
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

        await Prisma.outingApplication.update({where:{id:applicationId},data:{status:"INPROGRESS",verifiedById:officialDetails?.id,verifiedOn:new Date()}});
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
        let {applicationId , remarks} = req.body;

        if(!id || !applicationId){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        applicationId = parseInt(applicationId);

        const officialData = await Prisma.official.findFirst({where : {userId : id}});
        if(!officialData){
            return res.status(404).json({
                success:false,
                message:"Official Data Not Found",
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

        await Prisma.outingApplication.update({where:{id:applicationId},data:{status:"REJECTED",remarks, verifiedOn:new Date(), verifiedById:officialData?.id}});
        return res.status(200).json({
            success:true,
            message:"Application Rejected",
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to Reject the Application",
        })
    }
}

exports.markOutingApplicationCompletedWithoutDelay = async(req,res) => {
    try{
        const {applicationId} = req.body;
        if(!applicationId){
            return res.status(404).json({
                success:false,
                message:"Application ID Missing",
            })
        }

        const application = await Prisma.outingApplication.findUnique({where : {id : applicationId}});
        if(!application){
            return res.status(404).json({
                success:false,
                message:"Application Not Found",
            })
        }

        if(application?.status !== "RETURNED"){
            return res.status(401).json({
                success:false,
                message:"Invalid Operation",
            })
        }

        await Prisma.outingApplication.update({where : {id : applicationId}, data : {status:"COMPLETED"}});
        return res.status(200).json({
            success:true,
            message:"Marked Completed Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Mark Completed",
        })
    }
}

exports.markOutingApplicationCompletedWithDelay = async(req, res) => {
    try {
        console.log("HERE");
        let { applicationId, remarks } = req.body;

        if(!applicationId){
            return res.status(404).json({
                success: false,
                message: "Application ID Missing",
            });
        }

        applicationId = parseInt(applicationId);

        const application = await Prisma.outingApplication.findUnique({
            where: { id: applicationId },
        });

        if(!application){
            return res.status(404).json({
                success: false,
                message: "Application Not Found",
            });
        }

        if(application.status !== "RETURNED"){
            return res.status(401).json({
                success: false,
                message: "Invalid Operation",
            });
        }

        const student = await Prisma.instituteStudent.findUnique({
            where: { id: application.instituteStudentId },
            select: { outingRating: true },
        });

        if(student && student.outingRating !== null){
            const newOutingRating = Math.max(0, student.outingRating - 0.25);

            await Prisma.$transaction([
                Prisma.outingApplication.update({where: { id: applicationId },data: { status: "COMPLETED", remarks }}),
                Prisma.instituteStudent.update({where: { id: application.instituteStudentId },data: { outingRating: newOutingRating }}),
            ]);

            return res.status(200).json({
                success: true,
                message: "Marked Completed Successfully",
            });
        }else{
            console.log(e);
            return res.status(400).json({
                success: false,
                message: "Invalid student data",
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            message: "Unable to Mark Completed",
        });
    }
};


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

        const unresolvedComplaints = await Prisma.hostelComplaint.findMany({
            where: { hostelBlockId: hostelBlockId, status: "UNRESOLVED" },
            include: {
              instituteStudent: {
                select: {
                  name: true,
                  cot: {
                    include: {
                      room: true
                    }
                  }
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          });
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

        const resolvedComplaints = await Prisma.hostelComplaint.findMany({
            where: { hostelBlockId: hostelBlockId, status: "RESOLVED" },
            include: {
              instituteStudent: {
                select: {
                  name: true,
                  cot: {
                    include: {
                      room: true
                    }
                  }
                }
              },
              resolvedBy: {
                select: {
                  name: true,
                  designation: true,
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          });
          
        return res.status(200).json({
            success:true,
            message:"Successfully Fetched All Resolved Complaints",
            data:resolvedComplaints,
        })

    }catch(e){
        console.log(e);
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

        const officialDetails = await Prisma.official.findFirst({where : {userId : id}});
        if(!officialDetails){
            return res.status(404).json({
                success:false,
                message:"Official Account Not Found",
            })
        }
        if(officialDetails?.hostelBlockId === null){
            return res.status(400).json({
                success:false,
                message:"Official Not Assigned Hostel Block",
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

        await Prisma.hostelComplaint.update({where:{id:complaintId}, data:{status:"RESOLVED", resolvedOn:new Date(), resolvedById:officialDetails?.id}});
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

        await Prisma.hostelComplaint.update({where:{id:complaintId}, data:{status:"UNRESOLVED",resolvedById:null,resolvedOn:null}});
        return res.status(200).json({
            success:true,
            message:"Unresolved the Complaint Successfully",
        })
        
    }catch(e){
        console.log(e);
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
        if(!officialDetails){
            return res.status(404).json({
                success:false,
                message:"Data Not Found",
            })
        }
        if(officialDetails?.hostelBlockId === null){
            return res.status(404).json({
                success:false,
                message:"Hostel Block Not Assigned",
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

        const record = await Prisma.studentAttendence.findUnique({where : {id : attendenceRecordId}});
        if(!record){
            return res.status(404).json({
                success:false,
                message:"Attendence Record Not Found",
            })
        }
        if(record?.presentDays.includes(presentDate)){
            return res.status(200).json({
                success:false,
                message:"Student Already Marked Present for this Date",
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
            message:"Unable to Mark Student Present",
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

        const record = await Prisma.studentAttendence.findUnique({where : {id : attendenceRecordId}});
        if(!record){
            return res.status(404).json({
                success:false,
                message:"Attendence record Not Found",
            })
        }
        if(!record?.presentDays.includes(presentDate)){
            return res.status(401).json({
                success:false,
                message:"Invalid Operation",
            })
        }

        const updatedPresentDays = await record?.presentDays.filter((day) => day!=presentDate);
        await Prisma.studentAttendence.update({where:{id:attendenceRecordId}, data:{presentDays:updatedPresentDays}});
        return res.status(200).json({
            success:true,
            message:"Unmarked Present Successfully",
        })

    }catch(e){
        console.log(e);
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

        const record = await Prisma.studentAttendence.findUnique({where : {id : attendenceRecordId}});
        if(!record){
            return res.status(404).json({
                success:false,
                message:"Attendence Record Not Found",
            })
        }
        if(record?.presentDays.includes(absentDate)){
            return res.status(200).json({
                success:false,
                message:"Student Already Marked Absent for this Date",
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

        const record = await Prisma.studentAttendence.findUnique({where : {id : attendenceRecordId}});
        if(!record){
            return res.status(404).json({
                success:false,
                message:"Attendence record Not Found",
            })
        }
        if(!record?.absentDays.includes(absentDate)){
            return res.status(401).json({
                success:false,
                message:"Invalid Operation",
            })
        }

        const updatedAbsentDays = await record?.absentDays.filter((day) => day!=absentDate);

        await Prisma.studentAttendence.update({where:{id:attendenceRecordId}, data:{absentDays:updatedAbsentDays}});
        return res.status(200).json({
            success:true,
            message:"Unmarked Absent Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Unmark Student Absent",
        })
    }
}


// NEW ATTENDANCE
exports.fetchAttendanceDataInHostelBlock = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"ID is Missing",
            })
        }

        const officialDetails = await Prisma.official.findFirst({where:{userId:id}});
        if(!officialDetails){
            return res.status(404).json({
                success:false,
                message:"Data Not Found",
            })
        }
        if(officialDetails?.hostelBlockId === null){
            return res.status(404).json({
                success:false,
                message:"Hostel Block Not Assigned",
            })
        }

        const hostelRooms = await Prisma.hostelBlock.findUnique({
            where: { id: officialDetails?.hostelBlockId },
            include: {
              rooms: {
                orderBy: {
                  roomNumber: 'asc',
                },
                include: {
                  cots: {
                    orderBy: {
                      cotNo: 'asc',
                    },
                    include: {
                      student: {
                        select: {
                          name: true,
                          rollNo: true,
                          attendence: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          });
          
          
          
        return res.status(200).json({
            success:true,
            message:"Fetched Attendence Records Successfully",
            data:hostelRooms,
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Students",
        })
    }
}
