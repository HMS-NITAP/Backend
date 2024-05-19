const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();
const {uploadMedia} = require('../utilities/MediaUploader');

exports.createHostelBlock = async(req,res) => {
    try{
        const {hostelName,roomType,gender,floorCount,capacity} = req.body;
        const {image} = req.files;
        console.log(hostelName,roomType,gender,floorCount,capacity,image);
        if(!hostelName || !image || !roomType || !gender || !floorCount || !capacity){
            return res.status(404).json({
                success:false,
                message:"Data is Missing",
            })
        }

        const uploadedFile = await uploadMedia(image,process.env.FOLDER_NAME);
        if(!uploadedFile){
            return res.status(400).json({
                success:false,
                message:"Image Upload Failed",
            })
        }

        await Prisma.hostelBlock.create({data : {name:hostelName,image:uploadedFile.secure_url,gender,roomType,floorCount,capacity}});
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
        const hostelBlockId = req.body;

        if(!hostelBlockId){
            return res.status(404).json({
                success:false,
                message:"HostelBlock Id is missing",
            })
        }

        await Prisma.hostelBlock.delete({where : {id}});

        return res.status(200).json({
            success:true,
            message:"Deletion of HostelBlock Successful",
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Deletion of Hostel Block Failed",
        })
    }
}

exports.addWardenToHostelBlock = async(req,res) => {
    try{
        const {newWardenId,hostelBlockId} = req.body;
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

        const existingWardenIds = (hostelBlockDetails.wardenId).map((warden) => warden.id);
        if(existingWardenIds.includes(newWardenId)){
            return res.status(400).json({
                success:false,
                message:"This Warden has been already added to this Hostel Block",
            })
        }

        existingWardenIds.push(newWardenId);

        await Prisma.hostelBlock.update({
            where: { id: hostelBlockId },
            data: {
              warden: {
                connect: existingWardenIds.map((id) => ({ id })),
              },
            },
          });

        return res.status(200).json({
            success:true,
            message:"Warden Added Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Error adding Warden to Hostel Block",
        })
    }
}

exports.removeWardenFromHostelBlock = async(req,res) => {
    try{
        const {removeWardenId,hostelBlockId} = req.body;
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

        const existingWardenIds = hostelBlockDetails.wardenId.map((warden) => warden.id);
        if(!existingWardenIds.includes(newWardenId)){
            return res.status(404).json({
                success:false,
                message:"This Warden is not present in this Hostel Block",
            })
        }

        existingWardenIds.pop(removeWardenId);

        await Prisma.hostelBlock.update({
            where: { id: hostelBlockId },
            data: {
              warden: {
                connect: existingWardenIds.map((id) => ({ id })),
              },
            },
          });

        return res.status(200).json({
            success:true,
            message:"Warden Removed Successfully",
        })

    }catch(e){
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