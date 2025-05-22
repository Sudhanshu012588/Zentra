import bcrypt from "bcrypt"

export const hashFunction = async(context)=>{
    const salt = 5;
    try {
        const hashedcontext = await bcrypt.hash(context,salt);
        return hashedcontext;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

export const bcryptverify = async(a,b)=>{
    const verification  = await bcrypt.compare(a,b);
    return verification;
}