import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, Heart, Send } from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import { useStore } from "../../store/Store";

export default function NudgesPreview() {
  const user = useStore((state) => state.User);
  const [postedNudges, setPostedNudges] = useState([]);
  const [openComments, setOpenComments] = useState(null);
  const [commentInput, setCommentInput] = useState({});

  useEffect(() => {
    const fetchNudges = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/getallnudges`
        );
        setPostedNudges(res.data.nudges);
      } catch (err) {
        console.error("Failed to fetch nudges", err);
      }
    };
    fetchNudges();
  }, []);

  const handleLike = async (nudgeId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/like`,
        {
          id: nudgeId,
          userId: user.email,
        }
      );

      const { status, message, likes } = res.data;

      if (message === "You already liked this nudge") {
        toast("You already liked this nudge");
        return;
      }

      if (status === "success") {
        setPostedNudges((prev) =>
          prev.map((nudge) =>
            nudge._id === nudgeId ? { ...nudge, likes } : nudge
          )
        );
        toast.success("Nudge liked!");
      } else {
        toast.error(message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to like nudge");
    }
  };

  const handleAddComment = async (nudgeId) => {
    const text = commentInput[nudgeId]?.trim();
    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/reply`,
        {
          nudgeId,
          author: user.name || "Anonymous",
          text,
        }
      );

      if (res.data.status === "success") {
        setPostedNudges((prev) =>
          prev.map((nudge) =>
            nudge._id === nudgeId
              ? { ...nudge, comments: res.data.comments }
              : nudge
          )
        );
        setCommentInput((prev) => ({ ...prev, [nudgeId]: "" }));
        toast.success("Comment added successfully");
      } else {
        toast.error("Failed to add comment");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  return (
   <>
  <Navbar />
  <div className="pt-16 min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-white">
    <div className="max-w-4xl mx-auto px-4 py-8">
      {postedNudges.length > 0 ? (
        <div className="space-y-6">
          {postedNudges.map((nudge) => (
            <div
              key={nudge._id}
              className="bg-zinc-900 rounded-2xl p-6 shadow-md border border-zinc-800 transition hover:shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={nudge.profilephoto}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full ring-2 ring-blue-500 object-cover"
                />
                <div>
                  <p className="text-white font-medium">
                    {nudge.author || "Unknown"}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {nudge.createdAt?.slice(0, 10)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xl font-semibold text-white">{nudge.title}</p>
                <p className="text-zinc-300 whitespace-pre-wrap">{nudge.body}</p>
              </div>

              <div className="flex gap-6 text-sm text-zinc-400 pt-2">
                <button
                  onClick={() => handleLike(nudge._id)}
                  className="flex items-center gap-2 hover:text-red-400 transition"
                >
                  <Heart className="w-4 h-4" />
                  {nudge.likes} Likes
                </button>
                <button
                  onClick={() =>
                    setOpenComments((prev) =>
                      prev === nudge._id ? null : nudge._id
                    )
                  }
                  className="flex items-center gap-2 hover:text-blue-400 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  {nudge.comments?.length || 0} Replies
                </button>
              </div>

              {openComments === nudge._id && (
                <div className="mt-6 border-t border-zinc-700 pt-4 space-y-3 animate-fade-in">
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {nudge.comments?.length === 0 ? (
                      <p className="text-zinc-500 italic">No comments yet.</p>
                    ) : (
                      nudge.comments.map((comment, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-800 p-3 rounded-lg text-sm text-zinc-200"
                        >
                          <p className="font-semibold">{comment.author}</p>
                          <p>{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInput[nudge._id] || ""}
                      onChange={(e) =>
                        setCommentInput((prev) => ({
                          ...prev,
                          [nudge._id]: e.target.value,
                        }))
                      }
                      className="flex-grow bg-zinc-800 border border-zinc-600 px-4 py-2 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      onClick={() => handleAddComment(nudge._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-zinc-500 text-center">No nudges found.</p>
      )}
    </div>
  </div>
</>

  );
}
