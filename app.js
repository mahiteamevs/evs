//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const session = require('express-session');
const passport= require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret:"This is little.",
    resave: false,
    saveUninitialized:false
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  mongoose.connect("mongodb://localhost:27017/evsDB",  { useNewUrlParser: true , useUnifiedTopology: true });
  mongoose.set('useCreateIndex', true);
  
  const userScema = new mongoose.Schema({
      email:String,
      password:String,
      secret:String,
      googleId:String,
      name:String,
      googleJson:String,
      provider:String
  });
  
  userScema.plugin(passportLocalMongoose);  
  userScema.plugin(findOrCreate);        
  
   const User = mongoose.model("User", userScema);
  
   passport.use(User.createStrategy());
  
   // this is for locally
  //  passport.serializeUser(User.serializeUser());
  //  passport.deserializeUser(User.deserializeUser());
  
  passport.serializeUser(function(user, done) {
      done(null, user);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
   let a;
   passport.use(new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/odashboard",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    // function(accessToken, refreshToken, profile, cb) {
      
    //   User.findOrCreate({ googleId: profile.id}, function (err, user) {

    //     return cb(err, user);
    //   });
    // }
    function(accessToken, refreshToken, profile, done) {
        a=profile;
        //check user table for anyone with a google ID of profile.id
        User.findOne({
            googleId: profile.id 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from google (all the profile. stuff)
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    googleId: profile.id ,
                    username: profile.username,
                    provider: 'google',
                
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
    }
));


//organizer login

app.get("/", (req,res)=>{
    res.render("publico");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
  );

  app.get("/auth/google/odashboard", 
  passport.authenticate('google', { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("/odash");
  }); 

app.get("/odash", (req,res)=>{
    if(req.isAuthenticated())
    {

        res.render("odashboard",{pr:a});
    }else{
        
        
        res.redirect("/");
       
    }
});

//logout
app.get("/logout", (req,res)=>{
    req.logOut();
    res.redirect("/");
})

//create election
app.get("/create",(req,res)=>{
    if(req.isAuthenticated())
    {
        res.render("createelection");
    }else{ 
        res.redirect("/"); 
    }
})

app.listen(3000,function(){
    console.log("Server start at 3000");
});