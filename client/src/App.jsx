import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";
import Sign from "./components/Sign";
import LandingPage from "./pages/LandingPage";
import HeroSection from "./pages/HeroSection";
import About from "./pages/About";
import HelpCenter from "./pages/HelpCenter";
import PostAdd from "./pages/Post";
import PostAds from "./pages/PostAds";
import EventCalendar from "./components/EventCalendar";
import HousesList from "./categories/HouseList";
import HouseDetails from "./categories/HouseDetails";
import SalesList from "./categories/SalesList";
import SalesDetails from "./categories/SalesDetails";
import ServicesList from "./categories/ServicesList";
import ServicesDetails from "./categories/ServicesDetails";
import GigsList from "./categories/GigsList";
import GigsDetails from "./categories/GigsDetails";
import JobsList from "./categories/JobsList";
import JobsDetails from "./categories/JobsDetails";
import CommunityList from "./categories/CommunityList";
import CommunityDetails from "./categories/CommunityDetails";
import DiscussionForumsList from "./categories/DiscussionForumsList";
import DiscussionForumsDetails from "./categories/DiscussionForumsDetails";
import ResumesList from "./categories/ResumesList.jsx";
import ResumesDetails from "./categories/ResumesDetails";
import SavedItems from "./components/SavedItems";
import Profile from "./components/Profile";

// ✅ Layout wrapper that hides Navbar & Footer on /signin
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === "/signin";

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

// ✅ All Routes Wrapped Once
const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hero" element={<HeroSection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contactUs" element={<HelpCenter />} />
          <Route path="/postadd" element={<PostAdd />} />
          <Route path="/postads" element={<PostAds />} />
          <Route path="/categories" element={<EventCalendar />} />
          <Route path="/categories/houses" element={<HousesList />} />
          <Route path="/categories/houses/:id" element={<HouseDetails />} />
          <Route path="/categories/sales" element={<SalesList />} />
          <Route path="/categories/sales/:id" element={<SalesDetails />} />
          <Route path="/categories/services" element={<ServicesList />} />
          <Route
            path="/categories/services/:id"
            element={<ServicesDetails />}
          />
          <Route path="/categories/gigs" element={<GigsList />} />
          <Route path="/categories/gigs/:id" element={<GigsDetails />} />
          <Route path="/categories/jobs" element={<JobsList />} />
          <Route path="/categories/jobs/:id" element={<JobsDetails />} />
          <Route path="/categories/community" element={<CommunityList />} />
          <Route
            path="/categories/community/:id"
            element={<CommunityDetails />}
          />
          <Route
            path="/categories/discussion"
            element={<DiscussionForumsList />}
          />
          <Route
            path="/categories/discussion/:id"
            element={<DiscussionForumsDetails />}
          />
          <Route path="/categories/resumes" element={<ResumesList />} />
          <Route path="/categories/resumes/:id" element={<ResumesDetails />} />
          <Route path="/saved" element={<SavedItems />} />
          <Route path="/profile" element={<Profile />} />

          {/* 🚫 Sign-in (No Navbar or Footer) */}
          <Route path="/signin" element={<Sign />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
