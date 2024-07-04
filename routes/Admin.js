const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {adminController} = require('../controllers');

router.post('/createHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.createHostelBlock);
router.delete('/deleteHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.deleteHostelBlock);
router.put('/addWardenToHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.addWardenToHostelBlock);
router.put('/removeWardenFromHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.removeWardenFromHostelBlock);
router.post('/createMessHall',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.createMessHall);
router.delete('/deleteMessHall',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.deleteMessHall);
router.post('/createOfficialAccount',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.createOfficialAccount);
router.delete('/deleteOfficialAccount',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.deleteOfficialAccount);
router.get('/fetchOfficialAccounts',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchOfficialAccounts);

module.exports = router;