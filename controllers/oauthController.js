const Admin = require('../models/admin');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('organizer/auth/loginsignup');
}


exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.password;
   Admin.findOne({email:email})
    .then(admin=>{
        if(!admin){
           return res.redirect('/');
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
          } else{
            res.redirect('/');
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
    const email = req.body.email;
    const pass = req.body.password;

    //finding if user already signup
    Admin.findOne({email:email})
    .then(admin =>{
        if(admin){
            res.redirect('/');
        }
        return bcrypt.hash(pass,13)
        .then(hashedpass=>{
            const a = new Admin({
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
    })
    .catch((error) => {
        console.error(error)
      })
}