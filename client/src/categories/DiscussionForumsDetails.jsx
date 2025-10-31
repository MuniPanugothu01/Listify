import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaShareAlt,
  FaHeart,
  FaEnvelope,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaUser,
  FaComments,
  FaUsers,
  FaTag,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaBookmark,
} from "react-icons/fa";

// Import your JSON data
import data from "../data/data.json";

function DiscussionForumsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    try {
      const foundForum = data.discussionForums.find(
        (f) => f.id === parseInt(id)
      );
      if (!foundForum) {
        setError("Forum not found");
      } else {
        setForum(foundForum);
        // Ensure we have at least one image
        if (foundForum.images && foundForum.images.length > 0) {
          setSelectedImage(foundForum.images[0]);
        }
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load forum data");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
    setSavedItems(saved);
  }, [id]);

  const isSaved = savedItems.some((f) => f.id === forum?.id);

  const toggleSave = () => {
    if (!forum) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedItems.filter((f) => f.id !== forum.id);
    } else {
      newSaved = [...savedItems, forum];
    }
    setSavedItems(newSaved);
    localStorage.setItem("savedItems", JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent("savedItemsChanged"));
  };

  const shareForum = () => {
    if (navigator.share) {
      navigator.share({
        title: forum.topic,
        text: forum.topic,
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

  // Handle navigation to similar discussion
  const handleSimilarDiscussionClick = (forumId) => {
    navigate(`/categories/discussion-forums/${forumId}`);
    window.scrollTo(0, 0);
  };

  // Extract features from topic
  const extractFeatures = (topic) => {
    const features = [];
    if (!topic) return features;

    if (
      topic.toLowerCase().includes("community") ||
      topic.toLowerCase().includes("group")
    )
      features.push("Active Community");
    if (
      topic.toLowerCase().includes("best") ||
      topic.toLowerCase().includes("professional")
    )
      features.push("Expert Recommendations");
    if (
      topic.toLowerCase().includes("support") ||
      topic.toLowerCase().includes("help")
    )
      features.push("Supportive Environment");
    if (
      topic.toLowerCase().includes("learn") ||
      topic.toLowerCase().includes("education")
    )
      features.push("Learning Opportunity");
    if (
      topic.toLowerCase().includes("network") ||
      topic.toLowerCase().includes("connect")
    )
      features.push("Networking");
    if (
      topic.toLowerCase().includes("discuss") ||
      topic.toLowerCase().includes("talk")
    )
      features.push("Open Discussion");

    // Add default features if none found
    if (features.length === 0) {
      features.push(
        "Friendly Community",
        "Knowledge Sharing",
        "Respectful Dialogue",
        "Diverse Perspectives"
      );
    }

    return features.slice(0, 6);
  };

  // Get similar forums (exclude current forum)
  const getSimilarForums = () => {
    if (!forum) return [];
    return data.discussionForums.filter((f) => f.id !== forum.id).slice(0, 6);
  };

  // Get category info based on topic keywords
  const getCategoryInfo = (topic) => {
    const topicLower = topic.toLowerCase();

    if (
      topicLower.includes("park") ||
      topicLower.includes("hiking") ||
      topicLower.includes("garden")
    ) {
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        text: "Outdoors",
      };
    } else if (
      topicLower.includes("restaurant") ||
      topicLower.includes("food") ||
      topicLower.includes("brewery")
    ) {
      return {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        text: "Food & Drink",
      };
    } else if (
      topicLower.includes("running") ||
      topicLower.includes("fitness") ||
      topicLower.includes("yoga")
    ) {
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        text: "Fitness",
      };
    } else if (
      topicLower.includes("vintage") ||
      topicLower.includes("art") ||
      topicLower.includes("craft")
    ) {
      return {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        text: "Arts & Crafts",
      };
    } else if (
      topicLower.includes("music") ||
      topicLower.includes("theater") ||
      topicLower.includes("event")
    ) {
      return {
        color: "bg-pink-100 text-pink-800 border-pink-200",
        text: "Entertainment",
      };
    } else if (
      topicLower.includes("book") ||
      topicLower.includes("tech") ||
      topicLower.includes("coding")
    ) {
      return {
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        text: "Education",
      };
    } else {
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        text: "Community",
      };
    }
  };

  // Generate display images - always show exactly 4 images
  const getDisplayImages = () => {
    if (!forum || !forum.images || forum.images.length === 0) {
      // Return default images if no images available
      return [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      ];
    }

    const availableImages = [...forum.images];

    // If we have less than 4 images, duplicate the available ones to make 4
    while (availableImages.length < 4) {
      availableImages.push(availableImages[availableImages.length - 1]);
    }

    // If we have more than 4 images, take only the first 4
    return availableImages.slice(0, 4);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F3A63] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading forum details...</p>
        </div>
      </div>
    );
  }

  if (error || !forum) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaComments className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Forum Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The discussion forum you're looking for doesn't exist.
          </p>
          <Link
            to="/categories/discussion-forums"
            className="bg-[#2F3A63] text-white px-6 py-3 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium inline-flex items-center"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Discussions
          </Link>
        </div>
      </div>
    );
  }

  const features = extractFeatures(forum.topic);
  const similarForums = getSimilarForums();
  const categoryInfo = getCategoryInfo(forum.topic);
  const displayImages = getDisplayImages();

  // Generate description based on topic
  const generateDescription = (forum) => {
    return `Join the discussion about ${forum.topic.toLowerCase()}. This community brings together people interested in sharing experiences, recommendations, and knowledge about this topic. With ${
      forum.comments
    } comments already, it's an active community waiting for your input!`;
  };

  const description = generateDescription(forum);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/categories/discussion-forums"
              className="inline-flex items-center text-[#2F3A63] font-medium hover:text-[#1E2A4D] transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Discussions
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={shareForum}
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
                  src={selectedImage || displayImages[0]}
                  alt={forum.topic}
                  className="w-full h-100 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                  }}
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${categoryInfo.color} border`}
                  >
                    {categoryInfo.text}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                    {forum.posted}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery - Always show 4 images */}
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
                      alt={`${forum.topic} - ${index + 1}`}
                      className="w-full h-[100px] object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Forum Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {forum.topic}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaUser className="w-4 h-4" />
                      <span className="font-medium">By {forum.author}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#2F3A63] mb-1">
                      {forum.comments}+
                    </div>
                    <div className="text-sm text-gray-500">Active Comments</div>
                  </div>
                </div>

                {/* Forum Stats */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    {/* Comments */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 border border-gray-200">
                        <FaComments className="w-4 h-4 text-[#2F3A63]" />
                      </div>
                      <div className="text-xs text-gray-600 mb-1">Comments</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {forum.comments}
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-px h-8 bg-gray-300 mx-2"></div>

                    {/* Members */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 border border-gray-200">
                        <FaUsers className="w-4 h-4 text-[#2F3A63]" />
                      </div>
                      <div className="text-xs text-gray-600 mb-1">Members</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        250+
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-px h-8 bg-gray-300 mx-2"></div>

                    {/* Activity */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 border border-gray-200">
                        <FaClock className="w-4 h-4 text-[#2F3A63]" />
                      </div>
                      <div className="text-xs text-gray-600 mb-1">Activity</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        High
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
                      {forum.posted}
                    </div>
                  </div>
                  <div className="text-center">
                    <FaTag className="w-4 h-4 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Category</div>
                    <div className="font-semibold text-gray-900 text-xs">
                      {categoryInfo.text}
                    </div>
                  </div>
                  <div className="text-center">
                    <FaStar className="w-4 h-4 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Rating</div>
                    <div className="font-semibold text-gray-900 text-xs">
                      4.8/5
                    </div>
                  </div>
                  <div className="text-center">
                    <FaBookmark className="w-4 h-4 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Status</div>
                    <div className="font-semibold text-gray-900 text-xs">
                      Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="px-6 flex space-x-8">
                  {["overview", "discussion", "community"].map((tab) => (
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
                        Discussion Topic
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Community Features
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

                {activeTab === "discussion" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Discussion Guidelines
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Be Respectful</span>
                          <span className="font-medium">Always</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Stay on Topic</span>
                          <span className="font-medium">Required</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">No Spam</span>
                          <span className="font-medium">Strictly Enforced</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Share Knowledge</span>
                          <span className="font-medium">Encouraged</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Recent Activity
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Last Comment</span>
                          <span className="font-medium">2 hours ago</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">New Members</span>
                          <span className="font-medium">15 this week</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Discussion Pace</span>
                          <span className="font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "community" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Community Information
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Join our vibrant community of like-minded individuals
                        who share interests in {categoryInfo.text.toLowerCase()}
                        . This forum is moderated to ensure quality discussions
                        and a welcoming environment for all participants.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2F3A63]">
                            250+
                          </div>
                          <div className="text-sm text-gray-600">
                            Active Members
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2F3A63]">
                            1.2K
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Posts
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2F3A63]">
                            98%
                          </div>
                          <div className="text-sm text-gray-600">
                            Positive Rating
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Community Guidelines
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Respect All Members
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Treat everyone with respect and kindness
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Share Knowledge
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Contribute valuable insights and experiences
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Stay on Topic
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Keep discussions relevant to the forum theme
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              No Self-Promotion
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Focus on helping others, not promoting yourself
                            </p>
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
            {/* Join Discussion Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Join Discussion
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2F3A63] to-[#4A5FC1] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {forum.author?.charAt(0) || "A"}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {forum.author}
                  </h4>
                  <p className="text-gray-600 text-sm">Discussion Starter</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      (45 reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-[#2F3A63] text-white py-3 px-4 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium flex items-center justify-center gap-2">
                  <FaComments className="w-4 h-4" />
                  Join Discussion
                </button>

                <button className="w-full border border-[#2F3A63] text-[#2F3A63] py-3 px-4 rounded-lg hover:bg-[#2F3A63] hover:text-white transition-colors font-medium flex items-center justify-center gap-2">
                  <FaEnvelope className="w-4 h-4" />
                  Message Creator
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  <FaCalendarAlt className="w-4 h-4 inline mr-1" />
                  Started {forum.posted}
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUsers className="w-5 h-5 text-[#2F3A63]" />
                Community Stats
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Members</span>
                  <span className="font-semibold text-gray-900">250+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Now</span>
                  <span className="font-semibold text-green-600">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">New Today</span>
                  <span className="font-semibold text-blue-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discussion Rating</span>
                  <span className="font-semibold text-yellow-600">4.8/5</span>
                </div>
              </div>
            </div>

            {/* Similar Discussions - FIXED NAVIGATION */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FaComments className="w-5 h-5 text-[#2F3A63]" />
                  Similar Discussions
                </h3>
              </div>

              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {similarForums.map((item) => {
                  const itemCategoryInfo = getCategoryInfo(item.topic);
                  const itemImages =
                    item.images && item.images.length > 0
                      ? item.images
                      : [
                          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                        ];

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSimilarDiscussionClick(item.id)}
                      className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer"
                    >
                      <div className="flex gap-3">
                        <img
                          src={itemImages[0]}
                          alt={item.topic}
                          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                              {item.topic}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${itemCategoryInfo.color} border`}
                            >
                              {itemCategoryInfo.text}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-2">
                            <FaUser className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-600 truncate">
                              {item.author}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#2F3A63] text-sm">
                              {item.comments} comments
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {item.posted}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <Link
                  to="/categories/discussion-forums"
                  className="w-full text-center text-[#2F3A63] font-medium hover:text-[#1E2A4D] transition-colors text-sm inline-flex items-center justify-center gap-1"
                >
                  View All Discussions
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

export default DiscussionForumsDetails;
