const express = require("express");
const router = express.Router();

const authRoutes = require("./Auth");

router.use("/auth",authRoutes);

module.exports = router;