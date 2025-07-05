import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function CreateCommunity() {


  const [Avatar,setAvatar] = useState("");
  const [communityData,setCommunityData] = useState({
    name:"",
    Description:""
  })
 const handleupload = async (e) => {
  console.log(e);
  const Avatarfile = new FormData();
  Avatarfile.append("file", e.target.files[0]);
  Avatarfile.append("upload_preset", "preset");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dw1d3qwbh/image/upload",
      Avatarfile
    );

    console.log(res.data.secure_url);

    if (res.data.secure_url) {
      setAvatar(res.data.secure_url);
    } else {
      toast.error("Can't upload avatar");
    }
  } catch (error) {
    toast.error("Something went wrong");
    console.error(error.response?.data || error);
  }
};

  
  const generateCommunity = async()=>{
    
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}community/create`,{
        name:communityData.name,
        description:communityData.Description,
        AccessToken:localStorage.getItem("AccessToken"),
        avatar:Avatar
      }).then((res)=>{
        if(res.data.status=='Success'){
          toast.success(name,'Community created')
        }
      })
    } catch (error) {
      toast.error("Can't create community",error);
      console.log(error)
    }
    
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-white p-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 space-y-8">
        <h1 className="text-3xl font-bigshoulders text-center">
          Create a New Community
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <img
            src={Avatar||`/meeting.png`}
            alt="Community Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
          <input
            id="Community-avatar"
            type="file"
            className="hidden"
            onChange={(e)=>handleupload(e)}
          />
          <label
            htmlFor="Community-avatar"
            className="cursor-pointer 
bg-gradient-to-b from-green-500 to-green-800 
px-6 py-2 
rounded-2xl 
text-white 
font-semibold 
hover:bg-gradient-to-b hover:from-green-800 hover:to-green-500 
transition
"
          >
            Upload Avatar
          </label>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="community-name" className="block text-sm font-medium mb-1">
              Community Name
            </label>
            <input
              id="community-name"
              type="text"
              onChange={(e)=>{
                setCommunityData({
                  name:e.target.value
                })
              }}
              placeholder="e.g. Space Enthusiasts"
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="community-desc" className="block text-sm font-medium mb-1">
              Description <span className="text-xs text-gray-500">(optional)</span>
            </label>
            <textarea
              id="community-desc"
              rows="4"
              onChange={(e)=>{
                setCommunityData((prev)=>({
                  ...prev,
                  Description:e.target.value
                }))
              }}
              placeholder="Describe what your community is about..."
              className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button className=" cursor-pointer w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
        onClick={generateCommunity}
        >
          Create Community
        </button>
      </div>
    </div>
  );
}

export default CreateCommunity;
