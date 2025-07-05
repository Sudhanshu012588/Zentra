import React, { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useCommunityStore } from "../../../store/CommunityState";
import toast from 'react-hot-toast';
import axios from 'axios';
import socket from '../socket/socket';

function LeftCommunity() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const Action = useCommunityStore((state) => state.Action);
  const setAction = useCommunityStore((state) => state.setAction);
  const communitySelect = useCommunityStore((state) => state.setSelectedCommunity);
  const selectedCommunity = useCommunityStore((state)=>state.selectedCommunity)
  const [Communities, setCommunities] = useState([]);
  const [activeCommunityId, setActiveCommunityId] = useState(null);

  const fetchAllCommunities = async () => {
    const AccessToken = localStorage.getItem("AccessToken");
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}community/getcommunities`, { AccessToken });
      setCommunities(res.data.communities);
    } catch (error) {
      toast.error("Didn't get any community");
    }
  };

  useEffect(() => {
    fetchAllCommunities();

    // Select "Create Community" by default
    setAction("CreateCommunity");
    setActiveCommunityId(null);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white p-4">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed md:static top-0 left-0 z-40
          
          min-h-screen w-64 bg-gray-800 text-white p-4 space-y-4
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        <h2 className="text-xl font-semibold mb-4 hidden md:block">Communities</h2>

        {/* Create Community Button */}
        <button
          className={`w-full py-2 px-4 text-left rounded transition-all
            ${Action === "CreateCommunity" ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"}`}
          onClick={() => {
            setAction("CreateCommunity");
            setActiveCommunityId(null);
          }}
        >
          + Create Community
        </button>

        {/* List of Communities */}
        {Communities.length > 0 && (
          <div className="space-y-3">
            {Communities.map((community) => (
              <div
                key={community._id}
                onClick={() => {
                  setAction("getCommunity");
                  setActiveCommunityId(community._id);
                  communitySelect({
                    id: community._id,
                    name: community.name,
                    avatar: community.avatar,
                    description: community.description,
                    members: community.members,
                    admin: community.admin
                  })
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-md cursor-pointer transition-shadow shadow-sm
                  ${activeCommunityId === community._id ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                <img
                  src={community.avatar || "/default-avatar.png"}
                  alt={community.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-left">
                  <h2 className="font-semibold">{community.name}</h2>
                  <p className="text-sm text-gray-300">{community.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default LeftCommunity;
