// routes/complaintRoutes.js

const express = require("express");
const router = express.Router();
const { authMiddlewares } = require("../middlewares");
const { complaintController } = require('../controllers');

router.post("/createComplaint", authMiddlewares.auth, complaintController.createComplaint);
router.get("/getAllComplaints", authMiddlewares.auth, complaintController.getAllComplaints);
router.put("/updateComplaint/:id", authMiddlewares.auth, complaintController.updateComplaint);

module.exports = router;
