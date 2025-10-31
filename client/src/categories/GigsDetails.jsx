import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaHeart,
  FaShareAlt,
  FaPhone,
  FaCalendarAlt,
  FaStar,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaComments,
  FaClock,
  FaCheckCircle,
  FaMusic,
  FaPalette,
  FaLaptopCode,
  FaUtensils,
  FaCalendarDay,
  FaHardHat,
  FaUserTie,
  FaUser,
  FaDollarSign,
} from "react-icons/fa";

// Import your JSON data
import data from "../data/data.json";

function GigsDetails() {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Get gig image function - SAME AS GigsList.jsx
  const getGigImage = (gigType, gigId) => {
    const imageMap = {
      music: [
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ],
      creative: [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ],
      technical: [
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ],
      food: [
        "https://images.unsplash.com/photo-1559314809-0f1555a0e4ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ],
      event: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ],
      labor: [
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ],
      professional: [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1551836026-d5cbc839252c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      ],
    };

    const defaultImages = [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    ];

    const categoryImages = imageMap[gigType] || defaultImages;
    return categoryImages[gigId % categoryImages.length];
  };

  // Extract gig type from title/description
  const extractGigType = (gig) => {
    const title = gig.title.toLowerCase();
    const description = gig.description.toLowerCase();

    if (
      title.includes("dj") ||
      title.includes("musician") ||
      title.includes("music") ||
      description.includes("music")
    )
      return "music";
    if (
      title.includes("design") ||
      title.includes("graphic") ||
      title.includes("creative") ||
      description.includes("design") ||
      title.includes("photo") ||
      title.includes("artist")
    )
      return "creative";
    if (
      title.includes("web") ||
      title.includes("developer") ||
      title.includes("technical") ||
      description.includes("app") ||
      title.includes("seo") ||
      title.includes("it")
    )
      return "technical";
    if (
      title.includes("barista") ||
      title.includes("cater") ||
      title.includes("food") ||
      description.includes("chef") ||
      title.includes("baking") ||
      title.includes("coffee")
    )
      return "food";
    if (
      title.includes("event") ||
      title.includes("wedding") ||
      title.includes("party") ||
      description.includes("event") ||
      title.includes("security") ||
      title.includes("planner")
    )
      return "event";
    if (
      title.includes("labor") ||
      title.includes("handyman") ||
      title.includes("repair") ||
      description.includes("construction") ||
      title.includes("cleaning") ||
      title.includes("maintenance")
    )
      return "labor";
    if (
      title.includes("consultant") ||
      title.includes("manager") ||
      title.includes("professional") ||
      description.includes("business") ||
      title.includes("tutor") ||
      title.includes("coach")
    )
      return "professional";

    return "creative"; // default
  };

  // Get gig type icon
  const getGigTypeIcon = (gigType) => {
    switch (gigType) {
      case "music":
        return <FaMusic className="w-5 h-5" />;
      case "creative":
        return <FaPalette className="w-5 h-5" />;
      case "technical":
        return <FaLaptopCode className="w-5 h-5" />;
      case "food":
        return <FaUtensils className="w-5 h-5" />;
      case "event":
        return <FaCalendarDay className="w-5 h-5" />;
      case "labor":
        return <FaHardHat className="w-5 h-5" />;
      case "professional":
        return <FaUserTie className="w-5 h-5" />;
      default:
        return <FaUser className="w-5 h-5" />;
    }
  };

  // Get gig type badge color and text
  const getGigTypeInfo = (gigType) => {
    switch (gigType) {
      case "music":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          text: "Music & Entertainment",
        };
      case "creative":
        return {
          color: "bg-pink-100 text-pink-800 border-pink-200",
          text: "Creative & Design",
        };
      case "technical":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          text: "Technical",
        };
      case "food":
        return {
          color: "bg-orange-100 text-orange-800 border-orange-200",
          text: "Food & Beverage",
        };
      case "event":
        return {
          color: "bg-teal-100 text-teal-800 border-teal-200",
          text: "Event Staff",
        };
      case "labor":
        return {
          color: "bg-amber-100 text-amber-800 border-amber-200",
          text: "Labor & Skilled Trades",
        };
      case "professional":
        return {
          color: "bg-indigo-100 text-indigo-800 border-indigo-200",
          text: "Professional Services",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          text: "Gig",
        };
    }
  };

  // Generate random rating for gigs (for demo purposes)
  const getRandomRating = (gigId) => {
    const ratings = [4.2, 4.5, 4.8, 4.0, 4.7, 4.9, 4.3, 4.6];
    return ratings[gigId % ratings.length];
  };

  // Generate random review count
  const getRandomReviewCount = (gigId) => {
    const counts = [12, 8, 25, 15, 32, 7, 18, 21];
    return counts[gigId % counts.length];
  };

  useEffect(() => {
    try {
      const foundGig = data.gigs.find((g) => g.id === parseInt(id));
      if (!foundGig) {
        setError("Gig not found");
      } else {
        const gigType = extractGigType(foundGig);
        const enhancedGig = {
          ...foundGig,
          type: gigType,
          rating: getRandomRating(foundGig.id),
          reviews: getRandomReviewCount(foundGig.id),
          contact: {
            phone: "+1 (555) 123-4567",
            email: "contact@example.com",
            name: foundGig.sellerName || "Gig Provider",
          },
          requirements: [
            "Previous experience preferred",
            "Good communication skills",
            "Reliable and punctual",
            "Positive attitude",
            "Flexible schedule availability",
          ],
          schedule: "Flexible hours",
          duration: "One-time project",
          experience: "Beginner to Intermediate",
        };
        setGig(enhancedGig);
        setSelectedImage(getGigImage(gigType, foundGig.id));
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load gig data");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
    setSavedItems(saved);
  }, [id]);

  const isSaved = savedItems.some((h) => h.id === gig?.id);

  const toggleSave = () => {
    if (!gig) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedItems.filter((h) => h.id !== gig.id);
    } else {
      newSaved = [...savedItems, gig];
    }
    setSavedItems(newSaved);
    localStorage.setItem("savedItems", JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent("savedItemsChanged"));
  };

  const shareGig = () => {
    if (navigator.share) {
      navigator.share({
        title: gig.title,
        text: gig.description,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
  };

  // Extract features from description
  const extractFeatures = (description) => {
    const features = [];
    if (!description) return features;

    if (
      description.toLowerCase().includes("flexible") ||
      description.toLowerCase().includes("schedule")
    )
      features.push("Flexible Schedule");
    if (
      description.toLowerCase().includes("training") ||
      description.toLowerCase().includes("learn")
    )
      features.push("Training Provided");
    if (
      description.toLowerCase().includes("immediate") ||
      description.toLowerCase().includes("start")
    )
      features.push("Immediate Start");
    if (
      description.toLowerCase().includes("remote") ||
      description.toLowerCase().includes("work from home")
    )
      features.push("Remote Work Possible");
    if (
      description.toLowerCase().includes("team") ||
      description.toLowerCase().includes("collaborat")
    )
      features.push("Team Environment");
    if (
      description.toLowerCase().includes("bonus") ||
      description.toLowerCase().includes("incentive")
    )
      features.push("Performance Bonus");

    // Add default features if none found
    if (features.length === 0) {
      features.push(
        "Great Learning Opportunity",
        "Supportive Team",
        "Skill Development",
        "Networking Chance"
      );
    }

    return features.slice(0, 6);
  };

  // Get similar gigs (exclude current gig)
  const getSimilarGigs = () => {
    if (!gig) return [];
    return data.gigs
      .filter((item) => item.id !== gig.id && extractGigType(item) === gig.type)
      .slice(0, 6);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F3A63] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading gig details...</p>
        </div>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaMusic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gig Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The gig you're looking for doesn't exist.
          </p>
          <Link
            to="/categories/gigs"
            className="bg-[#2F3A63] text-white px-6 py-3 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium inline-flex items-center"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Gigs
          </Link>
        </div>
      </div>
    );
  }

  const features = extractFeatures(gig.description);
  const similarGigs = getSimilarGigs();
  const gigTypeInfo = getGigTypeInfo(gig.type);

  // Use the same image logic for display images
  const displayImages = [
    getGigImage(gig.type, gig.id),
    getGigImage(gig.type, gig.id + 1),
    getGigImage(gig.type, gig.id + 2),
    getGigImage(gig.type, gig.id + 3),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/categories/gigs"
              className="inline-flex items-center text-[#2F3A63] font-medium hover:text-[#1E2A4D] transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Gigs
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={shareGig}
                className="p-2 text-gray-600 hover:text-[#2F3A63] transition-colors relative"
              >
                <FaShareAlt className="w-4 h-4" />
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={copyLink}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-t-lg flex items-center gap-3"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      Copy Link
                    </button>
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-b-lg flex items-center gap-3">
                      <FaEnvelope className="w-4 h-4" />
                      Share via Email
                    </button>
                  </div>
                )}
              </button>

              <button
                onClick={toggleSave}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isSaved
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaHeart
                  className={`w-4 h-4 ${
                    isSaved ? "fill-red-600 text-red-600" : ""
                  }`}
                />
                <span className="hidden sm:inline font-medium">
                  {isSaved ? "Saved" : "Save"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt={gig.title}
                  className="w-full h-100 object-cover"
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${gigTypeInfo.color} border`}
                  >
                    {gigTypeInfo.text}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                    {gig.posted}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4 grid grid-cols-4 gap-3">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={` rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? " ring-opacity-20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${gig.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Gig Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {gig.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      <span className="font-medium">{gig.location}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#2F3A63] mb-1">
                      {gig.pay}
                    </div>
                    <div className="text-sm text-gray-500">Gig Payment</div>
                  </div>
                </div>

                {/* Gig Stats */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    {/* Rating */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 border border-gray-200">
                        <FaStar className="w-4 h-4 text-[#2F3A63]" />
                      </div>
                      <div className="text-xs text-gray-600 mb-1">Rating</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {gig.rating}/5
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-px h-8 bg-gray-300 mx-2"></div>

                    {/* Reviews */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 border border-gray-200">
                        <FaComments className="w-4 h-4 text-[#2F3A63]" />
                      </div>
                      <div className="text-xs text-gray-600 mb-1">Reviews</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {gig.reviews}
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-px h-8 bg-gray-300 mx-2"></div>

                    {/* Schedule */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 border border-gray-200">
                        <FaClock className="w-4 h-4 text-[#2F3A63]" />
                      </div>
                      <div className="text-xs text-gray-600 mb-1">Schedule</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        Flexible
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <FaCalendarAlt className="w-4 h-4 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Posted</div>
                    <div className="font-semibold text-gray-900 text-xs">
                      {gig.posted}
                    </div>
                  </div>
                  <div className="text-center">
                    {getGigTypeIcon(gig.type)}
                    <div className="text-xs text-gray-600">Category</div>
                    <div className="font-semibold text-gray-900 text-xs">
                      {gigTypeInfo.text.split(" ")[0]}
                    </div>
                  </div>
                  <div className="text-center">
                    <FaShieldAlt className="w-4 h-4 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Experience</div>
                    <div className="font-semibold text-gray-900 text-xs">
                      {gig.experience}
                    </div>
                  </div>
                  <div className="text-center">
                    <FaClock className="w-4 h-4 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Duration</div>
                    <div className="font-semibold text-gray-900 text-xs">
                      {gig.duration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="px-6 flex space-x-8">
                  {["overview", "requirements", "location"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors capitalize ${
                        activeTab === tab
                          ? "border-[#2F3A63] text-[#2F3A63]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Gig Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {gig.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <FaCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "requirements" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Requirements
                        </h4>
                        <div className="space-y-3">
                          {gig.requirements.map((requirement, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 py-2"
                            >
                              <div className="w-2 h-2 bg-[#2F3A63] rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">
                                {requirement}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Gig Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Schedule</span>
                            <span className="font-medium">{gig.schedule}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Duration</span>
                            <span className="font-medium">{gig.duration}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">
                              Experience Level
                            </span>
                            <span className="font-medium">
                              {gig.experience}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Gig Type</span>
                            <span className="font-medium">
                              {gigTypeInfo.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "location" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Gig Location
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {gig.location}. This gig is located in a convenient area
                        with easy access to public transportation. Contact the
                        provider for specific meeting instructions and location
                        details.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2F3A63]">
                            Public
                          </div>
                          <div className="text-sm text-gray-600">
                            Meeting Spot
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2F3A63]">
                            Flexible
                          </div>
                          <div className="text-sm text-gray-600">Timings</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2F3A63]">
                            Safe
                          </div>
                          <div className="text-sm text-gray-600">
                            Environment
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Map Location
                      </h3>
                      <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200">
                        <iframe
                          title="Gig Location Map"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(
                            gig.location
                          )}&output=embed&zoom=15`}
                          className="border-0"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:w-1/3 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Provider
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2F3A63] to-[#4A5FC1] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {gig.contact.name?.charAt(0) || "G"}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {gig.contact.name}
                  </h4>
                  <p className="text-gray-600 text-sm">Gig Provider</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({gig.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-[#2F3A63] text-white py-3 px-4 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium flex items-center justify-center gap-2">
                  <FaComments className="w-4 h-4" />
                  Message Provider
                </button>

                <button className="w-full border border-[#2F3A63] text-[#2F3A63] py-3 px-4 rounded-lg hover:bg-[#2F3A63] hover:text-white transition-colors font-medium flex items-center justify-center gap-2">
                  <FaPhone className="w-4 h-4" />
                  Call Provider
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  <FaCalendarAlt className="w-4 h-4 inline mr-1" />
                  Posted {gig.posted}
                </div>
              </div>
            </div>

            {/* Apply Now Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ready to Apply?
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#2F3A63] mb-2">
                    {gig.pay}
                  </div>
                  <p className="text-gray-600 text-sm">Payment for this gig</p>
                </div>

                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2">
                  <FaCheckCircle className="w-4 h-4" />
                  Apply Now
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By applying, you agree to our terms and conditions
                </p>
              </div>
            </div>

            {/* Similar Gigs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {getGigTypeIcon(gig.type)}
                  Similar Gigs ({similarGigs.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {similarGigs.map((item) => {
                  const itemGigType = extractGigType(item);
                  const itemTypeInfo = getGigTypeInfo(itemGigType);
                  return (
                    <Link
                      key={item.id}
                      to={`/categories/gigs/${item.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex gap-3">
                        <img
                          src={getGigImage(itemGigType, item.id)}
                          alt={item.title}
                          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                              {item.title}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${itemTypeInfo.color}`}
                            >
                              {itemTypeInfo.text.split(" ")[0]}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-2">
                            <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-600 truncate">
                              {item.location.split(",")[0]}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#2F3A63] text-sm">
                              {item.pay}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {item.posted}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <Link
                  to="/categories/gigs"
                  className="w-full text-center text-[#2F3A63] font-medium hover:text-[#1E2A4D] transition-colors text-sm inline-flex items-center justify-center gap-1"
                >
                  View All Gigs
                  <FaArrowLeft className="w-4 h-4 transform rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GigsDetails;
