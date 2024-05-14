const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();

exports.CreateOutingApplication = async (req,res) => {
    try{
        const {type,from,to,placeOfVisit,purpose} = req.body;
        const {id} = req.user;

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

        const pendingStudentApplications = await Prisma.outingApplication.count({where : {instituteStudentId:studentDetails?.id, status:"PENDING"}});
        if(pendingStudentApplications>0){
            return res.status(402).json({
                success:false,
                message:"Already 1 Application is in Pending Status",
            })
        }

        await Prisma.outingApplication.create({data : {type,from,to,placeOfVisit,purpose,instituteStudentId:studentDetails.id,status:"PENDING"}});

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

exports.getStudentPendingOutingApplication = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"Id Missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({userId:id});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Account Not Found",
            })
        }

        const pendingApplications = await Prisma.outingApplication.findMany({instituteStudentId:studentDetails?.id, status:"PENDING"});
        return res.status(200).json({
            success:false,
            message:"Successfully fetched all pending student Outing Applications",
            data:pendingApplications,
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Student Pending Outing Applications",
        })
    }
}

exports.getStudentAcceptedOutingApplication = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"Id Missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({userId:id});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Account Not Found",
            })
        }

        const acceptApplications = await Prisma.outingApplication.findMany({instituteStudentId:studentDetails?.id, status:"ACCEPTED"});
        return res.status(200).json({
            success:false,
            message:"Successfully fetched all accepted student Outing Applications",
            data:acceptApplications,
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Student Accepted Outing Applications",
        })
    }
}

exports.getStudentRejectedOutingApplication = async(req,res) => {
    try{
        const {id} = req.user;
        if(!id){
            return res.status(404).json({
                success:false,
                message:"Id Missing",
            })
        }

        const studentDetails = await Prisma.instituteStudent.findFirst({userId:id});
        if(!studentDetails){
            return res.status(404).json({
                success:false,
                message:"Student Account Not Found",
            })
        }

        const rejectedApplications = await Prisma.outingApplication.findMany({instituteStudentId:studentDetails?.id, status:"REJECTED"});
        return res.status(200).json({
            success:false,
            message:"Successfully fetched all rejected student Outing Applications",
            data:rejectedApplications,
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to Fetch Student rejected Outing Applications",
        })
    }
}