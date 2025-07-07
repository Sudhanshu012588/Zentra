import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Send } from 'lucide-react';
import { useCommunityStore } from "../../../store/CommunityState";
import toast from 'react-hot-toast';
import axios from 'axios';

function LeftCommunity() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const Action = useCommunityStore((state) => state.Action);
  const setAction = useCommunityStore((state) => state.setAction);
  const setSelectedCommunity = useCommunityStore((state) => state.setSelectedCommunity);
  const selectedCommunity = useCommunityStore((state) => state.selectedCommunity);

  const [Communities, setCommunities] = useState([]);
  const [activeCommunityId, setActiveCommunityId] = useState(null);

  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch all communities on load
  useEffect(() => {
    const fetchAllCommunities = async () => {
      const AccessToken = localStorage.getItem("AccessToken");
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}community/getcommunities`, { AccessToken });
        setCommunities(res.data.communities);
      } catch {
        toast.error("Didn't get any community");
      }
    };

    fetchAllCommunities();
    setAction("CreateCommunity");
    setActiveCommunityId(null);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(input);
    }, 500);
    return () => clearTimeout(handler);
  }, [input]);
  useEffect(() => {
    const searchCommunity = async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}community/search`, { name: search });
        if (res.data.status === "failed" || res.data.result.length === 0) {
          setSearchResults([]);
          toast.error("No Result found");
        } else {
          setSearchResults(res.data.result);
          toast.success("Found a community");
        }
      } catch {
        setSearchResults([]);
        toast.error("Search failed");
      }
    };

    searchCommunity();
  }, [search]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle community select
  const handleSelectCommunity = (community) => {
    setAction("getCommunity");
    setActiveCommunityId(community._id);
    setSelectedCommunity({
      id: community._id,
      name: community.name,
      avatar: community.avatar,
      description: community.description,
      members: community.members,
      admin: community.admin,
    });
  };

  return (
    <>
      {/* Top bar for mobile */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white p-4">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed md:static top-0 left-0 z-40 min-h-screen w-64 bg-gray-800 text-white p-4 space-y-4
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        <h2 className="text-xl font-semibold mb-4 hidden md:block">Communities</h2>

        {/* Search bar */}
        <div className="flex">
          <input
            className="w-full bg-gray-700 rounded-l-2xl p-2"
            placeholder="🔍 Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="button"
            className="p-2 bg-gray-700 rounded-r-2xl hover:border-2 cursor-pointer"
          >
            <Send />
          </button>
        </div>

        {/* Create community */}
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

        {/* Searched communities */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map((community) => (
              <div
                key={community._id}
                onClick={() => handleSelectCommunity(community)}
                className={`flex items-center gap-4 px-4 py-3 rounded-md cursor-pointer transition-shadow shadow-sm
                  ${activeCommunityId === community._id ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                <img
                  src={community.avatar || "/default-avatar.png"}
                  alt={community.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold">{community.name}</h2>
                  <p className="text-sm text-gray-300">{community.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Default community list (only if no search result) */}
        {Communities.length > 0 && searchResults.length === 0 && (
          <div className="space-y-3">
            {Communities.map((community) => (
              <div
                key={community._id}
                onClick={() => handleSelectCommunity(community)}
                className={`flex items-center gap-4 px-4 py-3 rounded-md cursor-pointer transition-shadow shadow-sm
                  ${activeCommunityId === community._id ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                <img
                  src={community.avatar || "/default-avatar.png"}
                  alt={community.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
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
