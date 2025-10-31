// CommunityDetails.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import {
  MapPin,
  Mail,
  Heart,
  Share2,
  Calendar,
  Star,
  ArrowLeft,
  ExternalLink,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function CommunityDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    try {
      const foundItem = data.community.find((i) => i.id === parseInt(id));
      if (!foundItem) {
        setError("Event not found");
      } else {
        setItem(foundItem);
        setSelectedImage(getEventImage(foundItem));
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load event data");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
    setSavedItems(saved);
  }, [id]);

  const isSaved = savedItems.some((h) => h.id === item?.id);

  const toggleSave = () => {
    if (!item) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedItems.filter((h) => h.id !== item.id);
    } else {
      newSaved = [...savedItems, item];
    }
    setSavedItems(newSaved);
    localStorage.setItem("savedItems", JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent("savedItemsChanged"));
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
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

  // Extract event type from title/description
  const extractEventType = (item) => {
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();

    if (title.includes("garden") || description.includes("garden"))
      return "gardening";
    if (title.includes("book") || description.includes("book"))
      return "education";
    if (title.includes("cleanup") || description.includes("clean"))
      return "volunteer";
    if (title.includes("art") || description.includes("workshop"))
      return "arts";
    if (title.includes("dance") || description.includes("music"))
      return "entertainment";
    if (title.includes("pet") || description.includes("animal"))
      return "animals";
    if (title.includes("food") || description.includes("cook")) return "food";
    if (title.includes("run") || description.includes("fitness"))
      return "sports";
    if (title.includes("movie") || description.includes("film"))
      return "entertainment";
    if (title.includes("history") || description.includes("tour"))
      return "education";
    if (title.includes("charity") || description.includes("fundraiser"))
      return "volunteer";
    if (title.includes("game") || description.includes("trivia"))
      return "social";
    if (title.includes("picnic") || description.includes("social"))
      return "social";
    if (title.includes("farming") || description.includes("market"))
      return "shopping";
    if (title.includes("tech") || description.includes("computer"))
      return "education";
    if (title.includes("holiday") || description.includes("festival"))
      return "celebration";

    return "community";
  };

  // Different images for different event types
  const getEventImage = (item) => {
    const eventType = extractEventType(item);

    switch (eventType) {
      case "gardening":
        return "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "education":
        return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "volunteer":
        return "https://images.unsplash.com/photo-1549923746-7c0bdf0955bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "arts":
        return "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "entertainment":
        return "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "sports":
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "social":
        return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "food":
        return "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      default:
        return "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    }
  };

  // Get event type badge color
  const getEventTypeColor = (eventType) => {
    switch (eventType) {
      case "gardening":
        return "bg-green-100 text-green-800 border border-green-200";
      case "education":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "volunteer":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "arts":
        return "bg-pink-100 text-pink-800 border border-pink-200";
      case "entertainment":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "sports":
        return "bg-red-100 text-red-800 border border-red-200";
      case "social":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "food":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Extract features from description
  const extractFeatures = (description) => {
    const features = [];
    if (description.toLowerCase().includes("family")) features.push("Family Friendly");
    if (description.toLowerCase().includes("free")) features.push("Free Event");
    if (description.toLowerCase().includes("outdoor")) features.push("Outdoor Activity");
    if (description.toLowerCase().includes("indoor")) features.push("Indoor Activity");
    if (description.toLowerCase().includes("workshop")) features.push("Hands-on Workshop");
    if (description.toLowerCase().includes("networking")) features.push("Networking Opportunity");
    if (description.toLowerCase().includes("educational")) features.push("Educational");
    if (description.toLowerCase().includes("fun")) features.push("Fun & Engaging");
    if (description.toLowerCase().includes("community")) features.push("Community Building");
    if (description.toLowerCase().includes("beginner")) features.push("Beginner Friendly");

    // Add default features if none found
    if (features.length === 0) {
      features.push(
        "Community Event",
        "Social Gathering",
        "All Ages Welcome",
        "Local Participation"
      );
    }

    return features.slice(0, 6);
  };

  // Get similar events (exclude current event)
  const getSimilarEvents = () => {
    if (!item) return [];
    return data.community.filter((e) => e.id !== item.id).slice(0, 6);
  };

  // Extract event details
  const extractEventDetails = (item) => {
    return {
      duration: "2-3 hours",
      capacity: "50-100 people",
      ageGroup: "All Ages",
      requirements: "None",
      organizer: "Community Center",
      contact: item.contactEmail || "community@example.com",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F3A63] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist.
          </p>
          <Link
            to="/categories/community"
            className="bg-[#2F3A63] text-white px-6 py-3 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const eventType = extractEventType(item);
  const eventTypeColor = getEventTypeColor(eventType);
  const features = extractFeatures(item.description);
  const eventDetails = extractEventDetails(item);
  const similarEvents = getSimilarEvents();
  
  // Create multiple image thumbnails using the same main image
  const displayImages = [
    getEventImage(item),
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1549923746-7c0bdf0955bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/categories/community"
              className="inline-flex items-center text-[#2F3A63] font-medium hover:text-[#1E2A4D] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Events
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={shareEvent}
                className="p-2 text-gray-600 hover:text-[#2F3A63] transition-colors relative"
              >
                <Share2 className="w-5 h-5" />
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={copyLink}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-t-lg flex items-center gap-3"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Copy Link
                    </button>
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-b-lg flex items-center gap-3">
                      <Mail className="w-4 h-4" />
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
                <Heart className={`w-5 h-5 ${isSaved ? "fill-red-600" : ""}`} />
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
            {/* Image Gallery - Modern Style */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt={item.title}
                  className="w-full h-100 object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${eventTypeColor}`}>
                    {eventType.charAt(0).toUpperCase() + eventType.slice(1)} Event
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4 grid grid-cols-4 gap-3">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? "ring-opacity-20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${item.title} - ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header with Title */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Event Stats */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {/* Date */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Calendar className="w-6 h-6 text-[#2F3A63]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Date</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {formatDate(item.date)}
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Clock className="w-6 h-6 text-[#2F3A63]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Time</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        All Day
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Users className="w-6 h-6 text-[#2F3A63]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Duration</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {eventDetails.duration}
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Star className="w-6 h-6 text-[#2F3A63]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Capacity</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {eventDetails.capacity}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Event Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <Users className="w-5 h-5 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Age Group</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {eventDetails.ageGroup}
                    </div>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-5 h-5 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Requirements</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {eventDetails.requirements}
                    </div>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-5 h-5 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Organizer</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {eventDetails.organizer}
                    </div>
                  </div>
                  <div className="text-center">
                    <Mail className="w-5 h-5 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Contact</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {eventDetails.contact}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="px-6 flex space-x-8 overflow-x-auto">
                  {["overview", "location", "details"].map((tab) => (
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
                        Event Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Event Features
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "location" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Event Location
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {item.location}
                      </p>

                      <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200">
                        <iframe
                          title="Event Location Map"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(
                            item.location
                          )}&output=embed&zoom=15`}
                          className="border-0"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Event Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Event Type</span>
                            <span className="font-medium capitalize">
                              {eventType}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Date</span>
                            <span className="font-medium">
                              {formatDate(item.date)}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Time</span>
                            <span className="font-medium">All Day</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Duration</span>
                            <span className="font-medium">
                              {eventDetails.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Participation Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Age Group</span>
                            <span className="font-medium">
                              {eventDetails.ageGroup}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Capacity</span>
                            <span className="font-medium">
                              {eventDetails.capacity}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Requirements</span>
                            <span className="font-medium">
                              {eventDetails.requirements}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Cost</span>
                            <span className="font-medium text-green-600">
                              Free
                            </span>
                          </div>
                        </div>
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
                Contact Organizer
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://www.shutterstock.com/image-photo/confident-smiling-middle-aged-business-260nw-2451544833.jpg"
                  alt={item.sellerName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {item.sellerName}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Community Event Organizer
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      (18 reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${item.contactEmail}?subject=Inquiry about ${item.title}`}
                  className="w-full bg-[#2F3A63] text-white py-3 px-4 rounded-lg cursor-pointer hover:bg-[#1E2A4D] transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Organizer
                </a>

                <button className="w-full border border-[#2F3A63] text-[#2F3A63] py-3 px-4 rounded-lg hover:bg-[#2F3A63] hover:text-white transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <FaComments className="w-4 h-4" />
                  Chat with Organizer
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Posted {item.posted}
                </div>
              </div>
            </div>

            {/* Join Event Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Join This Event
              </h3>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800">Free to Join</div>
                      <div className="text-sm text-green-600">No registration fee required</div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <Users className="w-5 h-5" />
                  Register for Event
                </button>

                <p className="text-sm text-gray-600 text-center">
                  By registering, you'll receive event reminders and updates
                </p>
              </div>
            </div>

            {/* Similar Events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#2F3A63]" />
                  Similar Events ({similarEvents.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {similarEvents.map((similarEvent) => {
                  const similarEventType = extractEventType(similarEvent);
                  const similarEventTypeColor = getEventTypeColor(similarEventType);
                  
                  return (
                    <Link
                      key={similarEvent.id}
                      to={`/categories/community/${similarEvent.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex gap-3">
                        <img
                          src={getEventImage(similarEvent)}
                          alt={similarEvent.title}
                          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                              {similarEvent.title}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${similarEventTypeColor}`}
                            >
                              {similarEventType.charAt(0).toUpperCase() + similarEventType.slice(1)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-600 truncate">
                              {similarEvent.location.split(",")[0]}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(similarEvent.date)}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {similarEvent.posted}
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
                  to="/categories/community"
                  className="w-full text-center text-[#2F3A63] font-medium hover:text-[#1E2A4D] transition-colors text-sm inline-flex items-center justify-center gap-1"
                >
                  View All Events
                  <ArrowLeft className="w-4 h-4 transform rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetails;