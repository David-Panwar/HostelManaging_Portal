import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
    createdBy:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    content : {
        type: String ,
        required : true
    },
    createdOn : {
        type: mongoose.Schema.Types.ObjectId ,
        ref: "Post"
    }
    
})

export const Request = mongoose.model ("Request" , RequestSchema)