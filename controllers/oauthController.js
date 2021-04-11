const Admin = require('../models/admin');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const {validationResult} = require("express-validator");

exports.getLogin = (req, res, next) => {
    res.render('organizer/auth/loginsignup',{
        pageTitle:"Blockchain Voting System | Login",
        errorMsg : "",
        isSignupMode:false,
        oldInput : {email:null, password:null,aname:null,aemail:null, apassword:null, cpassword:null},
        validationErrors:[]
    });
}


exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){       // if email was empty
        return res.status(422)
        .render('organizer/auth/loginsignup',{
            pageTitle:"Blockchain Voting System | Login",
            path:"/login",
            isSignupMode:false,
            errorMsg:errors.array()[0].msg,
            oldInput : {email:null, password:null,aname:null, aemail:null, apassword:null, cpassword:null},
            validationErrors:errors.array()
    
        });
    }

   Admin.findOne({email:email})
    .then(admin=>{
        if(!admin){               // if email is not found
           return res.status(422)
           .render('organizer/auth/loginsignup',{
            pageTitle:"Blockchain Voting System | Login",
            path:"/login",
               errorMsg:'Invalid user email or password!',
               isSignupMode:false,
               oldInput : {email:email, password:pass,aname:null,aemail:null, apassword:null, cpassword:null},
               validationErrors:[]
           });
        }
      bcrypt.compare(pass,admin.pass)
      .then(matched=>{
          if(matched){
            req.session.isLoggedIn = true;
            req.session.admin = admin;
            return req.session.save(err=>{
              //  console.log(err);
              res.redirect('/o/dashboard');
            });   
          } else{           // if password not matched
            return res.status(422)
           .render('organizer/auth/loginsignup',{
            pageTitle:"Blockchain Voting System | Login",
            path:"/login",
            isSignupMode:false,
               errorMsg:'Invalid user email or password!',
               oldInput : {email:email, password:pass,aname:null, aemail:null, apassword:null, cpassword:null},
               validationErrors:[]
           });
          }      
      })  
    })
    .catch(err =>console.log(err));
}
//destroying the session
exports.postOlogout = (req, res)=>{
    req.session.destroy(err=>{
       // console.log(err);
        res.redirect('/');
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.aemail;
    const pass = req.body.apassword;
    const name = req.body.aname;
    const errors = validationResult(req);
    console.log(name)
    if(!errors.isEmpty()){
        return res.status(422)
        .render('organizer/auth/loginsignup',{
            pageTitle:"Blockchain Voting System | Login",
            path:"/login",
            errorMsg:errors.array()[0].msg,
            isSignupMode:true,
            oldInput : {email:null, password:null, aemail:email, aname:name, apassword:pass, cpassword:req.body.cpassword},
            validationErrors:errors.array()
    
        });
    }
        return bcrypt.hash(pass,13)
        .then(hashedpass=>{
            const a = new Admin({
                name:name,
                email:email,
                pass:hashedpass,
                elections:[]
            });
            return a.save();
        })
        .then(result=>{    
            res.redirect('/');
            //if mail sent
        })  
    // })
    .catch((error) => {
        console.error(error)
      })
}