import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import Sign from "./components/Sign";
import EventCalendar from "./components/EventCalendar";
import PostAds from "./pages/PostAds";
import HelpCenter from "./pages/HelpCenter";
import Footer from "./pages/Footer";
import About from "./pages/About";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/signin" element={<Sign />} />
          <Route path="/categories" element={<EventCalendar />} />
          <Route path="/postads" element={<PostAds />} />
          <Route path="/about" element={<About />} />
          <Route path="/contactUs" element={<HelpCenter />} />
          <Route path="/footer" element={<Footer />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
