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
import PostAdd from "./pages/Post";
import HousesList from "./categories/HouseList";
import HouseDetails from "./categories/HouseDetails";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/signin" element={<Sign />} />
          <Route path="/categories" element={<EventCalendar />} />
          <Route path="/postadd" element={<PostAdd />} />
          <Route path="/about" element={<About />} />
          <Route path="/contactUs" element={<HelpCenter />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/categories/houses" element={<HousesList />} />
          <Route path="/categories/houses/:id" element={<HouseDetails />} />

        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
