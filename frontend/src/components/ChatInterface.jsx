import React, { useState } from 'react';
import { sendChatMessage } from '../api';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Welcome to our restaurant! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await sendChatMessage(input);
            const botMessage = { sender: 'bot', text: response.data.response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting to the server." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10 h-[600px] flex flex-col">
            <div className="bg-indigo-600 p-4 text-white font-bold text-lg">
                Restaurant Assistant
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 shadow rounded-bl-none'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg rounded-bl-none animate-pulse">
                            Typing...
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
