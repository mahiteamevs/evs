//jshint esversion:6
const db = require("./db/db.js");
db.connectDB();
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoDBstore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
//controllers require
const error404 = require("./controllers/error.js");
//model requires
const Admin = require("./models/admin.js");
const Voter = require("./models/voter.js");
//mongodb url

const app = express();

//session for orgainzeer
const oSessionStore = new MongoDBstore({
  //calling constructor
  uri: process.env.MongoUri,
  collection: "osession",
});
const csrfProtection = csrf(); //csrf token

//routes
const oraganizerRoutes = require("./routes/oraganizer.js");
const authoRoutes = require("./routes/oauth.js");
const voterRoutes = require("./routes/voter.js");
const authvRoutes = require("./routes/vauth.js");
const electRoutes = require("./routes/electiontransaction.js");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//organizer session
app.use(
  session({
    secret: "My secret is awsome",
    resave: false,
    saveUninitialized: false,
    store: oSessionStore,
  })
);

//flash and csrf
app.use(csrfProtection);
//organizer session logged
app.use((req, res, next) => {
  if (!req.session.admin) {
    return next();
  }
  Admin.findById(req.session.admin._id)
    .then((admin) => {
      req.admin = admin;
      next();
    })
    .catch((err) => console.log(err));
});
//local variable
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//voter

// //flash and csrf

//organizer session logged
app.use((req, res, next) => {
  if (!req.session.voter) {
    return next();
  }
  Voter.findById(req.session.voter._id)
    .then((voter) => {
      req.voter = voter;
      next();
    })
    .catch((err) => console.log(err));
});
//local variable
app.use((req, res, next) => {
  res.locals.isVAuthenticated = req.session.isVLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//routes used
app.use("/o", oraganizerRoutes.routes);
app.use("/v", voterRoutes.routes);
app.use(authoRoutes);
app.use(authvRoutes);
app.use("/p/", electRoutes.routes);
app.get("/about", (req, res) => {
  res.render("about");
});
app.use(error404.get404);

//server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
