import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../api';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Welcome to Subway Fast Food! 🥪 How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const [sessionId] = useState(() => {
        // Generate a random session ID on mount
        return 'session_' + Math.random().toString(36).substr(2, 9);
    });

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await sendChatMessage(input, sessionId);
            const botMessage = { sender: 'bot', text: response.data.response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting to the server." }]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { text: "Show Menu", icon: "📋" },
        { text: "I want a pizza", icon: "🍕" },
        { text: "Order status", icon: "📦" },
        { text: "Help", icon: "❓" }
    ];

    return (
        <div className="max-w-2xl mx-auto">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-t-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        <span className="text-3xl">🤖</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Subway AI Assistant</h2>
                        <div className="flex items-center gap-2 text-emerald-100 text-sm">
                            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                            Online - Ready to help!
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="bg-gradient-to-b from-gray-50 to-gray-100 h-[450px] overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                        {msg.sender === 'bot' && (
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                <span>🤖</span>
                            </div>
                        )}
                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${msg.sender === 'user'
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-br-md'
                            : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                            }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        {msg.sender === 'user' && (
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                                <span className="text-white text-sm">👤</span>
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start animate-fadeIn">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-2">
                            <span>🤖</span>
                        </div>
                        <div className="bg-white text-gray-500 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="bg-white border-t border-gray-100 px-4 py-3">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => setInput(action.text)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 rounded-full text-sm whitespace-nowrap transition-all duration-200"
                        >
                            <span>{action.icon}</span>
                            <span>{action.text}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="bg-white p-4 border-t border-gray-200 rounded-b-2xl shadow-lg">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-green-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <span>Send</span>
                        <span>➤</span>
                    </button>
                </div>
            </form>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ChatInterface;
