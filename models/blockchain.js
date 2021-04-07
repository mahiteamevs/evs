const mongoose = require('mongoose');
const cryptoHash = require('../utils/cryptohash');
const hexToBinary = require('hex-to-binary');

const Schema = mongoose.Schema;

const blockchainSchema = new Schema({
    chain :[{
        index:{
            type: Number,
            required :true
        },
        timestamp : {
            type: Number,
            required :true
        },
        nonce :{
            type: Number,
            required :true
        },
        hash:{
            type: String,
            required :true
        },
        prevHash : {
            type: String,
            required :true
        },
        transactions :[{
            hash:{
                type:String
            },
            sender:{
                type: String,
                required :true
            },
            receiver :{
                type: String,
                required :true
            },
            vote : {
                type: Number,
                required :true
            }
        }]
    }],
    memTransac:[{
        hash:{
            type:String
        },
        sender:{
            type: String,
            required :true
        },
        receiver :{
            type: String,
            required :true
        },
        vote : {
            type: Number,
            required :true
        }
    }],
    admin : {
        email: { type:String,required: true },
        adminId :{
            type: Schema.Types.ObjectId,
            ref:'User'
        }
    },
    election : {
        electionTitle: { type:String,required: true },
        electionId :{
            type: Schema.Types.ObjectId,
            ref:'Election'
        }
    }
 
});
   
// calling genesis block 
// blockchainSchema.methods.genesis = function(){
//     const genesis = {
//             index:1,
//             timestamp : Date.now(),
//             nonce : 0,
//             hash: cryptoHash(Date.now()),
//             prevHash:"00",
//             transactions:[]

//         }
//     this.chain = genesis;
//     return this.save();
// }


//mining
blockchainSchema.methods.mining = function(){
    const wholeChain = [...this.chain];
    const lastBlock = wholeChain[wholeChain.length-1];
    const {timestamp, nonce, hash } = minedBlock(lastBlock);
    console.log(timestamp, nonce, hash );
    // let hash;
    // const timestamp = Date.now();

    // //proof of work
    // let nonce =0;
    //   do {
    //     nonce++;
        
    //    // difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
    //     hash = cryptoHash(timestamp, lastHash, nonce);
    //     console.log(nonce,hash);
    //   } while (hash.substring(0, 2) !== '0'.repeat(2));              // till two 0 met

}

function minedBlock(lastBlock) {
    const lastHash = lastBlock.hash;
    let hash;
    const timestamp = Date.now();

    //proof of work
    let nonce =0;
      do {
        nonce++;
        
       // difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
        hash = cryptoHash(timestamp, lastHash, nonce);
       // console.log(nonce,hash);
      } while (hash.substring(0, 4) !== '0'.repeat(4));              // till two 0 met
 
      return { timestamp, nonce, hash };
}


blockchainSchema.methods.addTransaction = function(amount,sender,receiver){
    const wholeChain = [...this.chain];
    const hash = cryptoHash(amount,sender,receiver);
    
    if(sender==="coinbase"){
       wholeChain.push({
            index:2,
            timestamp : Date.now(),
            nonce :3,
            hash:hash,
            prevHash : "jhss",
            transactions:[{
                hash:hash,
            sender:sender,
            receiver:receiver,
            vote:amount
            }]
        });
    }

   this.chain= wholeChain;
    return this.save();
}



module.exports = mongoose.model('Blockchain',blockchainSchema);