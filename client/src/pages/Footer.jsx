// src/components/Footer.jsx
import React, { useState } from "react";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone, 
  Download,
  Shield,
  Heart,
  ArrowUp
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically make an API call
      console.log("Subscribed with:", email);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const popularCategories = [
    "Electronics", "Vehicles", "Real Estate", "Jobs", "Services",
    "Furniture", "Clothing", "Sports", "Books", "Pets"
  ];

  const popularCities = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
    "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"
  ];

  return (
    <footer className="bg-[#FBFCFD] pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t  lg:rounded-t-[10%] md:rounded-t-[10%]  sm:rounded-t-[10%] border-gray-200 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#2F3A63]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#2F3A63]/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand & Contact Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2F3A63] to-[#1e2a4a] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h2 className="text-[#2F3A63] font-bold text-xl">Listify</h2>
                <p className="text-gray-500 text-xs">Trusted Local Marketplace</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-6 leading-relaxed max-w-md">
              Connecting communities through trusted local commerce. Buy, sell, and discover everything you need right in your neighborhood.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="w-4 h-4 text-[#2F3A63]" />
                <span className="text-sm">123 Market St, City, State 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-4 h-4 text-[#2F3A63]" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-4 h-4 text-[#2F3A63]" />
                <span className="text-sm">support@listify.com</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-green-700 text-xs font-medium">Verified Sellers</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                <Heart className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 text-xs font-medium">Community First</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-[#2F3A63] font-bold mb-4 text-sm uppercase tracking-wider">
              Marketplace
            </h3>
            <ul className="space-y-3">
              {["Buy", "Sell", "Services", "Jobs", "Housing", "Community"].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-[#2F3A63] transition-all duration-200 text-sm leading-relaxed hover:translate-x-1 block hover:font-medium"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-[#2F3A63] font-bold mb-4 text-sm uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3">
              {["Help Center", "Safety Tips", "Contact Us", "FAQ", "Seller Guide", "Buyer Guide"].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 hover:text-[#2F3A63] transition-all duration-200 text-sm leading-relaxed hover:translate-x-1 block hover:font-medium"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-[#2F3A63] font-bold mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              {["About Us", "Careers", "Press", "Blog", "Team", "Partners"].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 hover:text-[#2F3A63] transition-all duration-200 text-sm leading-relaxed hover:translate-x-1 block hover:font-medium"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Apps */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-[#2F3A63] font-bold mb-4 text-sm uppercase tracking-wider">
              Stay Updated
            </h3>
            
            {/* Newsletter */}
            <div className="mb-6">
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-4 pr-24 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/20 focus:border-[#2F3A63] transition-all duration-200 bg-white"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#2F3A63] to-[#1e2a4a] text-white px-4 py-1.5 rounded-lg hover:shadow-lg transition-all duration-200 text-xs font-medium"
                  >
                    Subscribe
                  </button>
                </div>
                {isSubscribed && (
                  <p className="text-green-600 text-xs animate-pulse">Thank you for subscribing!</p>
                )}
              </form>
            </div>

            {/* Mobile Apps */}
            <div className="mb-6">
              <h4 className="text-gray-700 font-semibold mb-3 text-sm">Get the App</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center space-x-2 bg-black text-white py-2.5 px-4 rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm">
                  <Download className="w-4 h-4" />
                  <span>App Store</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 bg-black text-white py-2.5 px-4 rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm">
                  <Download className="w-4 h-4" />
                  <span>Google Play</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Categories & Cities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 py-8 border-y border-gray-200">
          <div>
            <h4 className="text-[#2F3A63] font-bold mb-4 text-sm uppercase tracking-wider">
              Popular Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularCategories.map((category) => (
                <a
                  key={category}
                  href={`/category/${category.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-600 hover:text-[#2F3A63] hover:bg-[#2F3A63]/5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 border border-transparent hover:border-[#2F3A63]/20"
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[#2F3A63] font-bold mb-4 text-sm uppercase tracking-wider">
              Popular Cities
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularCities.map((city) => (
                <a
                  key={city}
                  href={`/location/${city.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-600 hover:text-[#2F3A63] hover:bg-[#2F3A63]/5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 border border-transparent hover:border-[#2F3A63]/20"
                >
                  {city}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-8 border-t border-gray-200">
          {/* Copyright & Legal */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Listify Marketplace. All rights reserved.</p>
            <div className="flex space-x-4">
              {["Terms", "Privacy", "Cookies", "Do Not Sell"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="hover:text-[#2F3A63] transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links & Scroll to Top */}
          <div className="flex items-center space-x-6">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {[
                { icon: Facebook, href: "https://facebook.com/listify", label: "Facebook" },
                { icon: Twitter, href: "https://twitter.com/listify", label: "Twitter" },
                { icon: Instagram, href: "https://instagram.com/listify", label: "Instagram" },
                { icon: Linkedin, href: "https://linkedin.com/company/listify", label: "LinkedIn" }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-[#2F3A63] hover:bg-[#2F3A63]/5 transition-all duration-200 p-2 rounded-lg hover:scale-110"
                  aria-label={`Follow us on ${social.label}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 bg-[#2F3A63] text-white px-4 py-2.5 rounded-xl hover:bg-[#1e2a4a] transition-all duration-200 hover:shadow-lg text-sm font-medium"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;