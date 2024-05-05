// controllers/instituteStudentController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to create InstituteStudent details
exports.createInstituteStudent = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming you're using authentication middleware to get the user ID

    const newInstituteStudent = await prisma.instituteStudent.create({
      data: {
        ...req.body,
        userId: userId,
      },
    });

    return res.status(201).json({
      success: true,
      data: newInstituteStudent,
      message: "Institute student details created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create institute student details",
    });
  }
};

// Function to get InstituteStudent details
exports.getInstituteStudent = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming you're using authentication middleware to get the user ID

    const instituteStudent = await prisma.instituteStudent.findUnique({
      where: { userId: userId },
    });

    if (!instituteStudent) {
      return res.status(404).json({
        success: false,
        message: "Institute student details not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: instituteStudent,
      message: "Institute student details retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get institute student details",
    });
  }
};

// Function to update InstituteStudent details
exports.updateInstituteStudent = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming you're using authentication middleware to get the user ID

    const updatedInstituteStudent = await prisma.instituteStudent.update({
      where: { userId: userId },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedInstituteStudent,
      message: "Institute student details updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update institute student details",
    });
  }
};

// Function to delete InstituteStudent details
exports.deleteInstituteStudent = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming you're using authentication middleware to get the user ID

    await prisma.instituteStudent.delete({
      where: { userId: userId },
    });

    return res.status(200).json({
      success: true,
      message: "Institute student details deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete institute student details",
    });
  }
};
