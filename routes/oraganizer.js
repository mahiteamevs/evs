const express = require("express");

const organizerController = require('../controllers/organizerController');
//middleware
const isOauth = require('../middlewares/isoauth');
const router = express.Router();

router.get('/dashboard',isOauth, organizerController.getOdashboard);
router.get('/profile',isOauth, organizerController.getOprofile);
router.get('/create',isOauth, organizerController.getOcreateElection);
router.post('/create-election',isOauth,organizerController.postOcreateElection);
router.get('/:electionTitle/:electionId',isOauth, organizerController.getElectionDashboard);


//delete election
router.post('/delete-election',isOauth,organizerController.postDeleteElection);

//annoncing the election
router.post('/announce',isOauth,organizerController.postAnnounce)
router.post('/create-wallet',isOauth, organizerController.postCreateWallet)

exports.routes = router;