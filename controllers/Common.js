const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();

exports.getAllAnnouncements = async(_,res) => {
    try{
        const announcements = await Prisma.announcement.findMany({orderBy:{createdAt: 'desc'}});

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

exports.getMessSessionRatingAndReviews = async (req,res) => {
    try{
        const {messHallId,date,session} = req.params.body;

        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        if(!messHallId || !date || !session){
            return res.status(400).json({
                success : false,
                message : "All fields are required",
            })
        }

        const ratingAndReview = await Prisma.messRatingAndReview.findMany({
            where : {
                messHallId : parseInt(messHallId),
                session : session,
                createdAt : new Date(date),
            },
            select : {
                rating:true,
                review:true,
            }
        });

        return res.status(200).json({
            success : true,
            message : "Fetched the rating and review of the session by date",
            data:ratingAndReview,
        })
    }
    catch(e){
        console.log(e);
        console.error(e);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while fetching the rating and review of the session",
        })
    }
}

exports.getAvgRatingByMessId = async (req,res) => {
    try{
        const {messHallId,session} = req.params.body;

        if(!messHallId || !session){
            return res.status(400).json({
                success : false,
                message : "Requried all fields",
            })
        }

        const result = await Prisma.messRatingAndReview.findMany({
            where : {
                messHallId : parseInt(messHallId),
                session : session,
            },
            avg : {
                rating : true,
            }
        });

        return res.status(200).json({
            success : true,
            message : "Successfully fetched the average rating of the particular session",
            data:result,
        })
    }
    catch(e){
        console.log(e);
        console.error(e);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while fetching average rating of the session",
        })
    }
}

exports.getAvgRatingOfSession = async (req,res) => {
    try{
        const session = req.params.body;

        if(!session){
            return res.status(400).json({
                success : false,
                message : "Required all fields",
            })
        }

        const rating = await Prisma.messRatingAndReview.findMany({
            where : {
                session : session,
            },
            avg : {
                rating : true,
            }
        });

        return res.status(200).json({
            success : true,
            message : "Successfully fetched the average rating of the session",
            data : rating,
        });
    }
    catch(e){
        console.log(e);
        console.error(e);
        return res.status(500).json({
            success : false,
            message : "Unable to fetch average rating based on the session",
        })

    }
}

exports.getAllRatingAndReview = async (req,res) => {
    try{

        const ratindAndReview = await Prisma.messRatingAndReview.findMany({
            select : {
                rating : true,
                review : true,
            }
        });

        return res.status(400).json({
            success : true,
            message : "Successfully fetched all the rating and review ",
            ratindAndReview,
        });
    }
    catch(e){
        return res.status(500).json({
            success : false,
            message : "Something went wrong while fetching the rating and review",
        })
    }
}