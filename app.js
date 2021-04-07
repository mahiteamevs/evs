//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
const session = require('express-session');
const MongoDBstore = require('connect-mongodb-session')(session);
//controllers require
const error404 = require('./controllers/error');
//model requires
const Admin = require('./models/admin');

//mongodb url
const MONGODB_URI = "mongodb://localhost:27017/mvs";

const app = express();

//session for orgainzeer
const oSessionStore = new MongoDBstore({        //calling constructor
  uri:MONGODB_URI,
  collection:'osession'
});  

//routes
const oraganizerRoutes = require('./routes/oraganizer');
const authoRoutes = require('./routes/oauth');
const voterRoutes = require('./routes/voter');
const authvRoutes = require('./routes/vauth');



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//organizer session
app.use(session({
  secret:"My secret is awsome",
  resave:false,
  saveUninitialized:false, 
  store:oSessionStore
}))


//flash and csrf

//organizer session logged
app.use((req, res, next) => {
  if(!req.session.admin){
    return next();
  }
  Admin.findById(req.session.admin._id)
    .then(admin => {
      req.admin = admin;
      next();
    })
    .catch(err => console.log(err));
});
//local variable
app.use((req, res,next)=>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

// const a = new Admin({
//   name:"mahi",
//   elections:[]
// });
// a.save();

//routes used
app.use('/o', oraganizerRoutes.routes);
app.use('/v', voterRoutes.routes);
app.use(authoRoutes);
app.use(authvRoutes);

app.use(error404.get404);

mongoose
  .connect(
    "mongodb://localhost:27017/mvs",  { useNewUrlParser: true , useUnifiedTopology: true }
  )
  .then(result => {
  
    app.listen(3000, console.log("at 3000"));
  })
  .catch(err => {
    console.log(err);
  });