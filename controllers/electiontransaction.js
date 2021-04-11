


//voter came here firest using public link
exports.getTransaction = (req, res, next)=>{
    const electionId = req.params.elecId;
    res.render('election/transaction',{
        pageTitle:`Transac tion | Welcome to the election details`,
        path:'/v/election-details'
    });
}


