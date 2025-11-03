import React from "react";
import Lottie from "lottie-react";
import travelerAnimation from "../components/lottie/Traveler.json"; // adjust path if needed

import { useNavigate } from "react-router-dom";


const PostAds = () => {

  const navigate = useNavigate();
  return (
    <section
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#FEFEFE]"
      aria-labelledby="post-ads-title"
    >
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side: Content */}
        <div className="space-y-6 lg:space-y-8 animate-fade-in-up">
          <header>
            <h2
              id="post-ads-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2F3A63] leading-tight tracking-tight"
            >
              Ready to Sell or Buy? It's Fast &amp; Free.
            </h2>
          </header>
          <p className="text-lg sm:text-xl text-gray-500 max-w-lg leading-relaxed">
            Join over 100,000 sellers on Listify and discover how easy it is to
            find a buyer in just 3 days. No fees, no hassle—just results.
          </p>
          <ul className="space-y-3 text-gray-500 max-w-lg" role="list">
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-[#2F3A63] flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Zero listing fees</span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-[#2F3A63] flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Local buyers only</span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-[#2F3A63] flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Secure transactions</span>
            </li>
          </ul>
          <div className="pt-4">
      <button
        onClick={() => navigate("/postadd")}
        className="group relative px-6 py-3 bg-[#2F3A63] text-white font-semibold text-base rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.15),0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-200 hover:bg-[#1e2a4a] focus:outline-none focus:ring-2 focus:ring-[#2F3A63] focus:ring-offset-2 transform hover:-translate-y-0.5"
        aria-label="Post an ad now"
      >
        <span className="relative z-10 cursor-pointer">Post Ad Now</span>
        <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </button>
    </div>
        </div>

        {/* Right side: Lottie Animation */}
        <div className="relative animate-fade-in-right flex justify-center items-center order-first lg:order-last">
          <div className="w-full max-w-md lg:max-w-lg">
            <Lottie
              animationData={travelerAnimation}
              loop={true}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostAds;
