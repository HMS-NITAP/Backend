const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();

exports.getstudentAttendance = async (req,res) => {
    try{
        const studentId = req.params.studentId;
        if(!studentId){
            return res.status(404).json({
                success : false,
                message : "Data not found",
            });
        }

        const attendance = await Prisma.studentAttendence.findUnique({where : {studentId:studentId}});

        return res.status(200),json({
            success : true,
            message : "Fetched student attendance successfully",
            attendance,
        });
    }
    catch(error){
        console.log(error);
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Unavailable to fetch student attendance",
        });
    }
}

exports.getAllStudentAttendence = async (req,res) => {
    try{

        const allStudentAttendance = await Prisma.studentAttendence.findMany({});

        return res.status(200).json({
            success : true,
            message : "Successfully fetched attendance of all students",
            allStudentAttendance,
        });
    }
    catch(error){
        console.log(error);
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Unavailable to fetched student attendance",
        })
    }
}

exports.getstudentAttendanceByDate = async (req,res) => {
    try{
        const studentId = req.params.studentId;
        const Date = new Date(req.params.Date);

        if(!studentId || !Date){
            return res.status(404).json({
                success : false,
                message : "Data not found",
            });
        }

        const attendance = await Prisma.studentAttendence.findFirst({where : {studentId : studentId , date : Date}})

        return res.status(200).json({
            success : true,
            message : "Successfully fetched student attendance by date",
        });
    }
    catch(error){
        console.log(error);
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Unavailable to fetched student attendance",
        });
    }
}

exports.getAllStudentAttendanceInBlock = async (req,res) => {
    try{
        const blockId = req.params.blockId;

        const studentBlock  = await Prisma.hostelBlock.findMany({where  : {id : blockId} , include : {attendance : true}});

        return res.status(200).json({
            success : true,
            message : "Successfully fetched student attendance in the hostel block",
            studentBlock,
        })
    }
    catch(error){
        console.log(error);
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Unavailable to fected student attendance",
        })
    }
}