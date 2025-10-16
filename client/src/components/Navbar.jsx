import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.jpg"; // Adjust the path as needed

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
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
            <Link
              to="/signin"
              className="ml-4 px-6 py-2 bg-[#2F3A63] text-white font-medium rounded-xl 
             border-2 border-transparent hover:bg-transparent hover:text-[#2F3A63] hover:border-[#2F3A63] 
             transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign In
            </Link>
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
            <Link
              to="/signin"
              className="mt-3 px-6 py-2 bg-[#2F3A63] text-white font-medium rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.15),0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-green-600 transition-all duration-200 text-center"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}