const express = require("express");

const authVcontroller = require("../controllers/oauthController");

const router = express.Router();

router.get('/', authVcontroller.getLogin);
router.post('/ologin', authVcontroller.postLogin);

router.post('/ologout', authVcontroller.postOlogout);
router.post('/osignup', authVcontroller.postSignup);


module.exports = router;