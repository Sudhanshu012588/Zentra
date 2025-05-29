import { useState } from 'react';

const ChatWithBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const botMessage = {
        sender: 'bot',
        text: data?.nudge?.body || data?.message || "Something went wrong."
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Error talking to the bot." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Chat with NudgeBot 🤖</h2>
      <div className="h-80 overflow-y-auto mb-4 border p-3 rounded">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded-lg max-w-xs ${
              msg.sender === 'user'
                ? 'bg-blue-100 text-right ml-auto'
                : 'bg-gray-100 text-left mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 text-sm">Bot is thinking...</div>
        )}
      </div>

      <div className="flex">
        <input
          className="flex-1 border rounded-l-lg px-4 py-2 outline-none"
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWithBot;
