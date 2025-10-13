import React from "react";
import { Globe } from "../../src/components/ui/globe";
import EventCalendar from "../components/EventCalendar";
import PostAds from "./PostAds";
import FeaturedListings from "./FeaturedListings";
import Testimonials from "./Testimonials";
import Review from "./Review";
import Footer from "./Footer";
const HeroSection = () => {
  return (
    <>
      <div className="bg-f4f4f4 relative flex w-full flex-col lg:flex-row items-center justify-center overflow-hidden rounded-lg border px-4 sm:px-6 lg:px-10 pt-16 pb-80 md:pb-128 lg:pb-16 lg:h-[600px]">
        {/* Text Section - Left Side */}
        <div className="flex-1 w-full lg:w-1/2 order-2 lg:order-1 mb-8 lg:mb-0 px-4 lg:px-0">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#2F3A63] sm:mb-6 md:mb-8 drop-shadow-2xl">
            Your Local Marketplace
          </h1>

          {/* Subtext */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Find the best deals, services, and products right in your
              neighborhood. Connect with trusted local vendors and experience
              your community like never before.
            </p>
          </div>
        </div>

        {/* Globe Section - Right Side */}
        <div className="flex-1 w-full lg:w-1/2 order-1 lg:order-2 flex justify-center items-center h-64 lg:h-full relative">
          <Globe className="w-full h-full max-w-md lg:max-w-lg" />
        </div>

        <div className="pointer-events-none absolute inset-0 h-full " />
      </div>
      <EventCalendar />
      <PostAds />
      <FeaturedListings />
      <Review />
      <Testimonials />
      <Footer />
    </>
  );
};

export default HeroSection;
