// routes/messHallAllotmentRoutes.js

const express = require("express");
const router = express.Router();
const { authMiddlewares } = require("../middlewares");
const { messHallAllotmentController } = require('../controllers');

router.put("/allotMessHall", authMiddlewares.auth, messHallAllotmentController.allotMessHall);
router.get("/getStudentsAllottedToMessHall/:messHallId", authMiddlewares.auth, messHallAllotmentController.getStudentsAllottedToMessHall);

module.exports = router;
