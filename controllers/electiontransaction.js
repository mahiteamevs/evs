const Election = require('../models/election');
const Blockchain = require('../models/blockchain');
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');    //for rsa and generating keypair


//voter came here firest using public link
exports.getTransaction = (req, res, next)=>{
    const electionId = req.params.eId;
   // console.log(electionId)
    Election.findById(electionId)
    .then(e=>{
        if(!e){
            return res.redirect('/o/dashboard');
        }
      return  Blockchain.findById(e.blockchain)
    })
    .then(b=>{
        //console.log(b.chain)
        res.render('election/transaction',{
        pageTitle:`Transac tion | Welcome to the election details`,
        path:'/v/election-details',
        admin:req.admin,
        chain :b.chain
    });
    })


    // res.render('election/transaction',{
    //     pageTitle:`Transac tion | Welcome to the election details`,
    //     path:'/v/election-details'
    // });
}

//check balance
exports.postBallance = (req, res, next)=>{
    const electionId = req.body.electionId;
    const pubkey = req.body.pubkey;
 
    Election.findById(electionId)
    .then(e=>{
       // console.log(e.blockchain)
       return Blockchain.findById(e.blockchain)   
    })
    .then(b=>{
           return b.knowBalance(pubkey)
    })
    .then(balance=>{
        if(req.voter){
            
        }
    })
}
