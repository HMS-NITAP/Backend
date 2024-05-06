const { PrismaClient } = require('@prisma/client')
const Prisma = new PrismaClient();

exports.getAllAnnouncements = async(req,res) => {
    try{
        // const userId = req.user.id;

        // const ifUserLoggedIn = await Prisma.user.findFirst({where : {id : userId}});
        // if(!ifUserLoggedIn){
        //     return res.status(404).json({
        //         success:false,
        //         message:"User not Logged In",
        //     })
        // }

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

exports.createAnnouncement = async(req,res) => {
    try{
        console.log(req.user);
        const {id} = req.user;
        const {title,textContent,fileContent} = req.body;

        if(!title || !textContent || !fileContent){
            return res.status(404).json({
                success:false,
                message:"Data missing",
            })
        }

        if(req.user.accountType !== "OFFICIAL"){
            return res.status(403).json({
                success:false,
                message:"Unauthorized Operation",
            })
        }

        await Prisma.announcement.create({data : {title,textContent,fileContent,createdById:id}});

        return res.status(200).json({
            success:true,
            message:"Created Announcement Successfully",
        })

    }catch(e){
        console.log("ERROR INANN",e);
        return res.status(400).json({
            success:false,
            message:"Can't create Announcement",
        })
    }
}

exports.deleteAnnouncement = async(req,res) => {
    try{
        const {announcementId} = req.body;

        if(!announcementId){
            return res.status(404).json({
                success:false,
                message:"Data missing",
            })
        }

        if(req.user.accountType !== "OFFICIAL"){
            return res.status(403).json({
                success:false,
                message:"Unauthorized Operation",
            })
        }

        await Prisma.announcement.delete({where : {id : announcementId}});

        return res.status(200).json({
            success:true,
            message:"Deleted Announcement Successfully",
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Can't delete Announcement",
        })
    }
}
