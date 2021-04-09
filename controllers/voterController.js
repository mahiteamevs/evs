const Election = require('../models/election');
const Blockchain = require('../models/blockchain');


exports.getVdashboard = (req, res)=>{
    res.render('voter/dashboard',{
        voter:req.voter,
        pageTitle:'Voter | Welcome to the dashboard',
        path:'/v/dashboard'
    });
}

//voter came here firest using public link
exports.getVoterAuthFirst = (req, res, next)=>{

    res.render('voter/voterauth');
}

//voter came here firest using public link
exports.getElectionDetails = (req, res, next)=>{
    res.render('election/electiondetail',{
        voter:req.voter,
        pageTitle:`${req.voter.election.electionTitle} | Welcome to the election details`,
        path:'/v/election-details'
    });
}



exports.getVoterVerification = (req, res, next) =>{
    const linkId = req.params.link;
    Election.findOne({voterPublicLink:linkId, endTimeVoterVerifLink:{$gt: Date.now()}})
    .then(election =>{
       if(election){
        res.render('voter/voterverif',{
            pageTitle:'Voter Verification | Be a part of voter'
        });
       }else{
           res.render('404');
       }
    })
    
}