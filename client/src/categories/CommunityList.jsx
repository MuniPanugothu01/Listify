// CommunityList.jsx (Updated to match HousingList style)
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
  Calendar,
  Users,
  Clock,
} from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function CommunityList() {
  const communityItems = Array.isArray(data?.community) ? data.community : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Enhanced filter states
  const [sortBy, setSortBy] = useState("newest");

  // Show only 6 cards per page (2 rows of 3 cards)
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [eventTypeFilter, locationFilter, dateFilter, searchTerm, sortBy]);

  // Get unique values for filters
  const uniqueLocations = [
    ...new Set(communityItems.map((item) => item.location)),
  ];

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

    return "community"; // default
  };

  // Date filter options
  const dateFilterOptions = [
    { value: "all", label: "All Dates" },
    { value: "upcoming", label: "Upcoming Events" },
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
  ];

  // Event type options
  const eventTypeOptions = [
    { value: "all", label: "All Event Types" },
    { value: "gardening", label: "Gardening" },
    { value: "education", label: "Education" },
    { value: "volunteer", label: "Volunteer" },
    { value: "arts", label: "Arts & Crafts" },
    { value: "entertainment", label: "Entertainment" },
    { value: "sports", label: "Sports & Fitness" },
    { value: "social", label: "Social" },
    { value: "food", label: "Food & Drink" },
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "date-asc", label: "Date: Soonest First" },
    { value: "date-desc", label: "Date: Latest First" },
    { value: "title", label: "Title A-Z" },
  ];

  const filteredItems = communityItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Get event type from extracted data
    const eventType = extractEventType(item);

    const matchesEventType =
      eventTypeFilter === "all" || eventType === eventTypeFilter;

    const matchesLocation =
      locationFilter === "" ||
      item.location.toLowerCase().includes(locationFilter.toLowerCase());

    // Date filtering
    const eventDate = new Date(item.date);
    const today = new Date();
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "upcoming" && eventDate >= today) ||
      (dateFilter === "this-week" && isThisWeek(eventDate)) ||
      (dateFilter === "this-month" && isThisMonth(eventDate));

    return matchesSearch && matchesEventType && matchesLocation && matchesDate;
  });

  // Helper functions for date filtering
  const isThisWeek = (date) => {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );
    return date >= startOfWeek && date <= endOfWeek;
  };

  const isThisMonth = (date) => {
    const today = new Date();
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    switch (sortBy) {
      case "date-asc":
        return dateA - dateB;
      case "date-desc":
        return dateB - dateA;
      case "title":
        return a.title.localeCompare(b.title);
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setEventTypeFilter("all");
    setDateFilter("all");
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
  };

  const clearAllFilters = () => {
    setEventTypeFilter("all");
    setLocationFilter("");
    setDateFilter("all");
    setSearchTerm("");
    setSortBy("newest");
  };

  // Get event type for display
  const getEventType = (item) => {
    return extractEventType(item);
  };

  // Get event type badge color
  const getEventTypeColor = (eventType) => {
    switch (eventType) {
      case "gardening":
        return "bg-green-100 text-green-800";
      case "education":
        return "bg-blue-100 text-blue-800";
      case "volunteer":
        return "bg-purple-100 text-purple-800";
      case "arts":
        return "bg-pink-100 text-pink-800";
      case "entertainment":
        return "bg-yellow-100 text-yellow-800";
      case "sports":
        return "bg-red-100 text-red-800";
      case "social":
        return "bg-indigo-100 text-indigo-800";
      case "food":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate pagination buttons with ellipsis
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

  // Different images for different event types
  const getEventImage = (item) => {
    const eventType = getEventType(item);

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[80vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome To Community
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with neighbors and join local events in your community.
            </p>
          </div>
        </div>

        {/* Search Tabs */}
        <div className="absolute bottom-14 left-0 right-0 flex justify-center z-10">
          <div className=" px-6 py-2 rounded-lg shadow-lg ">
            <div className="flex space-x-1">
              <button className="px-6 py-2 rounded-full text-sm font-medium bg-[#A5A9AC]/90 text-white rounded-lg">
                All Events
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section Overlay */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-10  max-w-5xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Event Type Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Event Type
                  </label>
                  <div className="relative">
                    <select
                      value={eventTypeFilter}
                      onChange={(e) => setEventTypeFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] appearance-none"
                    >
                      {eventTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] appearance-none"
                    >
                      <option value="">All Locations</option>
                      {uniqueLocations.map((location, index) => (
                        <option key={index} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Date Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] appearance-none"
                    >
                      {dateFilterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Search Button */}
                <div>
                  <button className="w-full bg-[#2F3A63] text-white py-3 px-6 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium flex items-center justify-center">
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
                Discover Community Events
              </h2>
              <p className="text-gray-500">
                Showing {Math.min(itemsPerPage, currentItems.length)} of{" "}
                {sortedItems.length} events
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

                {/* Event Type */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Event Type
                  </h4>
                  <select
                    value={eventTypeFilter}
                    onChange={(e) => setEventTypeFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {eventTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">Date</h4>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {dateFilterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Location
                  </h4>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
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

            {/* Events Grid */}
            <div className="flex-1">
              {sortedItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-xl mb-2">No events found</p>
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
                    {currentItems.map((item) => {
                      const eventType = getEventType(item);
                      const eventTypeColor = getEventTypeColor(eventType);

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="relative">
                            <img
                              src={getEventImage(item)}
                              alt={item.title}
                              className="w-full h-36 object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${eventTypeColor}`}
                              >
                                {eventType.charAt(0).toUpperCase() +
                                  eventType.slice(1)}
                              </span>
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(item.date)}
                              </span>
                            </div>
                          </div>

                          <div className="p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-base font-semibold text-[#2F3A63] line-clamp-1 flex-1">
                                {item.title}
                              </h3>
                            </div>

                            <p className="text-gray-500 text-xs mb-2 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>

                            <div className="flex items-center text-gray-500 mb-2">
                              <MapPin className="w-3 h-3 mr-1 text-[#2F3A63]" />
                              <span className="text-xs">{item.location}</span>
                            </div>

                            <div className="flex items-center justify-between text-gray-500 mb-3 text-xs">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1 text-[#2F3A63]" />
                                <span>{formatDate(item.date)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1 text-[#2F3A63]" />
                                <span>All Day</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Link
                                to={`/categories/community/${item.id}`}
                                className="flex-1 bg-[#2F3A63] text-white text-center py-2 px-3 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium text-sm"
                              >
                                View Details
                              </Link>
                              <button className="flex-1 border border-[#2F3A63] text-[#2F3A63] text-center py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                                RSVP
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

export default CommunityList;
