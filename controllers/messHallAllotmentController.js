// controllers/messHallAllotmentController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to allot mess hall to students
exports.allotMessHall = async (req, res) => {
  try {
    const { messHallId, studentIds } = req.body;

    // Update the mess hall with the allocated students
    const updatedMessHall = await prisma.messHall.update({
      where: { id: messHallId },
      data: {
        students: {
          connect: studentIds.map((studentId) => ({ id: studentId })),
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedMessHall,
      message: "Mess hall allotted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to allot mess hall",
    });
  }
};

// Function to get students allotted to a mess hall
exports.getStudentsAllottedToMessHall = async (req, res) => {
  try {
    const { messHallId } = req.params;

    const students = await prisma.student.findMany({
      where: { messHallId: parseInt(messHallId) },
    });

    return res.status(200).json({
      success: true,
      data: students,
      message: "Students allotted to mess hall retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve students allotted to mess hall",
    });
  }
};

/*Middleware: No specific middleware needed for this part.
Ensure you've set up the appropriate middleware for authentication (authMiddlewares.auth) to verify the official's identity.
This setup allows officials to allot a particular mess hall to multiple students and retrieve the list of students allotted
to a specific mess hall. Adjust the code according to your specific requirements and the structure of your project! 
let me know if you need further clarification or assistance!*/