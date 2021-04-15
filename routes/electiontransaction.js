
const express = require("express");
const isOauth = require('../middlewares/isoauth');
const electController = require('../controllers/electiontransaction');

const router = express.Router();

router.get('/transaction/:eId',isOauth,electController.getTransaction);

//check balance
router.post('/balance',isOauth,electController.postBallance)

exports.routes = router; 
