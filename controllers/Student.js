const {uploadMedia} = require('../utilities/MediaUploader');
const { PrismaClient } = require("@prisma/client");
const Prisma = new PrismaClient();

exports.CreateStudent = async (req,res) => {
   

    try{

        const  {regNo,rollNo,name,branch,gender,pwd,community,aadharNumber,dob,bloodGroup,fatherName,motherName,
            phone,parentsPhone,emergencyPhone,address,isHosteller,outingRating,disciplineRatinig} = req.body;

        const userId = req.user.id;

        let {year} = req.body;

        console.log(regNo,rollNo,name,year,branch,gender,pwd,community,aadharNumber,dob,bloodGroup,fatherName,motherName,phone,parentsPhone,emergencyPhone,address,isHosteller,outingRating,disciplineRatinig,userId)

        const photo = req.files.file;
        console.log(photo);


        if(!regNo || !rollNo || !name || !year || !branch || !gender || !pwd || !community || !aadharNumber || !dob || !bloodGroup
        || !fatherName || !motherName || !phone || !parentsPhone || !emergencyPhone || !address || !photo || !isHosteller || !outingRating || !disciplineRatinig
        || !userId){
            return res.status(400).json({
                success : false,
                message : "Fill complete details",
            });
        }

        const uploadedImage = await uploadMedia(photo,process.env.FOLDER_NAME);
        console.log(uploadedImage);
        if(!uploadedImage){
            return res.status(400).json({
                success:false,
                message:"File upload failed",
            })
        }

        year = parseInt(year);

        await Prisma.instituteStudent.create({
            data:{
                regNo,rollNo,name,year,branch,gender,pwd,community,aadharNumber,dob,bloodGroup,fatherName,motherName,phone,parentsPhone,
                emergencyPhone,address,photo:uploadedImage?.secure_url,isHosteller,outingRating,disciplineRatinig,userId
            }
        });

        return res.status(200).json({
            success : true,
            message : "Entry created successfully",

        });


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Entry does not created,please try again",
        });
    };
}

exports.getAllStudent = async (req,res) => {

    try{

        const studentData = await Prisma.instituteStudent.findMany({});
        return res.status(200).json({
            success : true,
            message : "Student data is fetched",
            data : studentData,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Unavailable to fetch data,please try again!",
        });
    }
}

exports.getStudentById = async (req,res) => {

    try{
        const userId = req.instituteStudent.id;

        const studentData = await Prisma.instituteStudent.findFirst({where : {id : userId}});

        return res.status(200).json({
            success : true,
            message : `Data of ID ${userId} is fetched`,
            data : studentData,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Unavailable to fetch data,please try again!",
        });

    }
}

// exports.updateStudentById = async (req,res) => {

//     try{
//         const Id = req.body;

//         const  {name,year,branch,gender,pwd,community,aadharNumber,dob,bloodGroup,fatherName,motherName,
//             phone,parentPhone,emergencyPhone,address,isHosteller,outingRating,disciplineRating} = req.body;
//         const photo = req.file;

//         const uploadedImage = await uploadMedia(photo,process.env.FOLDER_NAME);
//         if(!uploadedFile){
//             return res.status(400).json({
//                 success:false,
//                 message:"File upload failed",
//             })
//         }


//         const updateData = await Prisma.instituteStudent.update({where : {id : Id}},{data : name,year,branch,gender,pwd,community,address,aadharNumber,
//             dob,bloodGroup,fatherName,motherName,phone,parentPhone,emergencyPhone,isHosteller,disciplineRating,outingRating,photo :[uploadedImage?.secure_url] ,updatedAt: Date.now() })

//         return res.status(200).json({
//             success :true,
//             data: updateData,
//             message : `Data of ${Id} updated successfully`,
//         });

//     }
//     catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success : false,
//             message : "Failed to update data , please try again!",
//         });
//     }
// }


exports.deleteStudentById = async (req,res) => {

    try{

        const id = req.body;

        await Prisma.instituteStudent.delete({where : {id}});

        return res.status(200).json({
            success : true,
            message : `Data of ${id} deleted successfully`,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed to delete data,please try again",
        })

    }
}