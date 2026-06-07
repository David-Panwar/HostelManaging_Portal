const mongoose = require('mongoose')
const User = require('./Schemas/UserSchema')
const dbURI = process.env.dbURI

const db = async ()=> {
    try{
            await mongoose.connect(dbURI)
            console.log("connectd db");
            // await User.create({
            //     name: "Vishnu" ,
            // })
            
    }
    catch(err){
        console.log(err);    
        
    } 
}



module.exports = db