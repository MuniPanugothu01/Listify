// components/ChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import { X, Send, Minimize2, MessageCircle, Bot } from "lucide-react";
import chatIconAnimation from "../components/lottie/Chatbot.json";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your friendly assistant. I can help you with questions about our platform, guide you through features, or connect you with human support. What can I help you with today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lottieRef = useRef();

  // Enhanced dummy responses with more personality
  const botResponses = [
    "That's a great question! Let me help you with that. Our platform makes it easy to connect with local buyers and sellers.",
    "I understand what you're looking for! Many users find our verification system really helpful for safe transactions.",
    "Thanks for asking! We've designed this feature to be super user-friendly. Would you like me to walk you through it step by step?",
    "I'd be happy to help with that! Our community guidelines ensure everyone has a positive experience.",
    "That's a common question! Let me share some best practices that other successful users follow.",
    "I can definitely assist with that! Our support team is also available if you need more detailed help.",
    "Great question! We're constantly improving based on user feedback. Your experience matters to us!",
    "I understand your concern. Let me show you how our safety features protect both buyers and sellers.",
  ];

  // Quick reply suggestions
  const quickReplies = [
    "How do I post an ad?",
    "Is it safe to buy/sell here?",
    "What are the fees?",
    "How to contact support?",
    "Tips for successful sales",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Continuous animation for the floating icon
    if (lottieRef.current && !isOpen) {
      lottieRef.current.play();
    }
  }, [isOpen]);

  useEffect(() => {
    // Focus input when chat opens
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot response after delay
    setTimeout(() => {
      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // Reset unread count when user gets response
      if (isMinimized) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 1500 + Math.random() * 1000); // Random delay for more natural feel
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
    // Auto-send after a brief moment
    setTimeout(() => {
      handleSendMessage({ preventDefault: () => {} });
    }, 100);
  };

  const handleToggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
      setUnreadCount(0);
    }
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Enhanced Floating Chat Icon - Always Visible */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Window */}
        {isOpen && (
          <div
            className={`bg-white rounded-2xl shadow-2xl border border-gray-200 mb-4 transition-all duration-300 transform ${
              isMinimized
                ? "w-80 h-16 opacity-90 scale-95"
                : "w-80 h-[28rem] opacity-100 scale-100"
            }`}
            style={{
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 40px rgba(59, 130, 246, 0.1)",
            }}
          >
            {/* Enhanced Header */}
            <div
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-t-2xl p-4 text-white relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
              }}
            >
              {/* Animated background elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-2 left-4 w-8 h-8 bg-white rounded-full"></div>
                <div className="absolute bottom-2 right-4 w-6 h-6 bg-white rounded-full"></div>
              </div>

              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Support Assistant</h3>
                    <p className="text-xs opacity-90 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      Online now
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={handleMinimize}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110"
                    aria-label="Minimize chat"
                  >
                    <Minimize2 size={14} />
                  </button>
                  <button
                    onClick={handleCloseChat}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110"
                    aria-label="Close chat"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs rounded-2xl px-4 py-3 transition-all duration-200 ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-lg"
                            : "bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.text}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            Assistant is typing...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Replies */}
                  {messages.length === 1 && !isTyping && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 text-center">
                        Quick questions:
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickReply(reply)}
                            className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 shadow-sm"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input Area */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-gray-100 bg-white rounded-b-2xl"
                >
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="w-full border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                        disabled={isTyping}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-3 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    💬 We typically reply within seconds
                  </p>
                </form>
              </>
            )}

            {/* Enhanced Minimized State */}
            {isMinimized && (
              <div
                className="flex items-center justify-between p-4 cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200 rounded-b-2xl"
                onClick={() => {
                  setIsMinimized(false);
                  setUnreadCount(0);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Live Chat
                    </p>
                    <p className="text-xs text-gray-500">
                      {unreadCount > 0
                        ? `${unreadCount} new message${
                            unreadCount > 1 ? "s" : ""
                          }`
                        : "Click to open"}
                    </p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Floating Icon - Always Visible */}
        <div
          className="cursor-pointer transform hover:scale-110 transition-all duration-300 relative group"
          onClick={handleToggleChat}
          style={{
            filter: "drop-shadow(0 10px 30px rgba(59, 130, 246, 0.3))",
          }}
        >
          <div className="relative">
            {/* Main Lottie Animation */}
            <Lottie
              lottieRef={lottieRef}
              animationData={chatIconAnimation}
              loop={true}
              autoplay={true}
              style={{
                width: 70,
                height: 70,
                filter: "drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))",
              }}
            />

            {/* Pulsing Effect */}
            {/* <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></div> */}

            {/* Notification Badge */}
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold animate-bounce">
                {unreadCount}
              </div>
            )}

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
              <div className="bg-gray-900 text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
                {isOpen ? "Minimize chat" : "Chat with us!"}
                <div className="absolute top-full right-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
