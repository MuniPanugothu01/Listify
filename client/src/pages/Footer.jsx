// src/components/Footer.jsx
import React from "react";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="bg-[#F3F3F3] py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Brand, Newsletter, and Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#2F3A63] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <h2 className="text-[#2F3A63] font-bold text-lg">Listify</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4 max-w-xs leading-relaxed">
              Your trusted local marketplace for buying, selling, and connecting
              with your community.
            </p>
            {/* Newsletter Signup */}
            <div className="relative">
              <input
                type="email"
                placeholder="Subscribe for updates"
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/20 focus:border-transparent"
                aria-label="Email for newsletter"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-[#2F3A63] text-white px-3 py-1 rounded-lg hover:bg-[#1e2a4a] transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[#2F3A63] font-bold mb-4 text-sm uppercase tracking-wide">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/help"
                  className="text-gray-500 hover:text-[#2F3A63] transition-colors duration-200 block text-sm leading-relaxed hover:underline focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/20 focus:ring-offset-2"
                  aria-label="Help Center"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/safety"
                  className="text-gray-500 hover:text-[#2F3A63] transition-colors duration-200 block text-sm leading-relaxed hover:underline focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/20 focus:ring-offset-2"
                  aria-label="Safety Tips"
                >
                  Safety Tips
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-500 hover:text-[#2F3A63] transition-colors duration-200 block text-sm leading-relaxed hover:underline focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/20 focus:ring-offset-2"
                  aria-label="Contact Us"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[#2F3A63] font-bold mb-4 text-sm uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/terms"
                  className="text-gray-500 hover:text-[#2F3A63] transition-colors duration-200 block text-sm leading-relaxed hover:underline focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/20 focus:ring-offset-2"
                  aria-label="Terms of Service"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-500 hover:text-[#2F3A63] transition-colors duration-200 block text-sm leading-relaxed hover:underline focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/20 focus:ring-offset-2"
                  aria-label="Privacy Policy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  className="text-gray-500 hover:text-[#2F3A63] transition-colors duration-200 block text-sm leading-relaxed hover:underline focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/20 focus:ring-offset-2"
                  aria-label="Cookie Policy"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-[#2F3A63] font-bold mb-4 text-sm uppercase tracking-wide">
              Follow Us
            </h3>
            <div className="space-y-3">
              <a
                href="https://facebook.com/listify"
                className="flex items-center space-x-2 text-gray-500 hover:text-[#2F3A63] hover:bg-[#2F3A63]/5 transition-all duration-200 text-sm leading-relaxed p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/20 focus:ring-offset-2"
                aria-label="Follow us on Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>
              <a
                href="https://twitter.com/listify"
                className="flex items-center space-x-2 text-gray-500 hover:text-[#2F3A63] hover:bg-[#2F3A63]/5 transition-all duration-200 text-sm leading-relaxed p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/20 focus:ring-offset-2"
                aria-label="Follow us on Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </a>
              <a
                href="https://instagram.com/listify"
                className="flex items-center space-x-2 text-gray-500 hover:text-[#2F3A63] hover:bg-[#2F3A63]/5 transition-all duration-200 text-sm leading-relaxed p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/20 focus:ring-offset-2"
                aria-label="Follow us on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Listify Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
