import { User } from "../Models/UserModel.js";


export const uploadProfileImage = async (req, res) => {
  const { id, profilePhoto } = req.body;
    
  if (!id || !profilePhoto) {
    return res.status(400).json({ status: "Error", message: "Missing required fields" });
  }

  try {

    // Use { new: true } option to return the updated document
    const updatedUser = await User.findByIdAndUpdate(
      id, // you can pass id directly
      { profilephoto: profilePhoto },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: "Error", message: "User not found" });
    }

    res.status(200).json({ status: "Success", user: updatedUser });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      status: "Error",
      message: "Could not update profile photo",
    });
  }
};


export const uploadCoverImage = async (req, res) => {
  const { id, coverImage } = req.body;

   if (!id || !coverImage) {
    return res.status(400).json({ status: "Error", message: "Missing required fields" });
  }

  try {

    // Use { new: true } option to return the updated document
    const updatedUser = await User.findByIdAndUpdate(
      id, // you can pass id directly
      { coverimage: coverImage },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: "Error", message: "User not found" });
    }

    res.status(200).json({ status: "Success", user: updatedUser });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      status: "Error",
      message: "Could not update profile photo",
    });
  }
};


