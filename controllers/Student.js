const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();
const {UploadMedia} = require('../utilities/MediaUploader')

exports.CreateOutingApplication = async (req, res) => {
    try {
        const { type, from, to, placeOfVisit, purpose } = req.body;
        const { id } = req.user;

        console.log(req.body);

        if (!type || !from || !to || !placeOfVisit || !purpose || !id) {
            return res.status(404).json({
                success: false,
                message: "Data not found",
            });
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);
        const currentDateUTC = new Date();

        if (fromDate < currentDateUTC || toDate < fromDate || toDate < currentDateUTC) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Dates Selected'
            });
        }

        const studentDetails = await Prisma.instituteStudent.findUnique({where : {userId : id}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Account Not Found",
            });
        }

        const pendingStudentApplications = await Prisma.outingApplication.count({
            where : {
                instituteStudentId: studentDetails.id,
                status : {
                    in : ["PENDING","INPROGRESS","RETURNED"]
                }
            }
        });
        if(pendingStudentApplications > 0){
            return res.status(402).json({
                success: false,
                message: "There is already one application in pending or in-progress status",
            });
        }

        await Prisma.outingApplication.create({data : {type,from: fromDate, to: toDate, placeOfVisit, purpose, instituteStudentId: studentDetails.id, hostelBlockId: studentDetails.hostelBlockId, status: "PENDING"}});

        return res.status(200).json({
            success: true,
            message: "Created Outing Application Successfully",
        });

    } catch (e) {
        console.log(e);
        return res.status(400).json({
            success: false,
            message: "Can't create Outing Application",
        });
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

        const pendingApplications = await Prisma.outingApplication.findMany({where : {instituteStudentId:studentDetails?.id},orderBy:{createdAt:'desc'}, include:{verifiedBy:{select:{name:true,designation:true}}}});
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

        const outingApplicationDetails = await Prisma.outingApplication.findUnique({where : {id:applicationId}});
        if(!outingApplicationDetails){
            return res.status(404).json({
                success:false,
                message:"Pending Application Not Found",
            })
        }

        if(outingApplicationDetails?.status !== "PENDING"){
            return res.status(404).json({
                success:false,
                message:"Application in not in Pending status",
            })
        }

        await Prisma.outingApplication.delete({where : {id : applicationId}});
        return res.status(200).json({
            success:true,
            message:"Pending Application Deleted Successfully",
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to delete Outing Application",
        })
    }
}

exports.markReturnOutingApplication = async(req,res) => {
    try{
        const {applicationId} = req.body;
        if(!applicationId){
            return res.status(404).json({
                success:false,
                message:"Application ID not found",
            })
        }

        const application = await Prisma.outingApplication?.findUnique({where : {id : applicationId}});
        if(!application){
            return res.status(404).json({
                success:false,
                message:"Application Not Found",
            })
        }

        if(application?.status !== "INPROGRESS"){
            return res.status(401).json({
                success:false,
                message:"Invalid Operation",
            })
        }

        await Prisma.outingApplication.update({where:{id:applicationId}, data:{status:"RETURNED",returnedOn:new Date()}});
        return res.status(200).json({
            success:true,
            message:"Marked Return Successfully",
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to mark return",
        })
    }
}

exports.createHostelComplaint = async (req,res) => {
    try{
        const {id} = req.user;
        const {about} = req.body;
        const { file = null } = req.files || {};
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

        let uploadedFile = null;
        if(file){
            uploadedFile = await UploadMedia(file,process.env.FOLDER_NAME_IMAGES);
            if(!uploadedFile){
                return res.status(403).json({
                    success:false,
                    message:"File Upload Failed",
                })
            }
        }

        await Prisma.hostelComplaint.create({data : {category, about, status:"UNRESOLVED", hostelBlockId:studentDetails?.hostelBlockId, instituteStudentId:studentDetails?.id,fileUrl: uploadedFile ? [uploadedFile.secure_url] : []}});
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

        const complaints = await Prisma.hostelComplaint.findMany({where:{instituteStudentId:studentDetails?.id}, include:{resolvedBy:true}, orderBy:{createdAt:'desc'}});
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

exports.fetchAllMessHallsAndStudentGender = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"User ID missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId : id}, select:{gender:true}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Account not found",
            })
        }

        const messHalls = await Prisma.messHall.findMany({select:{hallName:true,id:true,gender:true}});

        return res.status(200).json({
            success:true,
            message:"Mess Hall Found",
            data:{studentDetails,messHalls},
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to fetch Mess Hall"
        })
    }
}

exports.createMessFeedBack = async(req,res) => {
    try{
        const {id} = req.user;
        let {rating, review, session} = req.body;

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

        const currentDateUTC = new Date();
        const currentDateIST = new Date(currentDateUTC.getTime() + (330 * 60 * 1000));

        await Prisma.messRatingAndReview.create({data : {rating:parseInt(rating),review,session,createdById:studentDetails?.id,createdAt:currentDateIST}});
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
        const id = req.user.id;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"ID Not Found",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where:{userId:id}, include:{hostelBlock:true,messHall:true,cot:{include:{room:true}},user:{select:{status:true}}}});
        
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Data Not Found",
            })
        }

        return res.status(200).json({
            success:true,
            message:"Fetched Dashboard Data Successfully",
            data : {userData : req.user,data : studentDetails},
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
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student details Not Found",
            })
        }

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

exports.generateMessSessionReceipt = async (req, res) => {
    try{
        const { id } = req.user;
        const { session, date, messHallName } = req.body;

        if(!id || !session || !date || !messHallName){
            return res.status(404).json({
                success: false,
                message: "Data is Missing",
            });
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where: { userId: id },include: { messRecord: true }});

        if(!studentDetails){
            return res.status(404).json({
                success: false,
                message: "Student Account Not Found",
            });
        }

        if(studentDetails?.messRecord === null){
            return res.status(400).json({
                success: false,
                message: "Mess Record Not Found",
            });
        }

        let availed = studentDetails?.messRecord?.availed;
        let dateRecord = availed[date] || {};

        if(dateRecord[session]?.completed){
            return res.status(400).json({
                success: false,
                message: `Session ${session} already availed on ${date}`,
            });
        }else{
            dateRecord[session] = {
                completed: true,
                messHallName
            };
        }

        availed[date] = dateRecord;

        await Prisma.studentMessRecords.update({ where: { id: studentDetails?.messRecord?.id }, data: { availed }});

        return res.status(200).json({
            success: true,
            message: "Generated Mess Receipt Successfully",
        });

    }catch(e){
        console.log(e);
        return res.status(400).json({
            success: false,
            message: "Unable to generate Mess Receipt",
        });
    }
};

exports.fetchStudentMessReceipts = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"User Id Not Found",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId : id}, include : {messRecord : true}});
        if(!studentDetails){
            return res.status.json({
                success:false,
                message:"Student Account Not Found",
            })
        }

        if(studentDetails?.messRecord === null){
            return res.status(400).json({
                success:false,
                message:"Mess Record Not Found",
            })
        }

        let availed = studentDetails?.messRecord?.availed;

        const now = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' };
        const [mm, dd, yyyy] = now.toLocaleDateString('en-CA', options).split('/');
        const localDate = `${yyyy}-${mm}-${dd}`;

        const entry = availed[localDate] || {};

        const result = Object.entries(entry).map(([key, value]) => ({
            [key]: value
          }));

        return res.status(200).json({
            success:true,
            message:"Fetched records successfully",
            data : result,
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to fetch mess receipts"
        })
    }
}


exports.addEvenSemFeeReceipt = async(req,res) => {
    try{
        const {id} = req.user;
        const {amountPaid2,paymentDate2,paymentMode2} = req.body;
        const { evenSemHostelFeeReceipt } = req.files;

        if(!amountPaid2 || !paymentDate2 || !paymentMode2){
            return res.status(404).json({
                success:false,
                message:"Data Missing",
            })
        }

        if(!evenSemHostelFeeReceipt){
            return res.status(404).json({
                success:false,
                message:"Unable to Find Fee Receipt"
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({where : {userId : id}});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Account Not Found",
            })
        }

        if(studentDetails?.hostelFeeReceipt2){
            return res.status(402).json({
                success:false,
                message:"Even Sem Hostel Fee Receipt Already Present",
            })
        }

        const uploadedFile = await UploadMedia(evenSemHostelFeeReceipt,process.env.FOLDER_NAME_IMAGES);
        if(!uploadedFile){
            return res.status(403).json({
                success:false,
                message:"File Upload Failed",
            })
        }

        await Prisma.instituteStudent.update({where:{id : studentDetails?.id}, data:{hostelFeeReceipt2: uploadedFile?.secure_url, paymentDate2, paymentMode2, amountPaid2}});
        return res.status(200).json({
            success:true,
            message:"File Submitted Successfully",
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to complete Registration"
        })
    }
}