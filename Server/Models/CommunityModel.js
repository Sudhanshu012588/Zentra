import mongoose, { Schema, Types } from "mongoose"
import {User} from "./UserModel.js"
const CommunitySchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,"Community name is needed"]
    },
    avatar:{
        type:String
    },
    description:{
        type:String,
        required:[true,"Description is required"]
    },
    members:{
        type:[Schema.Types.ObjectId],
        ref:'User'
    },
    admin:{
        type:[Schema.Types.ObjectId],
        ref:'User'
    }
},{
    timestamps:true,
    collection:"Community"
})

export const Community = mongoose.model('Community',CommunitySchema)