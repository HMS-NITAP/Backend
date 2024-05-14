const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {adminController} = require('../controllers');

router.post('/createHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.createHostelBlock);
router.delete('deleteHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.deleteHostelBlock);
router.put('/addWardenToHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.addWardenToHostelBlock);
router.put('/removeWardenFromHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.removeWardenFromHostelBlock);

module.exports = router;