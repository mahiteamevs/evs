
const express = require("express");

const electController = require('../controllers/electiontransaction');

const router = express.Router();

router.get('/transaction',electController.getTransaction);



exports.routes = router; 
