const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();
const {uploadMedia} = require('../utilities/MediaUploader')

exports.CreateOutingApplication = async (req,res) => {
    try{
        const {type,from,to,placeOfVisit,purpose} = req.body;
        const {id} = req.user;

        console.log(req.body);

        if(!type || !from || !to || !placeOfVisit || !purpose || !id){
            return res.status(404).json({
                success:false,
                message:"Data not found",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findUnique({where : {userId : id}});
        if(!studentDetails){
            return res.status.json(404).json({
                success:false,
                message:"Student Account Not Found",
            })
        }

        const pendingStudentApplications = await Prisma.outingApplication.count({where : {instituteStudentId:studentDetails.id, status:"PENDING"}});
        if(pendingStudentApplications>0){
            return res.status(402).json({
                success:false,
                message:"Already 1 Application is in Pending Status",
            })
        }

        await Prisma.outingApplication.create({data : {type,from:new Date(from),to:new Date(to),placeOfVisit,purpose,instituteStudentId:studentDetails.id,hostelBlockId:studentDetails.hostelBlockId,status:"PENDING"}});

        return res.status(200).json({
            success:true,
            message:"Created Outing Application Successfully",
        })
        
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success : false,
            message: "Can't create Outing Application",
        })
    }
}

exports.deletePendingOutingApplication = async(req,res) => {
    try{
        const {id} = req.user;
        const {applicationId} = req.body;

        if(!id || !applicationId){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findUnique({where : {userId:id}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Account Not Found",
            })
        }

        const outingApplicationDetails = await Prisma.outingApplication.findFirst({where : {id:applicationId, instituteStudentId:studentDetails.id, status:"PENDING"}});
        if(!outingApplicationDetails){
            return res.status(404).json({
                success:false,
                message:"No Outing Application Found",
            })
        }

        await Prisma.outingApplication.delete({id:outingApplicationDetails.id});
        return res.status(200).json({
            success:true,
            message:"Pending Application Deleted Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Successfully Deleted Outing Application",
        })
    }
}

exports.getStudentAllOutingApplications = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"Id Missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId:id}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Account Not Found",
            })
        }

        const pendingApplications = await Prisma.outingApplication.findMany({where : {instituteStudentId:studentDetails?.id},orderBy:{createdAt:'desc'}});
        return res.status(200).json({
            success:true,
            message:"Successfully fetched all student Outing Applications",
            data:pendingApplications,
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Students Outing Applications",
        })
    }
}

exports.updateOutingApplicationStatus = async(req,res) =>{
    try{
        const {applicationId,status} = req.body;
        const {id , accountType} = req.user;

        if(!applicationId || !status || !id || accountType){
            return res.status(404).json({
                success : false,
                message : "Data is Missing"
            })
        }

        if(accountType !== "OFFICIAL"){
            return res.status(400).json({
                success : false,
                message : "Unauthorized user"
            })
        }

        // check either the give input status is ACCEPTED or REJECTED
        if(!["ACCEPTED","REJECTED"].includes(status)){
            return res.status(400).json({
                success : false,
                message : "Invalid status",
            })
        }

        const outingApplication = await Prisma.outingApplication.findUnique({where : {id : applicationId}});
        if(!outingApplication){
            return res.status(404).json({
                success : false,
                message : "Outing Application does not found",
            })
        }

        if(outingApplication.status !== "PENDING"){
            return res.status(400).json({
                success : false,
                message : "Pending applications can only updated",
            })
        }

        await Prisma.outingApplication.update({where : {id : applicationId} , data : {status : status}});

        return res.status(200).json({
            success : true,
            message : "Status has updated successfully",
        });
    }
    catch(e){
        console.log(e);
        console.error(e);
        return res.status(500).json({
            success : false,
            message : "Unable to update status in application",
        });
    }
}

exports.markOutingInProgress = async (req,res) => {
    try{
        const {applicationId,status} = req.body;
        const {id} = req.user;

        if(!applicationId || !status){
            return res.status(400).json({
                success : false,
                message : "Data is missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findUnique({where : {id : id}});
        if(!student){
            return res.status(400).json({
                success : false,
                message : "Unable to find student data"
            })
        }

        const outingApplication = await Prisma.outingApplication.findUnique({where : {id : applicationId , instituteStudentId : studentDetails?.id}});
        if(!outingApplication){
            return res.status(400).json({
                success : false,
                message : "Outing application does not found"
            })
        }

        const currentDate = new Date();
        if(outingApplication.status === "ACCEPTED" && currentDate >= new Date(outingApplication.from)){
            await Prisma.outingApplication.update({where : {id : applicationId} , data : {status : "IN_PROGRESS"} });
            return res.status(200).json({
                success : true,
                message : "Successfully updated the status to in-progress"
            })
        }
    }
    catch(e){
        console.log(e);
        console.error(e);
        return res.status(500).json({
            success : false,
            message : "Unable to update the status to in-progress"
        });
    }
}

exports.markReturnOuting = async (req,res) => {
    try{
        const {applicationId} = req.body;
        const {id} = req.user;

        if(!applicationId || !status || !id){
            return res.status(400).json({
                success : false,
                message : "Data is missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findUnique({where : {id : id}});
        if(!studentDetails){
            return res.status(400).json({
                success : false,
                message : "Student details not found",
            })
        }

        const outingApplication = await Prisma.outingApplication.findUnique({where : {id : applicationId , instituteStudentId : studentDetails?.id}});
        if(!outingApplication){
            return res.status(400).json({
                success : false,
                message : "Outing application does not found"
            })
        }

        if(outingApplication.status !== "IN_PROGRESS"){
            return res.status(400).json({
                success : false,
                message : "Only in-progress status can be updated"
            })
        }

        const currentDate = new Date.now();
        const toDate = new Date(outingApplication.to);

        let status;
        if(currentDate > toDate){
            // Decrease the outing rating by 0.5
            status = "COMPLETED WITH DELAY"
            await Prisma.instituteStudent.update({
                where :{id: studentDetails?.id},
                data : {outingRating : studentDetails.outingRating - 0.5
            }})

            await Prisma.outingApplication.update({where : {id : applicationId} , data : {status : status}});

            return res.status(200).json({
                success : true,
                message : "Successfully updated the outing status which is completed with delay",
            })
        }
        else{
            status = "COMPELETED WITH NO DELAY";
            await Prisma.outingApplication.update({where : {id : applicationId} , data : {status : status}});
            return res.status(200).json({
                success : true,
                message : "Successfully updated the status which is completed with no delay"
            })
        }
    }
    catch(e){
        console.log(e);
        console.error(e);
        return res.status(500).json({
            success : false,
            message : "Unable to update the return outing status",
        })

    }
}



exports.createHostelComplaint = async (req,res) => {
    try{
        console.log("GER");
        const {id} = req.user;
        const {about} = req.body;
        const {file} = req.files;
        let {category} = req.body;
        category = category.split(" ").join("");

        if(!id || !category || !about){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId : id}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Account Not Found",
            })
        }

        const uploadedFile = await uploadMedia(file,process.env.FOLDER_NAME);
        if(!uploadedFile){
            return res.status(403).json({
                success:false,
                message:"File Upload Failed",
            })
        }

        await Prisma.hostelComplaint.create({data : {category, about, status:"UNRESOLVED", hostelBlockId:studentDetails?.hostelBlockId, instituteStudentId:studentDetails?.id,fileUrl:[uploadedFile.secure_url]}});
        return res.status(200).json({
            success:true,
            message:"Hostel Complaint Created Successfully",
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Failed to create Complaint"
        })
    }
}

exports.deleteHostelComplaint = async (req,res) => {
    try{
        const {id} = req.user;
        const {complaintId} = req.body;

        if(!id || !complaintId){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId : id}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Account Not Found",
            })
        }

        const complaintDetails = await Prisma.hostelComplaint.findUnique({where : {id : complaintId}});
        if(!complaintDetails){
            return res.status(404).json({
                success:false,
                message:"Complaint Not Found",
            })
        }

        if(complaintDetails?.instituteStudentId != studentDetails?.id){
            return res.status(403).json({
                success:false,
                message:"Unauthorized Operation",
            })
        }

        await Prisma.hostelComplaint.delete({where : {id : complaintId}});

        return res.status(200).json({
            success:false,
            message:"Hostel Complaint Deleted Successfully",
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Failed to delete Complaint"
        })
    }
}

exports.showAllStudentComplaints = async (req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"Id is Missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId : id}});

        const complaints = await Prisma.hostelComplaint.findMany({where:{instituteStudentId:studentDetails?.id}, orderBy:{createdAt:'desc'}});
        return res.status(200).json({
            success:true,
            message:"Successfully Fetched All complaints",
            data:complaints,
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch All Complaints",
        })
    }
}

exports.createMessFeedBack = async(req,res) => {
    try{
        const {id} = req.user;
        const {rating, review, session} = req.body;

        if(!id || !rating || !review || !session){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId : id}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Account Not Found",
            })
        }

        const messHallId = studentDetails?.messHallId;
        if(!messHallId){
            return res.status(404).json({
                success:false,
                message:"Mess Hall ID Not Found",
            })
        }

        const messHallDetails = await Prisma.messHall.findUnique({where : {id:messHallId}});
        if(!messHallDetails){
            return res.status(404).json({
                success:false,
                message:"Mess Hall Not Found",
            })
        }

        await Prisma.messRatingAndReview.create({data : {rating:parseInt(rating),review,session,messHallId}});
        return res.status(200).json({
            success:true,
            message:"Created Mess Rating And Review Successfully",
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to Create Mess FeedBack",
        })
    }
}

exports.deleteMessFeedBack = async(req,res) => {
    try{
        const {feedBackId} = req.body;

        if(!feedBackId){
            return res.status(404).json({
                success:false,
                message:"Mess FeedBack Not Found",
            })
        }

        await Prisma.messRatingAndReview.delete({where:{id:feedBackId}});

        return res.status(200).json({
            success:true,
            message:"Deleted Mess Rating And Review Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Create Mess FeedBack",
        })
    }
}

exports.getStudentDashboardData = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"ID Not Found",
            })
        }

        const instituteStudentDetails = await Prisma.instituteStudent.findFirst({where : {userId:id}});
        const complaintsRegistered = await Prisma.hostelComplaint.count({where : {instituteStudentId:instituteStudentDetails?.id}});
        const attendenceRecords = await Prisma.studentAttendence.findFirst({where : {studentId:instituteStudentDetails?.id}});
        const hostelBlockData = await Prisma.hostelBlock.findUnique({where : {id : instituteStudentDetails?.hostelBlockId}});
        const messHallData = await Prisma.messHall.findUnique({where : {id : instituteStudentDetails?.messHallId}});
        // if(!instituteStudentDetails || complaintsRegistered===null || !attendenceRecords || !){
        //     return res.status(404).json({
        //         success:false,
        //         message:"Data Not Found",
        //     })
        // }

        return res.status(200).json({
            success:true,
            message:"Fetched Dashboard Data Successfully",
            data : {userData : req.user,instituteStudentData : instituteStudentDetails,numberOfComplaintsRegistered : complaintsRegistered,attendenceRecords : attendenceRecords, hostelBlockData : hostelBlockData, messHallData : messHallData},
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Student Dashboard Data Not Found",
        })
    }
}

exports.editProfile = async(req,res) => {
    try{

        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"ID Not Found",
            })
        }

        const {name,rollNo,regNo,year,branch,gender,community,aadharNumber,dob,bloodGroup,fatherName,motherName,phone,parentsPhone,emergencyPhone,address,isHosteller,cotNo,floorNo,roomNo} = req.body;
        if(!name || !rollNo || !regNo || !year || !branch || !gender || !community || !aadharNumber || !dob || !bloodGroup || !fatherName || !motherName || !phone || !parentsPhone || !emergencyPhone || !address || !isHosteller || !cotNo || !floorNo || !roomNo){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }
        console.log("Data : ",req.body);

        let newDOB = new Date(req.body.dob);

        await Prisma.instituteStudent.update({where : {userId:id}, data:{name,rollNo,regNo,year,branch,gender,community,aadharNumber,dob:newDOB,bloodGroup,fatherName,motherName,phone,parentsPhone,emergencyPhone,address,isHosteller:true,cotNo,floorNo,roomNo}});
        return res.status(200).json({
            success:true,
            message:"Operation Successful",
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Operation Failed",
        })
    }
}

exports.getStudentAttendance = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId:id}});

        const attendanceData = await Prisma.studentAttendence.findFirst({where : {studentId:studentDetails?.id}});
        if(!attendanceData){
            return res.status(404).json({
                success:false,
                message:"Attendance Record Not Found",
            })
        }

        const formattedAttendance = [];

        attendanceData.presentDays.forEach(date => {
            formattedAttendance.push({ date, status: 'present' });
        });
        attendanceData.absentDays.forEach(date => {
            formattedAttendance.push({ date, status: 'absent' });
        });
        formattedAttendance.sort((a, b) => new Date(a.date) - new Date(b.date));

        return res.status(200).json({
            success:true,
            message:"Successfully Fetched Attendance Data",
            data:formattedAttendance,
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"unable to fetch Student Attendance",
        })
    }
}