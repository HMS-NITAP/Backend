const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {authController} = require('../controllers');

router.post("/sendOTP",authController.sendOTP);
router.post("/signup",authController.signup);
router.post("/login",authController.login);
router.post("/changePassword",authMiddlewares.auth,authController.signup);

module.exports = router;