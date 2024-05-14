const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();

exports.getAllAnnouncements = async(_,res) => {
    try{
        const announcements = await Prisma.announcement.findMany({orderBy:{createdAt: 'desc'}});

        return res.status(200).json({
            success:true,
            announcements : announcements,
            message : "Fetched All Announcements Successfully",
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Failed to fetch all announcements",
        })
    }
}

exports.fetchAllHostelData = async(_,res) => {
    try{
        const hostelData = await Prisma.hostelBlock.groupBy({by:'gender'});

        return res.status(200).json({
            success:true,
            message:"Data fetched Successfully",
            data:hostelData,
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to fetch Hostel Data"
        })
    }
}