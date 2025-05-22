import {User} from "../Models/UserModel.js"; // Assuming Mongoose
import {compare} from "../utility/JWTT.js"

export const TokenVerify = async(req,res,next)=>{
  console.log("HEY")
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    try {
        const decodedToken = await compare(token,process.env.JWT_SECRET)
        
        req.user = decodedToken

        next();
    } catch (error) {
        return res.status(400).json({
            status:'failed',
            message:error
        })
    }
}


export const verifyRefreshToken = async (req, res, next) => {
  const RefreshToken = req.headers.authorization?.split(' ')[1];

  if (!RefreshToken) {
    return res.status(401).json({
      status: "fail",
      message: "No Refresh Token provided",
    });
  }

  try {
    const decodedToken = await compare(RefreshToken, process.env.JWT_SECRET);

    if (!decodedToken || !decodedToken.email) {
      return res.status(403).json({
        status: "fail",
        message: "Invalid token payload",
      });
    }

    // ✅ Fetch user from DB using decoded email
    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Attach user data to request object
    req.user = user;
    next();

  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "Token verification failed",
      error: error.message,
    });
  }
};
