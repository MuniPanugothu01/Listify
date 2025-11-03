import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  RefreshCw,
  Clock,
  Star,
  MessageCircle,
  User,
  Calendar,
  Heart,
  Users,
  ThumbsUp,
  Eye,
} from "lucide-react";
import data from "../data/data.json";

function DiscussionForumsList() {
  const forums = data.discussionForums || [];
  const [savedItems, setSavedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Enhanced filter states
  const [datePostedFilter, setDatePostedFilter] = useState("any");
  const [popularityFilter, setPopularityFilter] = useState("any");
  const [minReplies, setMinReplies] = useState("");

  // Show only 6 cards per page (2 rows of 3 cards)
  const itemsPerPage = 6;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    authorFilter,
    categoryFilter,
    searchTerm,
    datePostedFilter,
    popularityFilter,
    sortBy,
    minReplies,
  ]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
    setSavedItems(saved);
  }, []);

  useEffect(() => {
    const loadSaved = () => {
      const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
      setSavedItems(saved);
    };

    window.addEventListener('savedItemsChanged', loadSaved);
    return () => window.removeEventListener('savedItemsChanged', loadSaved);
  }, []);

  const toggleSave = (forum) => {
    let newSaved;
    const isSaved = savedItems.some(i => i.id === forum.id);
    if (isSaved) {
      newSaved = savedItems.filter(i => i.id !== forum.id);
    } else {
      newSaved = [...savedItems, forum];
    }
    setSavedItems(newSaved);
    localStorage.setItem('savedItems', JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent('savedItemsChanged'));
  };

  // Get unique values for filters
  const uniqueAuthors = [...new Set(forums.map((forum) => forum.author))];
  
  // Get categories based on topic keywords (since your data doesn't have explicit categories)
  const getCategoryFromTopic = (topic) => {
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('park') || topicLower.includes('hiking') || topicLower.includes('garden')) {
      return "Outdoors";
    } else if (topicLower.includes('restaurant') || topicLower.includes('food') || topicLower.includes('brewery')) {
      return "Food & Drink";
    } else if (topicLower.includes('running') || topicLower.includes('fitness') || topicLower.includes('yoga')) {
      return "Fitness";
    } else if (topicLower.includes('vintage') || topicLower.includes('art') || topicLower.includes('craft')) {
      return "Arts & Crafts";
    } else if (topicLower.includes('music') || topicLower.includes('theater') || topicLower.includes('event')) {
      return "Entertainment";
    } else if (topicLower.includes('book') || topicLower.includes('tech') || topicLower.includes('coding')) {
      return "Education";
    } else {
      return "Community";
    }
  };

  const uniqueCategories = [...new Set(forums.map((forum) => getCategoryFromTopic(forum.topic)))];

  // Date posted options
  const datePostedOptions = [
    { value: "any", label: "Any time" },
    { value: "today", label: "Last 24 hours" },
    { value: "week", label: "Last 7 days" },
    { value: "month", label: "Last 30 days" },
  ];

  // Popularity options
  const popularityOptions = [
    { value: "any", label: "Any Popularity" },
    { value: "popular", label: "Popular" },
    { value: "trending", label: "Trending" },
    { value: "new", label: "New Discussions" },
  ];

  // Category options
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...uniqueCategories.map(category => ({ value: category, label: category }))
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
    { value: "replies", label: "Most Replies" },
    { value: "views", label: "Most Views" },
  ];

  // Calculate popularity score for filtering
  const getPopularityScore = (forum) => {
    const replies = forum.comments || 0;
    const views = forum.views || 0;
    const likes = forum.likes || 0;
    return replies * 2 + views + likes * 3;
  };

  // Generate random engagement metrics (for demo purposes)
  const getRandomEngagement = (forumId) => {
    const views = [1250, 890, 2100, 450, 3200, 1500, 800, 2700];
    const likes = [45, 23, 78, 12, 92, 34, 28, 67];
    return {
      views: views[forumId % views.length],
      likes: likes[forumId % likes.length]
    };
  };

  // Generate description from topic (since your data doesn't have descriptions)
  const generateDescription = (topic) => {
    return `Join the discussion about ${topic.toLowerCase()}. Share your experiences, ask questions, and connect with others interested in this topic.`;
  };

  const filteredForums = forums.filter((forum) => {
    const forumCategory = getCategoryFromTopic(forum.topic);
    
    const matchesSearch =
      forum.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forum.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      generateDescription(forum.topic)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forumCategory.toLowerCase().includes(searchTerm.toLowerCase());

    // Author filtering
    const matchesAuthor =
      authorFilter === "" || forum.author?.toLowerCase().includes(authorFilter.toLowerCase());

    // Category filtering
    const matchesCategory =
      categoryFilter === "all" || forumCategory === categoryFilter;

    // Replies filtering
    const replies = forum.comments || 0;
    const minRepliesNum = minReplies ? parseInt(minReplies) : 0;
    const matchesReplies = replies >= minRepliesNum;

    // Date posted filtering (simplified)
    const matchesDatePosted = datePostedFilter === "any" || true;

    // Popularity filtering
    const popularityScore = getPopularityScore(forum);
    const matchesPopularity = 
      popularityFilter === "any" || 
      (popularityFilter === "popular" && popularityScore > 50) ||
      (popularityFilter === "trending" && popularityScore > 100) ||
      (popularityFilter === "new" && replies < 10);

    return (
      matchesSearch &&
      matchesAuthor &&
      matchesCategory &&
      matchesReplies &&
      matchesDatePosted &&
      matchesPopularity
    );
  });

  // Sort filtered forums
  const sortedForums = [...filteredForums].sort((a, b) => {
    const repliesA = a.comments || 0;
    const repliesB = b.comments || 0;
    const viewsA = a.views || 0;
    const viewsB = b.views || 0;
    const popularityA = getPopularityScore(a);
    const popularityB = getPopularityScore(b);
    const dateA = new Date(a.posted || new Date());
    const dateB = new Date(b.posted || new Date());

    switch (sortBy) {
      case "popular":
        return popularityB - popularityA;
      case "replies":
        return repliesB - repliesA;
      case "views":
        return viewsB - viewsA;
      case "newest":
      default:
        return dateB - dateA;
    }
  });

  const indexOfLastForum = currentPage * itemsPerPage;
  const indexOfFirstForum = indexOfLastForum - itemsPerPage;
  const currentForums = sortedForums.slice(indexOfFirstForum, indexOfLastForum);
  const totalPages = Math.ceil(sortedForums.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setDatePostedFilter("any");
    setPopularityFilter("any");
    setMinReplies("");
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
  };

  const clearAllFilters = () => {
    setAuthorFilter("");
    setCategoryFilter("all");
    setMinReplies("");
    setSearchTerm("");
    setDatePostedFilter("any");
    setPopularityFilter("any");
    setSortBy("newest");
  };

  // Generate pagination buttons with ellipsis for better UX
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      buttons.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      }
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      if (start > 2) {
        buttons.push("...");
      }
      for (let i = start; i <= end; i++) {
        buttons.push(i);
      }
      if (end < totalPages - 1) {
        buttons.push("...");
      }
      buttons.push(totalPages);
    }

    return buttons;
  };

  // Render engagement metrics
  const renderEngagement = (forum) => {
    const engagement = getRandomEngagement(forum.id);
    return (
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <MessageCircle className="w-3 h-3 mr-1 text-blue-500" />
            <span>{forum.comments || 0}</span>
          </div>
          <div className="flex items-center">
            <ThumbsUp className="w-3 h-3 mr-1 text-green-500" />
            <span>{engagement.likes}</span>
          </div>
          <div className="flex items-center">
            <Eye className="w-3 h-3 mr-1 text-purple-500" />
            <span>{engagement.views}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[80vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Community Discussions</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Join vibrant conversations, share insights, and connect with like-minded people.
            </p>
          </div>
        </div>

        {/* Search and Filter Section Overlay */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-10 max-w-5xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Category Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] appearance-none"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Author Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Author
                  </label>
                  <div className="relative">
                    <select
                      value={authorFilter}
                      onChange={(e) => setAuthorFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] appearance-none"
                    >
                      <option value="">All Authors</option>
                      {uniqueAuthors.map((author, index) => (
                        <option key={index} value={author}>
                          {author}
                        </option>
                      ))}
                    </select>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Min Replies */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Min Replies
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      placeholder="Min Replies"
                      value={minReplies}
                      onChange={(e) => setMinReplies(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63]"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div>
                  <button className="w-full bg-[#2F3A63] text-white py-3 px-6  cursor-pointer rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium flex items-center justify-center">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#F3F3F3] lg:pt-20 max-md:pt-60 pb-8">
        <div className="container mx-auto px-4">
          {/* Back to Categories Button */}
          <div className="mb-6">
            <Link
              to="/categories"
              className="bg-[#2F3A63] text-white px-4 py-2 rounded-lg font-medium shadow-lg inline-block z-50 hover:bg-[#1E2A4D] transition-colors"
            >
              Back to Categories
            </Link>
          </div>

          {/* Results Count and Mobile Filter Toggle */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-4xl font-bold text-[#2F3A63] mb-1">
                Community Discussions
              </h2>
              <p className="text-gray-500">
                Showing {Math.min(itemsPerPage, currentForums.length)} of{" "}
                {sortedForums.length} discussions
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort By */}
              <div className="hidden sm:block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500 bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="sm:hidden bg-[#2F3A63] text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Enhanced Filters Sidebar */}
            <div
              className={`lg:w-80 ${
                showMobileFilters
                  ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
                  : "hidden lg:block"
              }`}
            >
              {/* Mobile Header */}
              {showMobileFilters && (
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <h3 className="text-xl font-bold text-[#2F3A63]">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Refresh Button */}
                <div className="flex justify-between items-center pb-4 border-b">
                  <h4 className="font-semibold text-lg text-[#2F3A63]">
                    Filter Options
                  </h4>
                  <button
                    onClick={resetFilters}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-500"
                    title="Reset Filters"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                </div>

                {/* Min Replies */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Minimum Replies
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Min Replies"
                        value={minReplies}
                        onChange={(e) => setMinReplies(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Category
                  </h4>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Author
                  </h4>
                  <select
                    value={authorFilter}
                    onChange={(e) => setAuthorFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    <option value="">All Authors</option>
                    {uniqueAuthors.map((author, index) => (
                      <option key={index} value={author}>
                        {author}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Posted */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Date Posted
                  </h4>
                  <select
                    value={datePostedFilter}
                    onChange={(e) => setDatePostedFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {datePostedOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Popularity Level */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Popularity
                  </h4>
                  <select
                    value={popularityFilter}
                    onChange={(e) => setPopularityFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {popularityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Apply Button for Mobile */}
                {showMobileFilters && (
                  <button
                    onClick={applyFilters}
                    className="w-full bg-[#2F3A63] text-white py-3 px-4 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium"
                  >
                    Apply Filters
                  </button>
                )}
              </div>
            </div>

            {/* Forums Grid */}
            <div className="flex-1">
              {sortedForums.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-xl mb-2">No discussions found</p>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search filters
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-[#2F3A63] text-white px-6 py-2 rounded-lg hover:bg-[#1E2A4D] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Mobile Sort */}
                  <div className="sm:hidden mb-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500 bg-white"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Compact Cards Grid - 2 rows (3 columns on desktop) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                    {currentForums.map((forum) => {
                      const engagement = getRandomEngagement(forum.id);
                      const isSaved = savedItems.some(i => i.id === forum.id);
                      const forumCategory = getCategoryFromTopic(forum.topic);
                      const description = generateDescription(forum.topic);

                      return (
                        <div
                          key={forum.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="relative">
                            <img
                              src={forum.images?.[0] || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                              alt={forum.topic}
                              className="w-full h-36 object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                forumCategory === "Outdoors" 
                                  ? "bg-green-100 text-green-800"
                                  : forumCategory === "Food & Drink"
                                  ? "bg-orange-100 text-orange-800"
                                  : forumCategory === "Fitness"
                                  ? "bg-blue-100 text-blue-800"
                                  : forumCategory === "Arts & Crafts"
                                  ? "bg-purple-100 text-purple-800"
                                  : forumCategory === "Entertainment"
                                  ? "bg-pink-100 text-pink-800"
                                  : forumCategory === "Education"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {forumCategory}
                              </span>
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                {forum.posted}
                              </span>
                            </div>
                            <div className="absolute bottom-2 right-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSave(forum);
                                }}
                                className="p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
                              >
                                <Heart 
                                  className={`w-4 h-4 transition-colors ${
                                    isSaved 
                                      ? 'fill-red-600 text-red-600' 
                                      : 'text-gray-400 hover:text-red-500'
                                  }`} 
                                />
                              </button>
                            </div>
                          </div>

                          <div className="p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-base font-semibold text-[#2F3A63] line-clamp-1 flex-1">
                                {forum.topic}
                              </h3>
                            </div>

                            <div className="flex items-center text-gray-600 mb-2">
                              <User className="w-3 h-3 mr-1 text-[#2F3A63]" />
                              <span className="text-sm font-medium">{forum.author}</span>
                            </div>

                            <p className="text-gray-500 text-xs mb-2 line-clamp-2 leading-relaxed">
                              {description}
                            </p>

                            {renderEngagement(forum)}

                            <div className="flex gap-2 mt-3">
                              {/* FIXED ROUTE HERE */}
                              <Link
                                to={`/categories/discussion-forums/${forum.id}`}
                                className="flex-1 bg-[#2F3A63] text-white text-center py-2 px-3 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium text-sm"
                              >
                                View Discussion
                              </Link>
                              <button className="flex-1 border border-[#2F3A63] text-[#2F3A63] text-center  cursor-pointer py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                                Join Chat
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center items-center space-x-2 gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center text-gray-500 font-medium"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </button>

                      {renderPaginationButtons().map((page, index) =>
                        page === "..." ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-3 py-2 text-gray-500"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                              currentPage === page
                                ? "bg-[#2F3A63] text-white"
                                : "border border-gray-300 hover:bg-gray-100 text-gray-500"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center text-gray-500 font-medium"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussionForumsList;