import Nudge from "../Models/NudgeModel.js";
import {User} from "../Models/UserModel.js"
export const createNudge= async(req,res)=>{
    const {title,body,creatorid}=req.body
    if(!title || !body || !creatorid){
        res.status(400).json({
            status:"failed",
            message:"No title,id or body Provided "
        })
        return
    }
    try{
        const user = await User.findOne({email:creatorid})
        if(user){

            const nudge = await Nudge.create({
                creatorId:creatorid,
                title:title,
                body:body
            })
            res.status(200).json({
                status:"success",
                message:"Nudge created successfully",
                nudge
            })
        }else{
            throw new error("Invalid user")
        }
    }catch(error){
        res.status(500).json({
            message:error,
            status:"failed to create a nudge"
        })
    }
}

export const fetchNudge = async(req,res)=>{
    const{id}=req.body;
    if(!id){
        console.log("here")
        res.status(400).json({
            status:'fail',
            message:"id not provided"
        })
        return;
    }
    const user = await User.findOne({email:id})
    if(user){
        const nudges = await Nudge.find({creatorId:id})
        res.status(200).json({
            status:"success",
            nudges,
            profilephoto: user.profilephoto
        })
    }
}