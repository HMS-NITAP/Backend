// controllers/complaintController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to create a complaint
exports.createComplaint = async (req, res) => {
  try {
    const { type, summary, detailed } = req.body;
    const { userId } = req.user; // Assuming you're using authentication middleware to get the user ID

    const newComplaint = await prisma.complaint.create({
      data: {
        type,
        summary,
        detailed,
        status: "notviewed",
        complaineeId: userId,
        userId: userId,
      },
    });

    return res.status(201).json({
      success: true,
      data: newComplaint,
      message: "Complaint created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create complaint",
    });
  }
};

// Function to get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const allComplaints = await prisma.complaint.findMany();

    return res.status(200).json({
      success: true,
      data: allComplaints,
      message: "All complaints retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve all complaints",
    });
  }
};

// Function to update a complaint
exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    const updatedComplaint = await prisma.complaint.update({
      where: { id: parseInt(id) },
      data: {
        status,
        remark,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedComplaint,
      message: "Complaint updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update complaint",
    });
  }
};
