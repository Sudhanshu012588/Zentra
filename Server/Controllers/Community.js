import {Community} from "../Models/CommunityModel.js"
import {compare} from "../utility/JWTT.js"
import {User} from "../Models/UserModel.js"


export const create = async(req,res)=>{
    const {name,description,AccessToken,avatar}=req.body;

    if(!name || !description || !AccessToken){
        return res.status(400).json({
            status:"invalid fields",
            message:"name,description,Accesstoken can't recieved"
        })
    }

    const decodedToken = await compare(AccessToken,process.env.JWT_SECRET);
    if(!decodedToken){
        return res.status(401).json({
            status:"Unauthorized Access",
            Message:"Invalid AccessToken"
        })
    }
    try {
        const newCommunity =await Community.create({
        name:name.toLowerCase(),
        description:description,
        admin:[decodedToken.id],
        members:[decodedToken.id],
        avatar:avatar
    })

        if(newCommunity){
        return res.status(200).json({
            status:"Success",
            newCommunity
        })
    }else{
        throw new error
    }
    } catch (error) {
        return res.status(500).json({
            message:"Can't create community"
        })
    }
    

    
}

export const fetchCommunities = async(req,res)=>{
    const {AccessToken} = req.body;
    // console.log(AccessToken)
    if(!AccessToken){
        return res.status(400).json({
            status:"failed",
            message:"Can't find accesstoken"
        })
    }

    try {
        const decodedToken = await compare(AccessToken,process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(500).json({
                status:"failed",
                message:"Invalid AccessToken"
            })
        }

        const communities = await Community.find();
        if(communities.length > 0){
            return res.status(200).json({
                status:"success",
                message:"found the communities",
                communities
            })
        }else{
            throw new error('cannot get communities')
        }
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"didn't fetched any communities"
        })
    }
}

export const getAllMembers = async (req, res) => {
  const memberIds = req.body.member;
    // console.log(memberIds)
  if (!Array.isArray(memberIds) || memberIds.length === 0) {
    return res.status(400).json({
      status: "failed",
      message: "No member IDs provided",
    });
  }

  try {
    const MemberDetails = await User.find({ _id: { $in: memberIds } }).select("-password");

    if (MemberDetails.length > 0) {
      return res.status(200).json({
        status: "success",
        message: "Members found",
        MemberDetails,
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "No valid members found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};

export const joinCommunity = async(req,res)=>{
    const {communityID,AccessToken} = req.body;

    if(!communityID || !AccessToken){
        return res.status(400).json({
            status:"failed",
            message:"Invalid Fields"
        })
    }

    try {
        const DecodedToken = await compare(AccessToken,process.env.JWT_SECRET);
        if(!DecodedToken){
            throw new error("Invalid AccessToken")
        }

        const community = await Community.findById(communityID);
        if (community.members.includes(DecodedToken.id)) {
  return res.status(400).json({
    status: "failed",
    message: "Already a member",
  });
}
        community.members.push(DecodedToken.id)
        await community.save();

        return res.status(200).json({
            status:"Success",
            message:"Member Added to community"
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:error
        })
    }
}

export const searchcommunity = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "failed",
      message: "Can't find a Community",
    });
  }

  try {
    const SearchResult = await Community.find({
  name: { $regex: name, $options: "i" }
});

    if (SearchResult.length > 0) {
      return res.status(200).json({
        status: "Success",
        message: "Found a community",
        name: name.toLowerCase(),
        result: SearchResult,
      });
    } else {
      throw new Error("Can't find a community");
    }
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Can't find a community",
      error: error.message,
    });
  }
};

export const RemoveMember = async(req,res)=>{
    const {memberId,AccessToken,CommunityId}=req.query;

    if(!memberId || !AccessToken || !CommunityId){
        return res.status(400).json({
            status:"failed",
            message:"Missing Fields"
        })
    }

    try {
        const decodedToken = await compare(AccessToken,process.env.JWT_SECRET)
        if(!decodedToken){
            throw new error("unauthorized Access: Invalid Token")
        }
        let isAdmin = false
        const community = await Community.findById(CommunityId)
        community.admin.map((admin)=>{
            if(admin==decodedToken.id){
                isAdmin=true
            }
        })

        if(!isAdmin){
            throw new error("unauthorized Access:Not a Admin")
        }

        community.members.map((member,index)=>{
            if(member==memberId){
                community.members.splice(index,1);
            }
        })
        community.save();

        return res.status(200).json({
            status:"Success",
            message:"member removed successfully",
            community
        })


    } catch (error) {
        return res.status(500).json({
            statuss:"failed",
            message:"Can't remove the member"
        })
    }
}