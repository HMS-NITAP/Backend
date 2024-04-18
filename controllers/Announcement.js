const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();

exports.getAllAnnouncements = async(req,res) => {
    try{
        const userId = req.user.id;

        const ifUserLoggedIn = await Prisma.user.findFirst({where : {id : userId}});
        if(!ifUserLoggedIn){
            return res.status(404).json({
                success:false,
                message:"User not Logged In",
            })
        }

        const announcements = await Prisma.announcement.findMany({});

        return res.status(200).json({
            success:true,
            announcements : announcements,
            message : "Fetched All Announcements",
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Failed to fetch all announcements",
        })
    }
}
