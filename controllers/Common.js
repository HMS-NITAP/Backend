const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();

exports.getAllAnnouncements = async(_,res) => {
    try{
        const announcements = await Prisma.announcement.findMany({orderBy:{createdAt: 'desc'}, include:{createdBy:true}});
        return res.status(200).json({
            success:true,
            data : announcements,
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
        const hostelData = await Prisma.hostelBlock.findMany({
            include: {
              wardens: {
                include: {
                  user: true,
                },
              },
            },
          });

          console.log(hostelData);
        return res.status(200).json({
            success:true,
            message:"Data fetched Successfully",
            data:hostelData,
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to fetch Hostel Data"
        })
    }
}

exports.fetchMessAndFeedback = async(_,res) => {
    try{
        const currentDate = new Date().toISOString();
        console.log(currentDate + 'T00:00:00.000Z1');

        // const messData = await Prisma.messHall.findMany({
        //     include: {
        //       messRatingAndReviews: {
        //         where: {
        //           createdAt: {
        //             gte: new Date(currentDate + 'T00:00:00.000Z'),
        //             lt: new Date(currentDate + 'T23:59:59.999Z')
        //           }
        //         },
        //         // include: {
        //         //   createdBy: true
        //         // }
        //       }
        //     }
        // })

        // const messData = await Prisma.messRatingAndReview.findMany({});

        return res.status(200).json({
            success:true,
            message:"Fetched Data Successfully",
            // data:messData,
        })
    }catch(e){
        console.log(e);
        return res.status(404).json({
            success:false,
            message:"Unable to Fetch Mess Details",
        })
    }
}
