import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "../../store/Store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Camera, Edit } from "lucide-react"; // Importing icons for better UI
import Navbar from "../components/Navbar";
import Tweets from "../components/Tweets"
export default function Dashboard() {
  const user = useStore((state) => state.User);
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();
  const [profileImageFile, setProfileImageFile] = useState(null); // Renamed for clarity
  const [coverImageFile, setCoverImageFile] = useState(null); // New state for cover image upload
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null); // State for image preview
  const [coverImagePreview, setCoverImagePreview] = useState(null); // State for cover image preview


  const fetchUser = async (AccessToken) => {
    if (!user.isLoggedIn) {
      try {
        const verifyResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}user/verify`,
          {}, // No headers object inside the data payload for a POST request
          {
            headers: { Authorization: `Bearer ${AccessToken}` },
          }
        );

        if (verifyResponse.data.status === "Verified") {
          const userData = verifyResponse.data.user;
          setUser({
            id: userData._id,
            name: userData.name,
            email: userData.email,
            isLoggedIn: true,
            profilePhoto: userData.profilephoto,
            coverImage: userData.coverimage
          });
          // Removed dummy URLs from initial state setting
          setProfilePhotoPreview(userData.profilephoto);
          setCoverImagePreview(userData.coverimage);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        navigate("/login");
      }
    } else {
        const verifyResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}user/verify`,
          {}, // No headers object inside the data payload for a POST request
          {
            headers: { Authorization: `Bearer ${AccessToken}` },
          }
        );

        if (verifyResponse.data.status === "Verified") {
          const userData = verifyResponse.data.user;
          setUser({
            id: userData._id,
            name: userData.name,
            email: userData.email,
            isLoggedIn: true,
            profilePhoto: userData.profilephoto,
            coverImage: userData.coverimage
          });}
    }
  };

  useEffect(() => {
    const AccessToken = localStorage.getItem("AccessToken");
    if (AccessToken) {
      fetchUser(AccessToken);
    } else {
      navigate("/login");
    }
    
  }, []);
  // useEffect(() => {
  //   console.log(user)
  // }, [user])
  
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfilePhotoPreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "preset"); // Ensure this preset is configured in Cloudinary

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dzczys4gk/image/upload`, // Replace with your Cloudinary cloud name
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Cloudinary upload failed: " + data.error.message);
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleProfileUpload = async () => {
    if (!profileImageFile) {
      toast.success("Please select a profile image first.");
      return;
    }

    setUploadingProfile(true);
    try {
      const imageUrl = await uploadImageToCloudinary(profileImageFile);
      const payload = {
        id: user.id,
        profilePhoto: imageUrl,
      };
      await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}user/upload/profile`, payload);
      setUser({ ...user, profilePhoto: imageUrl }); // Update the global store with the new photo
      toast.success("Profile image updated successfully!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.success("Failed to update profile image.");
    } finally {
      setUploadingProfile(false);
      setProfileImageFile(null); // Clear the selected file
    }
  };

  const handleCoverUpload = async () => {
    if (!coverImageFile) {
      toast.success("Please select a cover image first.");
      return;
    }

    setUploadingCover(true);
    try {
      const imageUrl = await uploadImageToCloudinary(coverImageFile);
      const payload = {
        id: user.id,
        coverImage: imageUrl,
      };

      // console.log(payload)
      await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}user/upload/cover`, payload); // Assuming a similar endpoint for cover photo
      setUser({ ...user, coverImage: imageUrl }); // Update the global store with the new photo
      toast.success("Cover image updated successfully!");
    } catch (error) {
      console.error("Error updating cover image:", error);
      toast.success("Failed to update cover image.");
    } finally {
      setUploadingCover(false);
      setCoverImageFile(null); // Clear the selected file
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-white flex flex-col items-center py-10">
      <div className="max-w-4xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Cover Image Section */}
        <div className="relative h-64 group bg-gray-300 dark:bg-gray-700 overflow-hidden">
          <img
            src={user.coverImage} // Removed dummy URL
            alt="Cover"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Removed the old cover image upload button and its associated input */}
        </div>

        {/* Profile Photo + Info */}
        <div className="relative flex items-end sm:items-center px-8 -mt-16 pb-8 gap-6 flex-col sm:flex-row">
          <div className="relative group">
            <img
              src={user.profilePhoto} // Removed dummy URL
              alt="Profile"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              />
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              disabled={uploadingProfile}
              className="hidden"
              />
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 cursor-pointer opacity-0 group-hover:opacity-100 transition"
              >
              <Camera className="w-4 h-4" />
            </label>

            {profileImageFile && (
              <button
              onClick={handleProfileUpload}
              disabled={uploadingProfile}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600 shadow-md transition"
              >
                {uploadingProfile ? "Uploading..." : "Save Photo"}
              </button>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">{user.name || "Guest User"}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{user.email || "guest@example.com"}</p>
          </div>
        </div>

        {/* About Section - Modified to include new cover upload button */}
        <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold mb-4">About Me</h3>
          <p className="text-gray-700 dark:text-gray-300">
            This is a placeholder for your bio or personal intro. You can extend this section later.
          </p>
          <div className="mt-6 flex flex-wrap gap-4"> {/* Use flex for buttons */}
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow">
              Edit Profile
            </button>

            {/* New Cover Image Upload Button */}
            <input
              id="new-cover-upload" // New ID for the hidden input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              disabled={uploadingCover}
              className="hidden"
              />
            <label
              htmlFor="new-cover-upload"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow cursor-pointer flex items-center gap-2"
              >
              <Camera className="w-5 h-5" />
              Upload Cover Image
            </label>

            {coverImageFile && (
              <button
              onClick={handleCoverUpload}
              disabled={uploadingCover}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow flex items-center gap-2"
              >
                {uploadingCover ? (
                  <>
                    <span className="animate-spin">⚙️</span> Uploading...
                  </>
                ) : (
                  "Save New Cover"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    <Tweets/>
    </div>
            </>
  );}

