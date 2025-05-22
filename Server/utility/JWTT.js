import jwt from "jsonwebtoken"

export const createToken = (payload,expiry)=>{
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:expiry})
    return token
}

export const compare = async(token,secret)=>{
    try{
        const decodedToken =  jwt.verify(token,secret);
        return decodedToken
    }
    catch(error){
        throw new error
    }
}