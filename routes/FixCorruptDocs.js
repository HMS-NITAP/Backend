const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { authMiddlewares } = require("../middlewares");
const { fixCorruptDocsController } = require("../controllers");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 login attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many attempts. Please try again after some time.",
    },
});

router.post("/login", loginLimiter, fixCorruptDocsController.fixDocLogin);
router.post("/upload", authMiddlewares.isFixDocToken, fixCorruptDocsController.fixDocUpload);

module.exports = router;
