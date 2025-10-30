// components/Sidebar.jsx
import React from "react";
import { 
  Home,
  User, 
  Settings, 
  Heart, 
  Shield, 
  LogOut, 
  FileText,
  MessageCircle,
  Activity,
  Menu,
  X
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = ({ activeSection, setActiveSection, counts, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "personal", label: "Personal Details", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "posts", label: "My Posts", icon: FileText, count: counts.posts },
    { id: "saved", label: "Saved Items", icon: Heart, count: counts.saved },
    { id: "messages", label: "Messages", icon: MessageCircle, count: 3 },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <>
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 bg-opacity-50 "
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static top-16 lg:top-0 left-0 h-full lg:h-auto w-64 bg-white rounded-2xl shadow-xl p-4 sm:p-6
        transition-transform duration-300  
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left  ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-[#2F3A63]/10 to-[#59B2CE]/10 text-[#2F3A63] shadow-md border border-[#2F3A63]/20 "
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <item.icon className={`w-5 h-5 flex-shrink-0   ${activeSection === item.id ? 'text-[#2F3A63]' : ''}`} />
                <span className="font-medium truncate">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full transition-transform duration-300 flex-shrink-0 ${
                  activeSection === item.id 
                    ? 'bg-[#2F3A63] text-white ' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => {
              localStorage.removeItem('user');
              toast.success("Logged out successfully.");
              setTimeout(() => {
                window.location.href = '/';
              }, 500);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-4"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
        style={{ zIndex: 9999 }}
      />
    </>
  );
};

export default Sidebar;