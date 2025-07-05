import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender:{
        type:String,
        required:[true,"senderid is required"]
    },
    message:{
        type:String,
        required:[true,"Message can't be empty"]
    },
    Community:{
        type:String,
        required:[true,"Community ID is required"]
    },
    senderProfile:{
        type:String
    }
},{
    timestamps:true,
    collection:"messages"
})

export const message = mongoose.model("message",messageSchema)