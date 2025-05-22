import {User} from "../Models/UserModel.js"
import {hashFunction,bcryptverify} from "../utility/hash.js"
import express from "express"
import { createToken } from "../utility/JWTT.js";
import {compare} from "../utility/JWTT.js"
export const signup = async(req,res)=>{
    const {name,email,password}= req.body;
    const finduser = await User.findOne({email})
    
    if(!name || !email || !password){
        return res.status(400).json({
            status:"fail",
            message:"Please provide all the fields"
        })
    }
    else if(finduser){
        return res.status(409).json({
            status:"failed",
            message:"Email Id Already Registered"
        })
    }
    else{
        try {
            const hashedPassword = await hashFunction(password);
            const user = await  User.create({
                name:name,
                email:email,
                password:hashedPassword
            })
            const refreshToken = createToken({
                id:user._id,
                name:name,
                email:email,
            },process.env.REFRESH_TOKEN_EXPIRES_IN)
            const accessToken = createToken({
                id:user._id,
                email:email,
                name:name
            },process.env.ACCESS_TOKEN_EXPIRES_IN)



            res.status(200).json({
                status:'success',
                message:"Registration Successfull",
                AccessToken:accessToken,
                RefreshToken:refreshToken,
                user
            })
        } catch (error) {
            // console.log("Unable to save user",error)
            res.status(500).json({
                status: "error",
                message: error.message,
      }        );
            throw(error)
        }
    }

}

export const login = async(req,res)=>{
    const{email,password}=req.body
    if(!email||!password){
        res.status(400).json({
            status:"failed",
            message:"Please fill all the Fields"
        })
    }
    const findUser = await User.findOne({email}).select('+password');
    if(!findUser){
        res.status(400).json({
            status:"fail",
            message:"User with the given email not found"
        })
    }else{
        // console.log("hashedPass",password,"-","findedpassword",findUser.password)
        const verification = await bcryptverify(password,findUser.password)
        if(verification){
            const token = createToken({
                id:findUser._id,
                email:findUser.email,
                password:password
            },process.env.ACCESS_TOKEN_EXPIRES_IN)
            res.status(200).json({
                status:'sucess',
                message:"Logged in sucessfully",
                user:findUser,
                accesstoken:token
            })
        }
        else{
            res.status(400).json({
                status:"failed",
                message:"Incorrect Credentails"
            })
        }
    }
}

export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No authorization header" });
    
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    
    const verify = await compare(token, process.env.JWT_SECRET);
    if (!verify) return res.status(401).json({ message: "Invalid token" });
    
    const id = verify.id;
    const user = await User.findOne({ _id: id });
    // console.log(user)
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // console.log(user.name);

    return res.status(200).json({
      status: "Verified",
      message: "User is Verified",
      user:user
    });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
};


export const veriifyRefreshToken = async(req,res)=>{
    if(req.user){
        const AccessToken = createToken({
            name:req.user.name,
            email:req.user.email,
            id:req.user.id
        },process.env.ACCESS_TOKEN_EXPIRES_IN)
        res.status(200).json({
            status:'success',
            message:"AccessToken Generated successfuly",
            AccessToken:AccessToken
        })
    }
    else{
        res.status(300).json({
            status:"fail",
            message:"failed creating AccessToken"
        })
    }
}