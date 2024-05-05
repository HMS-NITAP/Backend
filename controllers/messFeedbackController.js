// controllers/messFeedbackController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to generate mess feedback
exports.generateMessFeedback = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming you're using authentication middleware to get the user ID

    const newFeedback = await prisma.messFeedback.create({
      data: {
        ...req.body,
        userId: userId,
      },
    });

    return res.status(201).json({
      success: true,
      data: newFeedback,
      message: "Mess feedback generated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate mess feedback",
    });
  }
};

// Function to get all mess feedback
exports.getAllMessFeedback = async (req, res) => {
  try {
    const allFeedback = await prisma.messFeedback.findMany();

    return res.status(200).json({
      success: true,
      data: allFeedback,
      message: "All mess feedback retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve all mess feedback",
    });
  }
};

// Function to get average rating for a particular type of mess
exports.getAverageRatingByType = async (req, res) => {
  try {
    const { type } = req.params;
    const averageRating = await prisma.messFeedback.aggregate({
      where: { type: type },
      avg: { rating: true },
    });

    return res.status(200).json({
      success: true,
      data: averageRating.avg.rating,
      message: `Average rating for ${type} mess: ${averageRating.avg.rating}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Failed to retrieve average rating for ${type} mess`,
    });
  }
};
