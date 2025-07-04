const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();
const resetPassword = require('../mailTemplates/resetPassword');
const PdfGenerator = require("../utilities/PdfGenerator");
const SendEmail = require('../utilities/MailSender');
const fs = require("fs");
const acknowledgementLetter = require('../mailTemplates/acknowledgementLetter');
const acknowledgementAttachment = require('../mailTemplates/acknowledgementAttachment');
const {MessMenu} = require("../constant/MessMenu");

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

exports.fetchHostelBlockNames = async(_,res) => {
    try{
        const hostels = await Prisma.hostelBlock.findMany({});
        return res.status(200).json({
            success:true,
            message:"Hostels Fetched Successfully",
            data:hostels,
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to fetch hostels",
        })
    }
}

exports.fetchHostelBlockRooms = async(req,res) => {
    try{
        const {hostelBlockId} = req.body;

        const hostelBlockRooms = await Prisma.room.findMany({
            where: {
              hostelBlockId: hostelBlockId,
            },
            include: {
              cots: {
                select: {
                  id: true,
                  cotNo: true,
                  status: true,
                },
                orderBy:{
                    cotNo : "asc",
                }
              }
            }
        }); 

        return res.status(200).json({
            success:true,
            message:"Fetched Hostel Block Rooms Successfully",
            data:hostelBlockRooms,
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:"Unable to fetch Hostel Block Rooms"
        })
    }
}

exports.fetchCurrentDateRatingsAndReviews = async(_,res) => {
    try{

        const currentDateUTC = new Date();
        const currentDateIST = new Date(currentDateUTC.getTime() + (330 * 60 * 1000));

        const datePartISTString = currentDateIST.toISOString();
        const startOfDayISTString = datePartISTString.split("T").at(0) + 'T00:00:00.000';
        const endOfDayISTString = datePartISTString.split("T").at(0) + 'T23:59:59.999';

        const startOfDayIST = new Date(startOfDayISTString);
        const endOfDayIST = new Date(endOfDayISTString);

        // const startOfDayISTWithOffset = new Date(startOfDayIST.getTime() + 330 * 60 * 1000);
        // const endOfDayISTWithOffset = new Date(endOfDayIST.getTime() + 330 * 60 * 1000);

        const startOfDayISTWithOffset = startOfDayIST;
        const endOfDayISTWithOffset = endOfDayIST;

        const ratingsGroupedBySession = await Prisma.messRatingAndReview.groupBy({
            by: ['session'],
            where: {
              createdAt: {
                gte: startOfDayISTWithOffset,
                lt: endOfDayISTWithOffset,
              },
            },
            _avg: {
              rating: true,
            },
          });

        const sessionWithCreatedBy = await Promise.all(
            ratingsGroupedBySession.map(async (session) => {
              const reviewData = await Prisma.messRatingAndReview.findMany({
                where: {
                  session: session.session,
                  createdAt: {
                    gte: startOfDayIST,
                    lt: endOfDayIST,
                  },
                },
                include: {
                  createdBy: {
                    select: {
                      name: true,
                      rollNo: true,
                      gender: true,
                    },
                  },
                },
              });
        
              return {
                session: session.session,
                averageRating: session._avg.rating,
                reviews: reviewData.map((review) => ({
                  createdBy: review?.createdBy,
                  rating: review?.rating,
                  review: review?.review,
                })),
              };
            })
          );

        return res.status(200).json({
            success:true,
            message:"Fetched Reviews Successfully",
            data : sessionWithCreatedBy,
        })
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success:false,
            message:"Unable to fetch Mess Data",
        })
    }
}

exports.tryPDF = async(_,res) => {
    try{
        const pdfPath = await PdfGenerator(acknowledgementAttachment("22-07-2024","https://res.cloudinary.com/dwt1vmf2u/image/upload/v1716227467/HMS%20NIT%20AP/w4rm3lg5bnp0i9haz88l.jpg","T Abhiram","7478327120","3rd Year","422259","9222412","Net Banking","30501.00","Nagavali","104","2"), "Abhiram.pdf");
        await SendEmail("tanneriabhi@gmail.com","HOSTEL ALLOTTMENT CONFIRMATION | NIT ANDHRA PRADESH",acknowledgementLetter(),pdfPath,"Abhiram.pdf");
        fs.unlinkSync(pdfPath);
        
        return res.status(200).json({
            success: true,
            message: "Send EMAIL Successfully",
        });
    }catch(e){
        console.log(e);
        return res.status(400).json({
            success: false,
            message: "Unable to GENERATE PDF",
        });
    }
}

exports.fetchCurrentSessionMessMenu = async(req,res) => {
  try{
    const {currentDay, currentSession} = req.body;
    if(!currentDay || !currentSession){
      return res.status(404).json({
        success:false,
        message:"Data is Missing",
      })
    }

    const currentSessionItems = MessMenu[currentDay][currentSession];
    return res.status(200).json({
      success:true,
      message:"Current Session Items Fetched Successfully",
      data : currentSessionItems,
    })

  }catch(e){
    console.log(e);
    return res.status(400).json({
      success:false,
      message:"unable to Fetch Data",
    })
  }
}

exports.fetchDetailedMessMenu = async(_,res) => {
  try{
    const detailedMessMenu = MessMenu;
    if(!detailedMessMenu){
      return res.status(404).json({
        success:false,
        mesage:"Unable To Fetch data",
      })
    }

    return res.status(200).json({
      success:true,
      message:"Fetched Data Successfully",
      data : detailedMessMenu,
    })
    
  }catch(e){
    console.log(e);
    return res.status(400).json({
      success:false,
      message:"unable to fetch Mess Menu",
    })
  }
}

// exports.getMessSessionRatingAndReviews = async (req,res) => {
//     try{
//         const {messHallId,date,session} = req.params.body;

//         const startDate = new Date(date);
//         startDate.setHours(0, 0, 0, 0);

//         const endDate = new Date(date);
//         endDate.setHours(23, 59, 59, 999);

//         if(!messHallId || !date || !session){
//             return res.status(400).json({
//                 success : false,
//                 message : "All fields are required",
//             })
//         }

//         const ratingAndReview = await Prisma.messRatingAndReview.findMany({
//             where : {
//                 messHallId : parseInt(messHallId),
//                 session : session,
//                 createdAt : new Date(date),
//             },
//             select : {
//                 rating:true,
//                 review:true,
//             }
//         });

//         return res.status(200).json({
//             success : true,
//             message : "Fetched the rating and review of the session by date",
//             data:ratingAndReview,
//         })
//     }
//     catch(e){
//         console.log(e);
//         console.error(e);
//         return res.status(500).json({
//             success : false,
//             message : "Something went wrong while fetching the rating and review of the session",
//         })
//     }
// }

// exports.getAvgRatingByMessId = async (req,res) => {
//     try{
//         const {messHallId,session} = req.params.body;

//         if(!messHallId || !session){
//             return res.status(400).json({
//                 success : false,
//                 message : "Requried all fields",
//             })
//         }

//         const result = await Prisma.messRatingAndReview.findMany({
//             where : {
//                 messHallId : parseInt(messHallId),
//                 session : session,
//             },
//             avg : {
//                 rating : true,
//             }
//         });

//         return res.status(200).json({
//             success : true,
//             message : "Successfully fetched the average rating of the particular session",
//             data:result,
//         })
//     }
//     catch(e){
//         console.log(e);
//         console.error(e);
//         return res.status(500).json({
//             success : false,
//             message : "Something went wrong while fetching average rating of the session",
//         })
//     }
// }

// exports.getAvgRatingOfSession = async (req,res) => {
//     try{
//         const session = req.params.body;

//         if(!session){
//             return res.status(400).json({
//                 success : false,
//                 message : "Required all fields",
//             })
//         }

//         const rating = await Prisma.messRatingAndReview.findMany({
//             where : {
//                 session : session,
//             },
//             avg : {
//                 rating : true,
//             }
//         });

//         return res.status(200).json({
//             success : true,
//             message : "Successfully fetched the average rating of the session",
//             data : rating,
//         });
//     }
//     catch(e){
//         console.log(e);
//         console.error(e);
//         return res.status(500).json({
//             success : false,
//             message : "Unable to fetch average rating based on the session",
//         })

//     }
// }

// exports.getAllRatingAndReview = async (req,res) => {
//     try{

//         const ratindAndReview = await Prisma.messRatingAndReview.findMany({
//             select : {
//                 rating : true,
//                 review : true,
//             }
//         });

//         return res.status(400).json({
//             success : true,
//             message : "Successfully fetched all the rating and review ",
//             ratindAndReview,
//         });
//     }
//     catch(e){
//         return res.status(500).json({
//             success : false,
//             message : "Something went wrong while fetching the rating and review",
//         })
//     }
// }

// exports.getRatingOfAllMessSessions = async (req,res) => {
//     try{

//         const currentDateUTC = new Date.now();

//         // convert it into IST
//         const currentDateIST = new Date(currentDateUTC.getTime() + (330*60*1000)); //UTC + 5:30

//         const startOfDayIST = new Date(currentDateIST.setHours(0, 0, 0, 0));
//         const endOfDayIST = new Date(currentDateIST.setHours(23, 59, 59, 999));

//         const messHalls = Prisma.messHall.findMany({
//             include : {
//                 messRatingAndReviews : {
//                     where : {
//                         createdAt : {
//                             gte : startOfDayIST,
//                             lt : endOfDayIST
//                         },
//                     },
//                     include : {
//                         session : true,
//                     }
//                 }
//             }
//         })

//         if(!messHalls){
//             return res.statu(404).json({
//                 success : false,
//                 message : "Mess Hall data not found"
//             })
//         }

//         const sessionRatings = {
//             [MessSession.Breakfast]: { totalRating: 0, ratingCount: 0 },
//             [MessSession.Lunch]: { totalRating: 0, ratingCount: 0 },
//             [MessSession.Snacks]: { totalRating: 0, ratingCount: 0 },
//             [MessSession.Dinner]: { totalRating: 0, ratingCount: 0 },
//         };

//         (await messHalls).forEach(messHall => {
//             messHall.messRatingAndReview.forEach(rating => {
//                 const session = rating.session;
//                 sessionRatings[session].totalRating += rating.rating;
//                 sessionRatings[session].ratingCount++;
//             })
//         })

//         const avgRatingBySession = {};
//         Object.keys(sessionRatings).forEach(session => {
//             const {totalRating,ratingCount} = sessionRatings[session];
//             avgRatingBySession[session] = ratingCount > 0 ? totalRating / ratingCount : 0;
//         });

//         return res.status(200).json({
//             success : true,
//             message : "Successfully fetched the average rating of the mess sessions",
//             avgRatingBySession
//         });
//     }
//     catch(e){
//         console.log(e);
//         console.error(e);
//         return res.status(500).json({
//             success : false,
//             message : "Unable to fetch the average rating of the mess session",
//         })
//     }
// }

// exports.getMessRatingAndReviewOfCurrentDate = async (req,res) => {
//     try{
//         // give date in UTC format
//         const {messSession} = req.body;

//         if(!messSession){
//             return res.status(400).json({
//                 success : false,
//                 message : "Required data is missing."
//             })
//         }

//        const currentDateUTC = new Date.now();

//        // change to IST
//        const currentDateIST = new Date(currentDateUTC.getTime() + (330*60*1000));


//        const startOfDayIST = new Date(currentDateIST.setHours(0, 0, 0, 0));
//        const endOfDayIST = new Date(currentDateIST.setHours(23, 59, 59, 999));

//         if(!requestedDate.isValid){
//             return res.status(400).json({
//                 success : false,
//                 message : "Invalid date format",
//             })
//         }

//         const sessionRating  = await Prisma.messRatingAndReview.findMany({
//             where : {
//                 session : messSession,
//                 createdAt : {
//                     gte : startOfDayIST,
//                     lt : endOfDayIST
//                 }
//             },
//             include : {
//                 messHall : {
//                     include : {
//                         students : {
//                             select : {
//                                 id : true,
//                                 name : true,
//                                 regNo : true,
//                             }
//                         }
//                     }
//                 }
//             }
//         })

//         // covert created timestap form UTC to IST for rating
//         sessionRating.forEach(rating => {
//             const createdAtUTC = new Date(rating.createdAt);
//             const createdAtIST = new Date(createdAtUTC.getTime() + (330*60*1000));
//             rating.createdAt = createdAtIST.toISOString();
//         });

//         return res.status(200).json({
//             success : true,
//             message : "Successfully fetched the rating and reviews of the mess session and the student details",
//             sessionRating,
//         });

//     }
//     catch(e){
//         console.log(e);
//         console.error(e);
//         return res.status(500).json({
//             success : false,
//             message : "Unable to fetch the mess session rating and reviews."
//         })
//     }
// }

// exports.getMessRatingAndReview = async (req,res) => {
//     try{
//         const {messSession,date} = req.body;

//         if(!messSession || !date){
//             return res.status(404).json({
//                 success : false,
//                 message : "Required Data is missing."
//             })
//         }

//         const requestedDateUTC = new Date(date);

//         // Check if the date is valid
//         if (isNaN(requestedDateUTC.getTime())) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid date format',
//             });
//         }

//         // covert it into IST
//         const requestedDateIST = new Date(requestedDateUTC.getTime() + (330*60*1000));

//         const startOfDayIST = new Date(requestedDateIST.setHours(0, 0, 0, 0));
//         const endOfDayIST = new Date(requestedDateIST.setHours(23, 59, 59, 999));

//         const sessionRating  = await Prisma.messRatingAndReview.findMany({
//             where : {
//                 session : messSession,
//                 createdAt : {
//                     gte : startOfDayIST,
//                     lt : endOfDayIST
//                 }
//             },
//             include : {
//                 messHall : {
//                     include : {
//                         students : {
//                             select : {
//                                 id : true,
//                                 name : true,
//                                 regNo : true,
//                             }
//                         }
//                     }
//                 }
//             }
//         })

//         sessionRating.forEach(rating => {
//             const createdAtUTC = new Date(rating.createdAt);
//             const createdAtIST = new Date(createdAtUTC.getTime() + (330*60*1000));
//             rating.createdAt = createdAtIST.toISOString();
//         });

//         return res.status(200).json({
//             success : true,
//             message : "Successfully fetched the rating and reviews of the mess session and the student details",
//             sessionRating,
//         });
//     }
//     catch(e){
//         console.log(e);
//         console.error(e);
//         return res.status(500).json({
//             success : false,
//             message : "Unable to fetch rating and review of the mess session."
//         })

//     }
// }