const express = require("express");

const voterController = require('../controllers/voterController');
const isVauth = require('../middlewares/isvauth');
const router = express.Router();

router.get('/dashboard',isVauth, voterController.getVdashboard);

//voter came here firest using public link
router.get('/voterauthfirst',isVauth,voterController.getVoterAuthFirst);


router.get('/election-details',isVauth,voterController.getElectionDetails);
//voter verification
// router.get('/public/:link',voterController.getVoterVerification);

//wallet
router.get('/wallet', isVauth,voterController.getWallet);
router.post('/wallet', isVauth,voterController.postWallet);

//balance
router.post('/balance',isVauth,voterController.postBallance);

//voting
router.get('/vote',isVauth,voterController.getVote);
router.post('/vote', isVauth,voterController.postVote);

exports.routes = router; 




