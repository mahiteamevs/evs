const express = require("express");

const authVcontroller = require("../controllers/vauthController");

const router = express.Router();

//login
router.get('/public/:link',authVcontroller.getVoterLogin);
router.post('/vlogin',authVcontroller.postLogin);
//router.get('/votp',authVcontroller.getVoterOtp);
router.post('/votp',authVcontroller.postOtp);
// router.get('/', authVcontroller.getLogin);
// router.post('/vlogin', authVcontroller.postLogin);

// router.post('/ologout', authVcontroller.postOlogout);
// router.post('/osignup', authVcontroller.postSignup);


module.exports = router;