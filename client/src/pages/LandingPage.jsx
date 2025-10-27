import React from "react";
import EventCalendar from "../components/EventCalendar";
import HeroSection from "./HeroSection";
import PostAds from "./PostAds";
import FeaturedListings from "./FeaturedListings";
import Testimonials from "./Testimonials";
import Review from "./Review";
import Footer from "./Footer";
const LandingPage = () => {
  return (
    <div className="">
      <HeroSection />
      <EventCalendar />
      <PostAds />
      <FeaturedListings />
      <Review />
      <Testimonials />
    </div>
  );
};

export default LandingPage;
