import React, { useEffect, useState, useRef } from 'react';
import { useCommunityStore } from '../../../store/CommunityState';
import { useStore } from '../../../store/Store';
import axios from 'axios';
import toast from 'react-hot-toast';
import socket from '../socket/socket';

function CommunityInterface() {
  const selectedCommunity = useCommunityStore((state) => state.selectedCommunity);
  const User = useStore((state) => state.User);

  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const messageEndRef = useRef(null);
  const sidebarRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch community members and admins
  const fetchMembers = async () => {
    try {
      const [memberRes, adminRes] = await Promise.all([
        axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}community/getmember`, {
          member: selectedCommunity.members,
        }),
        axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}community/getmember`, {
          member: selectedCommunity.admin,
        }),
      ]);
      setMembers(memberRes.data.MemberDetails);
      setAdmins(adminRes.data.MemberDetails);
    } catch {
      toast.error('Failed to load community members.');
    }
  };

  // Join community
  const handleJoin = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}community/join`, {
        communityID: selectedCommunity.id,
        AccessToken: localStorage.getItem('AccessToken'),
      });

      if (res.data.status === 'Success') {
        toast.success('Joined the community!');
        window.location.reload();
      } else {
        toast.error(res.data.message || 'Join failed');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Join failed');
    }
  };

  // Send a message or trigger Zenith
  const handleSend = () => {
    if (!message.trim()) return;

    const msgObj = {
      sender: User.name,
      senderProfile: User.profilePhoto,
      senderName: User.name,
      text: message,
      time: new Date().toISOString(),
      communityId: selectedCommunity.id,
      communityName: selectedCommunity.name,
      communityDescription: selectedCommunity.description,
    };

    if (msgObj.text.toLowerCase().includes('@zenith')) {
      socket.emit('zenith', msgObj);
    } else {
      socket.emit('send-message', msgObj);
    }

    setMessage('');
    scrollToBottom();
  };

  useEffect(() => {
    if (!selectedCommunity.id) return;

    fetchMembers();
    socket.emit('GotConnected', selectedCommunity);

    const handleInitialMessages = (msgs) => {
      setMessages(msgs);
      scrollToBottom();
    };

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('retrive-message', handleInitialMessages);
    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('retrive-message', handleInitialMessages);
      socket.off('new-message', handleNewMessage);
    };
  }, [selectedCommunity.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if user is a member or admin
  useEffect(() => {
    const isAdmin = admins.some((a) => a._id === User.id);
    const isMem = members.some((m) => m._id === User.id);
    setIsMember(isAdmin || isMem);
  }, [admins, members, User.id]);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const filteredMembers = members.filter((m) => !admins.some((a) => a._id === m._id));

  return (
    <div className="flex min-h-screen bg-black text-white relative">
      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-[9vh] bg-blue-800 flex items-center gap-4 px-4 py-3 rounded-b-2xl">
          <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          {selectedCommunity.avatar && (
            <img
              src={selectedCommunity.avatar}
              alt="Community"
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{selectedCommunity.name}</h2>
            <p className="text-sm text-blue-200">{selectedCommunity.description}</p>
          </div>
          {!isMember && (
            <button
              onClick={handleJoin}
              className="ml-auto px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Join
            </button>
          )}
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <div className="overflow-y-auto mt-16 px-4 py-3 pb-32 h-full space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-xs p-3 rounded-lg shadow-md ${
                  msg.sender === User.name ? 'ml-auto bg-gray-800' : 'bg-blue-700'
                }`}
              >
                {msg.senderProfile && (
                  <img src={msg.senderProfile} alt="profile" className="w-8 h-8 rounded-full mb-1" />
                )}
                <p className="text-xs text-gray-300">{msg.sender}</p>
                <p className="text-sm">{msg.message}</p>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {/* Input Bar */}
          {isMember && (
            <div className="fixed  bottom-0 px-4 py-3 bg-black border-t border-gray-700 flex gap-3 w-fit z-50">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 w-[65vw] bg-slate-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 rounded-full text-white font-bold hover:brightness-110"
              >
                ➤
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed md:static top-0 right-0 z-50 bg-blue-900 w-64 h-full px-4 py-5 shadow-lg transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <h3 className="text-lg font-semibold text-center border-b pb-2 mb-4">Members</h3>
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-6rem)]">
          {admins.map((admin, i) => (
            <div key={`admin-${i}`} className="flex gap-3 items-center bg-blue-800 p-2 rounded-lg">
              <img src={admin.profilephoto || '/default-avatar.png'} className="w-10 h-10 rounded-full border" />
              <div>
                <p className="text-sm font-semibold">{admin.name}</p>
                <p className="text-xs text-blue-200">{admin.email}</p>
                <span className="text-xs bg-yellow-400 text-black px-2 rounded-full">Admin</span>
              </div>
            </div>
          ))}
          {filteredMembers.map((member, i) => (
            <div key={`member-${i}`} className="flex gap-3 items-center bg-blue-800 p-2 rounded-lg">
              <img src={member.profilephoto || '/default-avatar.png'} className="w-10 h-10 rounded-full border" />
              <div>
                <p className="text-sm font-semibold">{member.name}</p>
                <p className="text-xs text-blue-200">{member.email}</p>
              </div>
            </div>
          ))}
          {admins.length === 0 && filteredMembers.length === 0 && (
            <p className="text-sm text-center text-blue-300">No members found.</p>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default CommunityInterface;
