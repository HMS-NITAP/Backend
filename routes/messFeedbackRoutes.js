// routes/messFeedbackRoutes.js

const express = require("express");
const router = express.Router();
const { authMiddlewares } = require("../middlewares");
const { messFeedbackController } = require('../controllers');

router.post("/generateMessFeedback", authMiddlewares.auth, messFeedbackController.generateMessFeedback);
router.get("/getAllMessFeedback", messFeedbackController.getAllMessFeedback);
router.get("/getAverageRatingByType/:type", messFeedbackController.getAverageRatingByType);

module.exports = router;
