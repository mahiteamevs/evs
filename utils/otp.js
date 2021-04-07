const cryptoHash = require('./cryptohash');
const crypto = require('crypto');
const numbers = ['0','1','2','3','4', '5','6', '7', '8', '9'];
   var otps ='';
  
   crypto.randomBytes(32,(err,buffer)=>{
    if(err){
        console.log(err);
        }
   const link = buffer.toString('hex');
   const hash = cryptoHash(link)
    otps = parseInt(hash.substring(8,16),16);
    module.exports = otps
    });

