// components/MessagesSection.jsx
import React, { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";

const MessagesSection = ({ messages }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  // Sample chat history for demonstration (can be expanded per conversation)
  const sampleChatHistory = [
    { text: "Hey John, interested in the downtown apartment! It looks amazing.", sender: "other", time: "10:30 AM" },
    { text: "What up? When can we schedule a viewing?", sender: "other", time: "10:32 AM" },
    { text: "Sounds good! How about tomorrow at 2 PM?", sender: "me", time: "10:35 AM" },
    { text: "Perfect, I'll book it for you. Any specific questions?", sender: "me", time: "10:36 AM" },
    { text: "Just the parking situation. Is there street parking available?", sender: "other", time: "10:38 AM" }
  ];

  const selectedConversation = messages.find(conv => conv.name === selectedChat);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-500 mt-1">Stay connected with your clients</p>
        </div>
        <button className="px-4 py-2 bg-[#2F3A63] text-white rounded-xl hover:bg-[#5669A4] transition-colors font-medium flex items-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto">
          <MessageCircle className="w-4 h-4" />
          New Message
        </button>
      </div>

      <div className="flex flex-col sm:flex-row h-[600px] bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Conversations List */}
        <div className="w-full sm:w-80 border-r border-gray-100 flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Conversations</h3>
            <span className="text-sm text-gray-500">3 unread</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.map((conv) => (
              <div
                key={conv.name}
                onClick={() => setSelectedChat(conv.name === selectedChat ? null : conv.name)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 flex items-center justify-between transition-colors ${
                  conv.name === selectedChat ? 'bg-[#A9E4FB]/10 border-r-2 border-[#59B2CE]' : ''
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 truncate">{conv.name}</p>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{conv.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">{conv.preview}</p>
                  </div>
                </div>
                {conv.unread && <div className="w-2 h-2 bg-[#2F3A63] rounded-full flex-shrink-0"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          {selectedChat && selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedConversation.avatar} alt={selectedChat} className="w-8 h-8 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{selectedChat}</p>
                    <p className="text-xs text-gray-500">Active 2 mins ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                  <MessageCircle className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {sampleChatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm shadow-sm ${
                        msg.sender === 'me'
                          ? 'bg-[#2F3A63] text-white rounded-br-sm'
                          : 'bg-gray-200 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                      <p className="text-xs text-gray-400 mt-1 opacity-75">
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#59B2CE] focus:border-transparent transition-all shadow-sm"
                  />
                  <button className="w-10 h-10 bg-[#2F3A63] text-white rounded-xl flex items-center justify-center hover:bg-[#5669A4] transition-colors shadow-md flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-600">Choose a message from the left to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesSection;