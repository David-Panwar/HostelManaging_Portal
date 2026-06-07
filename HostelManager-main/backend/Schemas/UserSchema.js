import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true,
  },

  hostelName :{ 
    type : String ,
    required :true 
  },
  
  gmail:{
    type : String,
    required : true 
  },
  role:{
    type: String ,
    enum : ["student" , "warden"] ,
    required : true 
  },
  photo: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String
  }


})

export const User = mongoose.model("User" , userSchema)