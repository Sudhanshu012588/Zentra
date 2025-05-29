import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, Heart, Send, Bot, X } from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import { useStore } from "../../store/Store";

export default function NudgesPreview() {
  const user = useStore((state) => state.User);
  const [postedNudges, setPostedNudges] = useState([]);
  const [openComments, setOpenComments] = useState(null);
  const [commentInput, setCommentInput] = useState({});
  const [showChatBot, setShowChatBot] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchNudges = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/getallnudges`
        );
        setPostedNudges(res.data.nudges);
      } catch (err) {
        toast.error("Failed to load nudges.");
      }
    };
    fetchNudges();
  }, []);

  const handleLike = async (nudgeId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/like`,
        { id: nudgeId, userId: user.email }
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
      toast.error("Failed to like nudge");
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
      toast.error("Failed to add comment");
    }
  };

  const handleChatSend = async () => {
  const input = chatInput.trim();
  if (!input) return;

  const newinput = input + " My creator id you need is this -> " + user.id;

  // Append user message first
  setChatMessages((prev) => [...prev, { sender: "user", text: input }]);
  setChatInput("");

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}Nudge/zenith`,
      { prompt: newinput }
    );
    const replyText = response.data.data.text || "Zenith is thinking...";

    // Append Zenith's reply
    setChatMessages((prev) => [...prev, { sender: "zenith", text: replyText }]);
  } catch (error) {
    setChatMessages((prev) => [
      ...prev,
      { sender: "zenith", text: "Sorry, something went wrong." },
    ]);
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
                  className="bg-zinc-900 p-6 rounded-2xl shadow-xl border border-zinc-800 hover:border-blue-600 transition-all"
                >
                  {/* Nudge Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={nudge.profilephoto}
                      alt="Avatar"
                      className="w-14 h-14 rounded-full ring-2 ring-blue-500 object-cover border-2 border-blue-500"
                    />
                    <div>
                      <p className="text-white font-semibold text-lg">
                        {nudge.author || "Unknown"}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {new Date(nudge.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Nudge Content */}
                  <div className="space-y-3 mb-5">
                    <h2 className="text-2xl font-bold text-white">
                      {nudge.title}
                    </h2>
                    <p className="text-zinc-300 whitespace-pre-wrap">
                      {nudge.body}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-8 text-sm text-zinc-400 pt-3 border-t border-zinc-800">
                    <button
                      onClick={() => handleLike(nudge._id)}
                      className="flex items-center gap-2 hover:text-red-500"
                    >
                      <Heart className="w-5 h-5" />
                      {nudge.likes} Likes
                    </button>
                    <button
                      onClick={() =>
                        setOpenComments((prev) =>
                          prev === nudge._id ? null : nudge._id
                        )
                      }
                      className="flex items-center gap-2 hover:text-blue-500"
                    >
                      <MessageSquare className="w-5 h-5" />
                      {nudge.comments?.length || 0} Replies
                    </button>
                  </div>

                  {/* Comments Section */}
                  {openComments === nudge._id && (
                    <div className="mt-6 border-t border-zinc-700 pt-4 space-y-4">
                      <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                        {nudge.comments?.length ? (
                          nudge.comments.map((comment, idx) => (
                            <div
                              key={idx}
                              className="bg-zinc-800 p-3 rounded-xl text-sm"
                            >
                              <p className="font-bold text-blue-400">
                                {comment.author}
                              </p>
                              <p className="text-zinc-300">{comment.text}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-zinc-500 italic text-center py-4">
                            Be the first to comment!
                          </p>
                        )}
                      </div>

                      {/* Comment Input */}
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Add your thoughts..."
                          value={commentInput[nudge._id] || ""}
                          onChange={(e) =>
                            setCommentInput((prev) => ({
                              ...prev,
                              [nudge._id]: e.target.value,
                            }))
                          }
                          className="flex-grow bg-zinc-800 border border-zinc-600 px-4 py-2.5 rounded-xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-600"
                        />
                        <button
                          onClick={() => handleAddComment(nudge._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96">
              <p className="text-zinc-500 text-xl font-medium">
                No nudges found. Be the first to share!
              </p>
              <p className="text-zinc-600 mt-2">
                Come back later or share your own thoughts.
              </p>
            </div>
          )}
        </div>

        {/* Chatbot Button */}
        <button
          onClick={() => setShowChatBot(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-4 rounded-full shadow-lg flex items-center gap-2 animate-pulse-once z-50"
        >
          <Bot className="w-5 h-5" />
          Chat with Zenith
        </button>

        {/* Chatbot Panel */}
       {showChatBot && (
  <div className="fixed bottom-28 right-4 w-[90%] max-w-md md:max-w-lg lg:max-w-xl h-[70vh] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
    <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Bot className="w-5 h-5" />
        Chat with Zenith
      </div>
      <button onClick={() => setShowChatBot(false)}>
        <X className="w-5 h-5 text-white" />
      </button>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm custom-scrollbar">
      {chatMessages.length === 0 ? (
        <p className="text-zinc-400 italic text-center py-4">
          Hello! How can Zenith help you today?
        </p>
      ) : (
        chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-lg max-w-[85%] ${
              msg.sender === "user"
                ? "bg-blue-600 text-white ml-auto rounded-br-none"
                : "bg-zinc-700 text-zinc-100 rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        ))
      )}
    </div>
    <div className="flex items-center border-t border-zinc-700 p-3 gap-2">
      <input
        type="text"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        placeholder="Type your message to Zenith..."
        className="flex-grow bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-600 focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleChatSend}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  </div>
)}

      </div>
    </>
  );
}
