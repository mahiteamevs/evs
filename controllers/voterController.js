const Election = require('../models/election');
const Blockchain = require('../models/blockchain');


exports.getVdashboard = (req, res)=>{
    res.send('voter ')
}

//voter came here firest using public link
exports.getVoterAuthFirst = (req, res, next)=>{

    res.render('voter/voterauth');
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