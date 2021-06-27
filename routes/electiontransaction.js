
const express = require("express");
const isOauth = require('../middlewares/isoauth');
const electController = require('../controllers/electiontransaction');

const router = express.Router();

router.get('/transaction/:eId',isOauth,electController.getTransaction);
// router.get('/result/:eId',isOauth,electController.getResult);
//check balance
router.post('/balance',isOauth,electController.postBallance)
router.get('/:eId/block/:bId/i/:hId',isOauth,electController.getBlock);

exports.routes = router; 
