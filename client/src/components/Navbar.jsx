import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Heart } from "lucide-react";
import logo from "../assets/logo.jpg"; // Adjust the path as needed

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(parsedUser.isLoggedIn);
    }
  }, []);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
    setSavedCount(savedItems.length);
  }, []);

  useEffect(() => {
    const handleChange = () => {
      const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
      setSavedCount(saved.length);
    };

    window.addEventListener('savedItemsChanged', handleChange);
    return () => window.removeEventListener('savedItemsChanged', handleChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 250); // Delay of 250ms before hiding
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50   ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-[#2F3A63] ">Listify</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            
            <Link
              to="/postadd"
              className="text-gray-700 hover:text-[#2F3A63] font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Post Ads
            </Link>
            <Link
              to="/categories"
              className="text-gray-700 hover:text-[#2F3A63] font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-[#2F3A63] font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50"
            >
              About
            </Link>
            <Link
              to="/contactUs"
              className="text-gray-700 hover:text-[#2F3A63] font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Contact
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/saved"
                  className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Heart size={20} className="text-gray-600" />
                  {savedCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {savedCount}
                    </span>
                  )}
                </Link>
                <div 
                  className="relative ml-4"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative">
                    <User size={20} className="text-[#2F3A63]" />
                    <Link to="/profile" className="absolute inset-0" />
                  </button>
                  {showDropdown && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                    
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            {!isLoggedIn && (
              <Link
                to="/signin"
                className="ml-4 px-6 py-2 bg-[#2F3A63] text-white font-medium rounded-xl 
               border-2 border-transparent  hover:border-[#2F3A63] 
               transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#2F3A63] focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md animate-fadeIn">
          <div className="flex flex-col space-y-1 px-4 py-4">
           
            <Link
              to="/postadd"
              className="text-gray-700 hover:text-[#2F3A63] font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50 block"
              onClick={() => setIsOpen(false)}
            >
              Post Ads
            </Link>
            <Link
              to="/categories"
              className="text-gray-700 hover:text-[#2F3A63] font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50 block"
              onClick={() => setIsOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-[#2F3A63] font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50 block"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contactUs"
              className="text-gray-700 hover:text-[#2F3A63] font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50 block"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            {isLoggedIn ? (
              <>
                {savedCount > 0 && (
                  <Link
                    to="/saved"
                    className="flex items-center text-gray-700 hover:text-[#2F3A63] font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50 block relative"
                    onClick={() => setIsOpen(false)}
                  >
                    <Heart size={20} className="mr-2" />
                    Saved Items
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1 py-0.5">
                      {savedCount}
                    </span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-[#2F3A63] font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50 block flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={20} className="mr-2" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-[#2F3A63] font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50 block flex items-center"
                >
                  <LogOut size={20} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                className="mt-3 px-6 py-2 bg-[#2F3A63] text-white font-medium rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.15),0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]  text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}