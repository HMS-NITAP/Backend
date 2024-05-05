// middlewares/instituteStudentMiddlewares.js

// Middleware to check if the user is authorized to access institute student data
const isAuthorized = (req, res, next) => {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: "Access forbidden. You are not authorized to access institute student data.",
      });
    }
    next();
  };
  
  module.exports = { isAuthorized };
  