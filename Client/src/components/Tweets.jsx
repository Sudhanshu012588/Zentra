import React, { useState, useEffect } from 'react';
import { Send, Heart, MessageSquare } from 'lucide-react';
import { useStore } from '../../store/Store';
import axios from 'axios';

function Nudges() {
  const [nudgeBodyInput, setNudgeBodyInput] = useState({
    title: '',
    body: '',
    likes: 0,
    comments: [],
    creatorid: '',
  });
  const user = useStore((state) => state.User);
  const [postedNudge, setPostedNudge] = useState([]);

  const handlePost = async () => {
    if (nudgeBodyInput.title.trim() && nudgeBodyInput.body.trim()) {
      const newNudge = {
        ...nudgeBodyInput,
        likes: 0,
        comments: [],
        creatorid: user.email,
      };
      try {
        const nuderesponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/createNudge`,
          newNudge
        );
        console.log('Nudge created:', nuderesponse.data);

        setPostedNudge((prev) => [...prev, nuderesponse.data.nudge]);
        setNudgeBodyInput({ title: '', body: '', likes: 0, comments: [], creatorid: '' });
      } catch (error) {
        console.error('Failed to post nudge:', error.response?.data || error.message);
      }
    } else {
      console.warn('Title or Body is missing');
    }
  };

  useEffect(() => {
    if (!user.email) return; // wait for user email to be available

    const getNudges = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/fetchNudge`, {
          id: user.email,
        });
        // assuming response.data.nudges is an array of nudges with creatorPhoto field
        setPostedNudge(response.data.nudges || []);
      } catch (err) {
        console.error('Failed to fetch nudges', err);
      }
    };
    console.log(user.profilePhoto)
    getNudges();
  }, [user.email]);

  return (
    <div className="max-w-4xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mt-3">
      <div className="max-w-4xl w-full mx-auto bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <h1 className="text-3xl font-extrabold text-white mb-6 text-center pt-8">Create a Nudge</h1>
        
        <div className="mb-6 px-8">
          <label htmlFor="nudge-input-title" className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <textarea
            id="nudge-input-title"
            placeholder="Title"
            value={nudgeBodyInput.title}
            onChange={(e) =>
              setNudgeBodyInput((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full p-3 rounded-xl bg-[#2b2d33] text-white border border-[#3b3e46] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[60px] max-h-[100px] overflow-y-auto resize-y"
            style={{ caretColor: '#2563eb' }}
          ></textarea>

          <label htmlFor="nudge-input-body" className="block text-sm font-medium text-gray-300 mt-4 mb-2">
            What's on your mind?
          </label>
          <textarea
            id="nudge-input-body"
            placeholder="Write your nudge here..."
            value={nudgeBodyInput.body}
            onChange={(e) =>
              setNudgeBodyInput((prev) => ({ ...prev, body: e.target.value }))
            }
            className="w-full p-3 rounded-xl bg-[#2b2d33] text-white border border-[#3b3e46] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[100px] max-h-[200px] overflow-y-auto resize-y"
            style={{ caretColor: '#2563eb' }}
          ></textarea>
        </div>

        <div className="px-8 pb-8">
          <button
            onClick={handlePost}
            className="w-full bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition font-medium shadow-md flex items-center justify-center gap-2 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send className="w-5 h-5" />
            Post Nudge
          </button>
        </div>
        

        {postedNudge.length > 0 && (
          <div className="mt-8 space-y-6 px-8 mb-8">
            <h2 className="text-lg font-semibold text-blue-200 mb-4">Your Nudges:</h2>
            {postedNudge.map((nudge, index) => (
              <div
                key={index}
                className="p-5 bg-blue-900 border-l-4 border-blue-600 rounded-lg shadow-inner"
              >
                <div className="flex items-center gap-3 mb-3"> {/* Flex container for avatar and name */}
                  <img
  src={user.profilePhoto || '/default-avatar.png'}
  alt="Your Avatar"
  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-400 dark:ring-blue-600"
/>

                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{nudge.creatorName}</p>
                </div>
                <p className="text-gray-200 font-bold mb-1">{nudge.title}</p>
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap mb-3">{nudge.body}</p>
                <div className="flex justify-start items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" /> {nudge.likes} Likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-blue-500" /> {nudge.comments.length} Replies
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Nudges;
