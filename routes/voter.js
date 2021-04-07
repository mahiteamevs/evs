const express = require("express");

const voterController = require('../controllers/voterController');

const router = express.Router();

router.get('/dashboard', voterController.getVdashboard);

//voter came here firest using public link
router.get('/voterauthfirst',voterController.getVoterAuthFirst);

//voter verification
// router.get('/public/:link',voterController.getVoterVerification);


exports.routes = router; 




