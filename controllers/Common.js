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

exports.getRatingOfAllMessSessions = async (req,res) => {
    try{

        const currentDateUTC = new Date.now();

        // convert it into IST
        const currentDateIST = new Date(currentDateUTC.getTime() + (330*60*1000)); //UTC + 5:30

        const startOfDayIST = new Date(currentDateIST.setHours(0, 0, 0, 0));
        const endOfDayIST = new Date(currentDateIST.setHours(23, 59, 59, 999));

        const messHalls = Prisma.messHall.findMany({
            include : {
                messRatingAndReviews : {
                    where : {
                        createdAt : {
                            gte : startOfDayIST,
                            lt : endOfDayIST
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

exports.getMessRatingAndReviewOfCurrentDate = async (req,res) => {
    try{
        // give date in UTC format
        const {messSession} = req.body;

        if(!messSession){
            return res.status(400).json({
                success : false,
                message : "Required data is missing."
            })
        }

       const currentDateUTC = new Date.now();

       // change to IST
       const currentDateIST = new Date(currentDateUTC.getTime() + (330*60*1000));


       const startOfDayIST = new Date(currentDateIST.setHours(0, 0, 0, 0));
       const endOfDayIST = new Date(currentDateIST.setHours(23, 59, 59, 999));

        if(!requestedDate.isValid){
            return res.status(400).json({
                success : false,
                message : "Invalid date format",
            })
        }

        const sessionRating  = await Prisma.messRatingAndReview.findMany({
            where : {
                session : messSession,
                createdAt : {
                    gte : startOfDayIST,
                    lt : endOfDayIST
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
        sessionRating.forEach(rating => {
            const createdAtUTC = new Date(rating.createdAt);
            const createdAtIST = new Date(createdAtUTC.getTime() + (330*60*1000));
            rating.createdAt = createdAtIST.toISOString();
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

exports.getMessRatingAndReview = async (req,res) => {
    try{
        const {messSession,date} = req.body;

        if(!messSession || !date){
            return res.status(404).json({
                success : false,
                message : "Required Data is missing."
            })
        }

        const requestedDateUTC = new Date(date);

        // Check if the date is valid
        if (isNaN(requestedDateUTC.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format',
            });
        }

        // covert it into IST
        const requestedDateIST = new Date(requestedDateUTC.getTime() + (330*60*1000));

        const startOfDayIST = new Date(requestedDateIST.setHours(0, 0, 0, 0));
        const endOfDayIST = new Date(requestedDateIST.setHours(23, 59, 59, 999));

        const sessionRating  = await Prisma.messRatingAndReview.findMany({
            where : {
                session : messSession,
                createdAt : {
                    gte : startOfDayIST,
                    lt : endOfDayIST
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

        sessionRating.forEach(rating => {
            const createdAtUTC = new Date(rating.createdAt);
            const createdAtIST = new Date(createdAtUTC.getTime() + (330*60*1000));
            rating.createdAt = createdAtIST.toISOString();
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
            message : "Unable to fetch rating and review of the mess session."
        })

    }
}