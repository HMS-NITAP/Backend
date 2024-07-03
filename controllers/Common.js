const { PrismaClient } = require('@prisma/client');
const { DateTime } = require('luxon'); // For date manipulation
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

exports.getRatingOfAllMessSessions = async (req,res) => {
    try{
        const currentDateUTC = DateTime.utc().toISO();

        // convert it into IST
        const currrentDateIST = DateTime.fromISO(currentDateUTC,{zone : 'Asia/Kolkata'});

        const messHalls = Prisma.messHall.findMany({
            include : {
                messRatingAndReviews : {
                    where : {
                        createdAt : {
                            gte : currrentDateIST.startOf("day").toJSDate(),
                            lt : currrentDateIST.endOf("day").toJSDate(),
                        },
                    },
                    include : {
                        session : true,
                    }
                }
            }
        })

        if(!messHalls){
            return res.statu(404).json({
                success : false,
                message : "Mess Hall data not found"
            })
        }

        const sessionRatings = {
            [MessSession.Breakfast]: { totalRating: 0, ratingCount: 0 },
            [MessSession.Lunch]: { totalRating: 0, ratingCount: 0 },
            [MessSession.Snacks]: { totalRating: 0, ratingCount: 0 },
            [MessSession.Dinner]: { totalRating: 0, ratingCount: 0 },
        };

        (await messHalls).forEach(messHall => {
            messHall.messRatingAndReview.forEach(rating => {
                const session = rating.session;
                sessionRatings[session].totalRating += rating.rating;
                sessionRatings[session].ratingCount++;
            })
        })

        const avgRatingBySession = {};
        Object.keys(sessionRatings).forEach(session => {
            const {totalRating,ratingCount} = sessionRatings[session];
            avgRatingBySession[session] = ratingCount > 0 ? totalRating / ratingCount : 0;
        });

        return res.status(200).json({
            success : true,
            message : "Successfully fetched the average rating of the mess sessions",
            avgRatingBySession
        });
    }
    catch(e){
        console.log(e);
        console.error(e);
        return res.status(500).json({
            success : false,
            message : "Unable to fetch the average rating of the mess session",
        })
    }
}

exports.getMessRatingAndReview = async (req,res) => {
    try{
        // give date in UTC format
        const {messSession , date} = req.body;

        const requestedDate = DateTime.fromISO(date,{zone : "utc"});
        if(!requestedDate.isValid){
            return res.status(400).json({
                success : false,
                message : "Invalid date format",
            })
        }

        const requestedDateIST = requestedDate.setZone("Asia/Kolkata");

        const sessionRating  = await Prisma.messRatingAndReview.findMany({
            where : {
                session : messSession,
                createdAt : {
                    gte : requestedDateIST.startOf("day").toJSDate(),
                    lt : requestedDateIST.endOf("day").toJSDate(),
                }
            },
            include : {
                messHall : {
                    include : {
                        students : {
                            select : {
                                id : true,
                                name : true,
                                regNo : true,
                            }
                        }
                    }
                }
            }
        })

        // covert created timestap form UTC to IST for rating
        await sessionRating.forEach(rating => {
            rating.createdAt = DateTime.fromJSDate(rating.createdAt , {zone : "utc"}).setZone("Asia/Kolkata").toISO();
        });

        return res.status(200).json({
            success : true,
            message : "Successfully fetched the rating and reviews of the mess session and the student details",
            sessionRating,
        });

    }
    catch(e){
        console.log(e);
        console.error(e);
        return res.status(500).json({
            success : false,
            message : "Unable to fetch the mess session rating and reviews."
        })
    }
}