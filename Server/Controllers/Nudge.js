import Nudge from "../Models/NudgeModel.js";
import {User} from "../Models/UserModel.js"
export const createNudge= async(req,res)=>{
    const {title,body,creatorid,creatorname,profilephoto}=req.body
    if(!title || !body || !creatorid || !creatorname){
        res.status(400).json({
            status:"failed",
            message:"No title,id or body Provided "
        })
        return
    }
    try{
        const user = await User.findOne({email:creatorid})
        if(user){
            console.log(user.profilephoto)
            const nudge = await Nudge.create({
                creatorId:creatorid,
                title:title,
                body:body,
                author:creatorname,
                profilephoto:user.profilephoto
            })
            console.log(nudge)
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
            profilephoto: user.profilephoto,
            name:user.name
        })
    }
}

//delete
export const deleteNudge = async(req,res)=>{
    const {id} = req.body;
    if(!id){
        res.status(400).json({
            message:"failed"
        })
        return;
    }
    const nudge = await Nudge.findByIdAndDelete(id);

    if(nudge){
        res.status(200).json({
            status:"success",
            message:"Nudge deleted successfully"
        })
        return;
    }
    else{
        res.status(500).json({
            status:"failed",
            message:"Cant find the nudge"
        })
    }
}

// Like a Nudge
export const like = async (req, res) => {
  const { id, userId } = req.body;

  if (!id || !userId) {
    return res.status(400).json({
      status: "failed",
      message: "Nudge ID and User ID are required",
    });
  }

  try {
    const nudge = await Nudge.findById(id);

    if (!nudge) {
      return res.status(404).json({
        status: "failed",
        message: "Nudge not found",
      });
    }

    // Check if user has already liked it
    if (nudge.likedBy.includes(userId)) {
      return res.status(400).json({
        status: "failed",
        message: "You already liked this nudge",
      });
    }

    // Otherwise, like it
    nudge.likes += 1;
    nudge.likedBy.push(userId);
    await nudge.save();

    return res.status(200).json({
      status: "success",
      message: "Nudge liked successfully",
      likes: nudge.likes,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//reply
export const reply = async (req, res) => {
  const { author, text, nudgeId } = req.body; // Fix here: destructure from req.body
    console.log(author,text,nudgeId)
  if (!author || !text || !nudgeId) {
    return res.status(400).json({
      status: "failed",
      message: "Required fields not provided",
    });
  }

  try {
    const nudge = await Nudge.findById(nudgeId);
    if (!nudge) {
      return res.status(404).json({
        status: "failed",
        message: "Can't find the nudge",
      });
    }

    const newComment = { author, text };
    nudge.comments.push(newComment);
    await nudge.save();

    return res.status(200).json({
      status: "success",
      message: "Comment added successfully",
      comments: nudge.comments,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Can't create a comment now",
      error: error.message,
    });
  }
};

//all nudges

export const getallnudges = async(req,res)=>{
    try{
        const nudges = await Nudge.find()
        if(nudges){
            return res.status(200).json({
                status:"success",
                message:"Got all Nudges",
                nudges
            })
        }
    }catch(error){
         return res.status(500).json({
            status:"failed",
            message:"can't get all nudges"
         })   
        }
}