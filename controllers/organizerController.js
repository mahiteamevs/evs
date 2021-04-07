//jshint esversion:6
const Admin = require('../models/admin');
const Election = require('../models/election');
const Blockchain = require('../models/blockchain');
const { GENESIS_DATA} = require('../config');
const election = require('../models/election');
const cryptoHash = require('../utils/cryptohash');
const mongoose  = require('mongoose');
const crypto = require('crypto');


exports.getOdashboard = (req, res, next)=>{

    res.render('organizer/dashboard',{
        admin:req.admin,
        pageTitle:'Organizer | Welcome to the dashboard'
    });
}

exports.getOprofile = (req, res)=>{
    res.render('organizer/profile',{
        pageTitle:'Organizer | Your profile'
    });
}

exports.getOcreateElection = (req, res)=>{

    res.render('organizer/createelection',{
        pageTitle:'Organizer | Create a new election'
    })
}

exports.postOcreateElection = (req, res)=>{
    const electionTitle = req.body.electionTitle;
    const candidatesName = req.body.candidatesName;
    const candidatesAge = req.body.candidatesAge;
    const votersGmail = req.body.votersGmail;
    const typeOfId = req.body.typeOfId;
    const endDate = req.body.endDate;
    const endTime = req.body.endTime;
    const desc = req.body.desc;
    var d = new Date(endDate+' '+endTime);
    var timeStampEnd = d.getTime();
    const voterMails = votersGmail.map(i=>{
        return {voterMail : i}
    });
    var l =-1;
   const candidatesDetailsArr = candidatesName.map(i=>{
        l++;
       return { candName: i, candAge : candidatesAge[l]}
      
   });
   var electionId = mongoose.Types.ObjectId();   //manually creating id for election
   var blockchainId = mongoose.Types.ObjectId();   

 
   //creating genesis  blockchain
   const b1 = new Blockchain({
       _id: blockchainId,
    chain:[{
        index:1,
        timestamp : Date.now(),
        nonce : 0,
        hash: cryptoHash(Date.now()),
        prevHash:"000",
        transactions:[]
    }],
    desc:desc,
    election:{
        electionTitle:electionTitle,
        electionId:electionId
    },
    admin:{
        email:req.admin.email,
        adminId : req.admin
    }
});

//blockchain save
 b1.save();
 req.admin.addToCtreateElection(electionTitle,electionId);

   //creation of election
   
   crypto.randomBytes(32,(err,buffer)=>{
    if(err){
        console.log(err);
        }
   const link = buffer.toString('hex');
    const election = new Election({
        _id:electionId,
        electionTitle: electionTitle,
        candidatesDetails :candidatesDetailsArr,
        voterMails : voterMails,
        voterPublicLink :link,
        verifcationIdType:typeOfId,
        endTimeVoterVerifLink: timeStampEnd,
        descs: desc,
        blockchain : blockchainId,
        admin:{
            email:req.admin.email,
            adminId : req.admin
           }
    }); 
    election.save()
    .then(result =>{
  

        res.redirect('/o/dashboard');
    })
});

    
}



//delete election
exports.postDeleteElection = (req, res, next) =>{
    const electionId = req.body.electionId;
     Election.findById(electionId)
    .then(election=>{
       return election.blockchain
    })
    .then(blockchainId=>{
        
        Blockchain.remove({_id:blockchainId})
        .then(result=>{
            Election.remove({_id:electionId})
        .then(result=>{
        console.log(result);
        req.admin
        .deleteElection(electionId)
        .then(result => {
            res.redirect('/o/dashboard');
          })
          .catch(err => console.log(err));
    })
    })
        }) 
}


//election 
exports.getElectionDashboard = (req, res, next) =>{
   const electionId = req.params.electionId;
  // const elLink = cryptoHash(electionId);
   
   Election.findById(electionId)
   .then(election =>{
    res.render('organizer/elction/adminelctiondash',{
        election:election,
        pageTitle: election.electionTitle,
        publicLink : election.voterPublicLink,
        path:"/electiondashboard"
    })
   })

 
}

//election announse
exports.postAnnounce = (req, res, next) =>{
    const electionId = req.body.electionId;
  //  console.log(electionId);
    //add genesis block
    //mining
    Election.findById(electionId)
    .then(election=>{
       const bId = election.blockchain;
       Blockchain.findById(bId)
       .then(b=>{
           b.mining();
       })
    
    })
    .catch(err=>{
        console.log(err);
    })

    //transaction to itself

    //create a link
}

exports.postCreateWallet = (req, res)=>{
    const electionId = req.body.electionId;
    
    Election.findById(electionId)
    .then(election=>{
        var blockchainId = election.blockchain             //.addTransaction(election.voterMails.length,"coinbase", "hjdahja");
        Blockchain.findById(blockchainId)
        .then(b=>{
            b.addTransaction(election.voterMails.length,"coinbase", "hjdahja");
        })
        res.redirect('/o/dashboard');
    })   
    // console.log(blockchainId)
}