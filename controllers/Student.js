const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();


exports.getAllApplication = async (req,res) => {
    try{
        const data = await Prisma.outingApplication.findMany({});

        return res.status(200).json({
            success:true,
            message:"Operation Successful",
            data:data,
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:e,
        })
    }
}

exports.getStudentAllApplication = async (req,res) => {
    try{
        console.log("dfsdfrf");
        const id = req.user.id;
        const student = await Prisma.instituteStudent.findUnique({where : {userId : id}});
        console.log("stu",student);
        const data = await Prisma.outingApplication.findMany({where : {instituteStudentId:student.id}});
        console.log("Datataef",data);
        return res.status(200).json({
            success:true,
            message:"Operation Successful",
            data:data,
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:e,
        })
    }
}

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

        console.log("DF");

        const studentDetails = await Prisma.instituteStudent.findUnique({where : {userId : id}});
        if(!studentDetails){
            return res.status.json(404).json({
                success:false,
                message:"Student data not found",
            })
        }

        console.log("dfsfd");

        await Prisma.outingApplication.create({data : {type,from,to,placeOfVisit,purpose,instituteStudentId:studentDetails.id,status:"PENDING"}});

        console.log("dfsefrr");
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

exports.approveOutingApplication = async(req,res) => {
    try{
        const {id} = req.body;

        const application = await Prisma.outingApplication.findUnique({where : {id}});
        if(!application){
            return res.status(404).json({
                success:false,
                message:"Application Not Found",
            })
        }

        await Prisma.outingApplication.update({where : {id}, data : {status:"ACCEPTED"}})

        return res.status(200).json({
            success:true,
            message:"Done",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Approval Failed",
        })
    }
}

exports.rejectOutingApplication = async(req,res) => {
    try{
        const {id} = req.body;

        const application = await Prisma.outingApplication.findUnique({where : {id}});
        if(!application){
            return res.status(404).json({
                success:false,
                message:"Application Not Found",
            })
        }

        await Prisma.outingApplication.update({where : {id}, data : {status:"REJECTED"}})

        return res.status(200).json({
            success:true,
            message:"DOne",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Rejection Failed",
        })
    }
}

