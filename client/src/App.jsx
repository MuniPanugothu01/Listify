import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import LandingPage from "./pages/LandingPage";

// A wrapper to conditionally render Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/signin";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<Sign />} />
            <Route path="/categories" element={<EventCalendar />} />
            <Route path="/postadd" element={<PostAdd />} />
            <Route path="/about" element={<About />} />
            <Route path="/contactUs" element={<HelpCenter />} />
            <Route path="/footer" element={<Footer />} />
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
            <Route
              path="/categories/resumes/:id"
              element={<ResumesDetails />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
};

export default App;
