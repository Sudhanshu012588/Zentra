import React, { useState, useEffect } from 'react';
import { Send, Heart, MessageSquare } from 'lucide-react';
import { useStore } from '../../store/Store';
import axios from 'axios';
import toast from 'react-hot-toast';

function Nudges() {
  const [nudgeBodyInput, setNudgeBodyInput] = useState({
    id: '',
    title: '',
    body: '',
    likes: 0,
    comments: [],
    creatorid: '',
  });
  const user = useStore((state) => state.User);
  const [postedNudge, setPostedNudge] = useState([]);
  
  // State to track which nudge's comments are open
  const [openComments, setOpenComments] = useState(null);

  // State for comment input keyed by nudge id
  const [commentInput, setCommentInput] = useState({});

  const handleDelete = async (id) => {
    try {
      const deleteResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/delete`,
        { id }
      );
      if (deleteResponse.data.status === 'success') {
        setPostedNudge((prev) => prev.filter((nudge) => nudge._id !== id));
        toast.success('Nudge Deleted Successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete nudge');
    }
  };

  const like = async (id) => {

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/like`,
        {
          id,
          userId: user.email,
        }
      );

      const { status, message, likes } = response.data;

      if (message === 'You already liked this nudge') {
        toast(message);
        return;
      }

      if (status === 'success') {
        setPostedNudge((prev) =>
          prev.map((nudge) => (nudge._id === id ? { ...nudge, likes } : nudge))
        );
        toast.success('Nudge liked!');
      } else {
        toast.error(message || 'Something went wrong');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to like the nudge';
      toast.error(errMsg);
    }
  };

  const handlePost = async () => {
    if (nudgeBodyInput.title.trim() && nudgeBodyInput.body.trim()) {
      console.log(user.profilephoto)
      const newNudge = {
        ...nudgeBodyInput,
        id: user._id,
        likes: 0,
        comments: [],
        creatorid: user.email,
        creatorname:user.name,
        profilephoto:user.profilephoto
      };
      try {
        const nuderesponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/createNudge`,
          newNudge
        );
        setPostedNudge((prev) => [...prev, nuderesponse.data.nudge]);
        setNudgeBodyInput({ id: '', title: '', body: '', likes: 0, comments: [], creatorid: '' });
      } catch (error) {
        console.error('Failed to post nudge:', error.response?.data || error.message);
      }
    } else {
      toast.error('Title or Body is missing');
    }
  };

  // Adding comment to a nudge
  const addComment = async (nudgeId) => {
    const author = user.name || 'Anonymous';
    const text = commentInput[nudgeId]?.trim();
    console.log(text)
    if (!text) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/reply`,
        {
          author,
          text,
          nudgeId:nudgeId
        }
      );
      console.log(response.data)
      if (response.data.status === 'success') {
        // Update comments locally
        setPostedNudge((prev) =>
          prev.map((nudge) =>
            nudge._id === nudgeId ? { ...nudge, comments: response.data.comments } : nudge
          )
        );
        // Clear input for this nudge
        setCommentInput((prev) => ({ ...prev, [nudgeId]: '' }));
        toast.success('Comment added successfully');
      } else {
        toast.error('Failed to add comment');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  };

  useEffect(() => {
    if (!user.email) return; // wait for user email to be available

    const getNudges = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/fetchNudge`, {
          id: user.email,
        });
        setPostedNudge(response.data.nudges  || []);
      } catch (err) {
        console.error('Failed to fetch nudges', err);
      }
    };
    getNudges();
  }, [user.email]);

  
  return (
    <div className="max-w-4xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mt-6">
      <div className="bg-gray-800 rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-white mb-6 text-center">Create a Nudge</h1>

        {/* Title Input */}
        <div className="mb-6">
          <label htmlFor="nudge-input-title" className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <textarea
            id="nudge-input-title"
            placeholder="Title"
            value={nudgeBodyInput.title}
            onChange={(e) => setNudgeBodyInput((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full p-3 rounded-xl bg-[#2b2d33] text-white border border-[#3b3e46] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[60px] max-h-[100px] resize-y"
            style={{ caretColor: '#2563eb' }}
          ></textarea>
        </div>

        {/* Body Input */}
        <div className="mb-6">
          <label htmlFor="nudge-input-body" className="block text-sm font-medium text-gray-300 mb-2">
            What's on your mind?
          </label>
          <textarea
            id="nudge-input-body"
            placeholder="Write your nudge here..."
            value={nudgeBodyInput.body}
            onChange={(e) => setNudgeBodyInput((prev) => ({ ...prev, body: e.target.value }))}
            className="w-full p-3 rounded-xl bg-[#2b2d33] text-white border border-[#3b3e46] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[100px] max-h-[200px] resize-y"
            style={{ caretColor: '#2563eb' }}
          ></textarea>
        </div>

        {/* Post Button */}
        <div className="pb-4">
          <button
            onClick={handlePost}
            className="w-full bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition font-medium shadow-md flex items-center justify-center gap-2 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send className="w-5 h-5" />
            Post Nudge
          </button>
        </div>

        {/* Posted Nudges */}
        {postedNudge.length > 0 && (
          <div className="mt-10 space-y-6">
            <h2 className="text-lg font-semibold text-blue-200 mb-4">Your Nudges:</h2>

            {postedNudge.map((nudge) => (
              <div
                key={nudge._id}
                className="p-5 bg-blue-900 border-l-4 border-blue-600 rounded-lg shadow-inner space-y-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profilePhoto || '/default-avatar.png'}
                      alt="Your Avatar"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-400 dark:ring-blue-600"
                    />
                    <p className="text-gray-100 font-semibold">{nudge.author || user.email}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(nudge._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg text-sm transition"
                  >
                    Delete
                  </button>
                </div>

                <div>
                  <p className="text-white font-bold">{nudge.title}</p>
                  <p className="text-gray-200 whitespace-pre-wrap">{nudge.body}</p>
                </div>

                <div className="flex gap-6 text-sm text-gray-400 pt-2">
                  <span className="flex items-center gap-1">
                    <button onClick={() => like(nudge._id)} className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" /> {nudge.likes} Likes
                    </button>
                  </span>
                  <span
                    className="flex items-center gap-1 cursor-pointer select-none"
                    onClick={() =>
                      setOpenComments((prev) => (prev === nudge._id ? null : nudge._id))
                    }
                  >
                    <MessageSquare className="w-4 h-4 text-blue-400" /> {nudge.comments.length} Replies
                  </span>
                </div>

                {/* Comments Section */}
                {openComments === nudge._id && (
                  <div className="mt-4 border-t border-gray-700 pt-4">
                    {nudge.comments.length === 0 ? (
                      <p className="text-gray-400 italic">No comments yet.</p>
                    ) : (
                      <ul className="space-y-3 max-h-60 overflow-y-auto">
                        {nudge.comments.map((comment, index) => (
                          <li key={index} className="bg-gray-800 p-3 rounded-md text-gray-300">
                            <p className="text-sm font-semibold">{comment.author}</p>
                            <p className="text-sm">{comment.text}</p>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Add Comment Input */}
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentInput[nudge._id] || ''}
                        onChange={(e) =>
                          setCommentInput((prev) => ({ ...prev, [nudge._id]: e.target.value }))
                        }
                        className="flex-grow px-3 py-2 rounded-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => addComment(nudge._id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Nudges;
