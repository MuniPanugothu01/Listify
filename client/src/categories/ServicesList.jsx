// ServicesList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Search,
  DollarSign,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  RefreshCw,
  Clock,
  Star,
  User,
} from "lucide-react";
import data from "../data/data.json";

function ServicesList() {
  const services = data.services || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Enhanced filter states
  const [datePostedFilter, setDatePostedFilter] = useState("any");
  const [experienceFilter, setExperienceFilter] = useState("any");
  const [sortBy, setSortBy] = useState("newest");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Show only 6 cards per page (2 rows of 3 cards)
  const itemsPerPage = 6;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    serviceTypeFilter,
    maxPrice,
    locationFilter,
    searchTerm,
    datePostedFilter,
    experienceFilter,
    sortBy,
    ratingFilter,
  ]);

  // Get unique values for filters
  const uniqueLocations = [...new Set(services.map((service) => service.location))];
  const uniqueServiceTypes = [
    "all",
    "cleaning",
    "repair",
    "pet",
    "creative",
    "education",
    "health",
    "technical",
  ];

  // Date posted options
  const datePostedOptions = [
    { value: "any", label: "Any time" },
    { value: "today", label: "Last 24 hours" },
    { value: "week", label: "Last 7 days" },
    { value: "month", label: "Last 30 days" },
  ];

  // Experience options
  const experienceOptions = [
    { value: "any", label: "Any Experience" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" },
  ];

  // Service type options
  const serviceTypeOptions = [
    { value: "all", label: "All Services" },
    { value: "cleaning", label: "Cleaning" },
    { value: "repair", label: "Repair" },
    { value: "pet", label: "Pet Care" },
    { value: "creative", label: "Creative" },
    { value: "education", label: "Education" },
    { value: "health", label: "Health & Fitness" },
    { value: "technical", label: "Technical" },
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  // Rating options
  const ratingOptions = [
    { value: "all", label: "Any Rating" },
    { value: "4", label: "4+ Stars" },
    { value: "3", label: "3+ Stars" },
    { value: "2", label: "2+ Stars" },
  ];

  // Extract service type from title/description
  const extractServiceType = (service) => {
    const title = service.title.toLowerCase();
    const description = service.description.toLowerCase();

    if (title.includes("clean") || description.includes("clean")) return "cleaning";
    if (title.includes("repair") || description.includes("repair") || 
        title.includes("fix") || description.includes("fix")) return "repair";
    if (title.includes("dog") || title.includes("pet") || 
        description.includes("dog") || description.includes("pet")) return "pet";
    if (title.includes("design") || title.includes("photo") || 
        title.includes("creative") || description.includes("design")) return "creative";
    if (title.includes("tutor") || title.includes("lesson") || 
        description.includes("learn") || description.includes("teach")) return "education";
    if (title.includes("train") || title.includes("fitness") || 
        title.includes("yoga") || description.includes("fitness")) return "health";
    if (title.includes("web") || title.includes("seo") || 
        title.includes("development") || description.includes("technical")) return "technical";
    
    return "repair"; // default
  };

  // Generate random rating for services (for demo purposes)
  const getRandomRating = (serviceId) => {
    const ratings = [4.2, 4.5, 4.8, 4.0, 4.7, 4.9, 4.3, 4.6];
    return ratings[serviceId % ratings.length];
  };

  // Generate random review count
  const getRandomReviewCount = (serviceId) => {
    const counts = [12, 8, 25, 15, 32, 7, 18, 21];
    return counts[serviceId % counts.length];
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Price filtering
    const priceNum = parseInt((service.pay || "0").replace(/[^0-9]/g, ""), 10) || 0;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = priceNum <= maxPriceNum;

    const matchesLocation =
      locationFilter === "" || service.location?.toLowerCase().includes(locationFilter.toLowerCase());

    // Service type filtering
    const serviceType = extractServiceType(service);
    const matchesServiceType =
      serviceTypeFilter === "all" || serviceType === serviceTypeFilter;

    // Date posted filtering (simplified)
    const matchesDatePosted = datePostedFilter === "any" || true;

    // Experience filtering (simplified)
    const matchesExperience = experienceFilter === "any" || true;

    // Rating filtering
    const rating = getRandomRating(service.id);
    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "4" && rating >= 4) ||
      (ratingFilter === "3" && rating >= 3) ||
      (ratingFilter === "2" && rating >= 2);

    return (
      matchesSearch &&
      matchesPrice &&
      matchesLocation &&
      matchesServiceType &&
      matchesDatePosted &&
      matchesExperience &&
      matchesRating
    );
  });

  // Sort filtered services
  const sortedServices = [...filteredServices].sort((a, b) => {
    const priceA = parseInt((a.pay || "0").replace(/[^0-9]/g, ""), 10) || 0;
    const priceB = parseInt((b.pay || "0").replace(/[^0-9]/g, ""), 10) || 0;
    const ratingA = getRandomRating(a.id);
    const ratingB = getRandomRating(b.id);

    switch (sortBy) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "rating":
        return ratingB - ratingA;
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = sortedServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setDatePostedFilter("any");
    setExperienceFilter("any");
    setRatingFilter("all");
    setServiceTypeFilter("all");
    setMaxPrice("");
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
  };

  const clearAllFilters = () => {
    setServiceTypeFilter("all");
    setMaxPrice("");
    setLocationFilter("");
    setSearchTerm("");
    setDatePostedFilter("any");
    setExperienceFilter("any");
    setSortBy("newest");
    setRatingFilter("all");
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

  // Get service type for display
  const getServiceType = (service) => {
    return extractServiceType(service);
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[80vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Professional Services</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with trusted professionals for all your service needs in the community.
            </p>
          </div>
        </div>

        {/* Search and Filter Section Overlay */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-10 max-w-5xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Service Type Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Service Type
                  </label>
                  <div className="relative">
                    <select
                      value={serviceTypeFilter}
                      onChange={(e) => setServiceTypeFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] appearance-none"
                    >
                      {serviceTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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

                {/* Max Price */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Max Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63]"
                    />
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
                Discover Our Services
              </h2>
              <p className="text-gray-500">
                Showing {Math.min(itemsPerPage, currentServices.length)} of{" "}
                {sortedServices.length} services
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

                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Service Type
                  </h4>
                  <select
                    value={serviceTypeFilter}
                    onChange={(e) => setServiceTypeFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {serviceTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Minimum Rating
                  </h4>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {ratingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
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

                {/* Experience Level */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Experience Level
                  </h4>
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {experienceOptions.map((option) => (
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

            {/* Services Grid */}
            <div className="flex-1">
              {sortedServices.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-xl mb-2">No services found</p>
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
                    {currentServices.map((service) => {
                      const serviceType = getServiceType(service);
                      const rating = getRandomRating(service.id);
                      const reviewCount = getRandomReviewCount(service.id);

                      return (
                        <div
                          key={service.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="relative">
                            <img
                              src={service.images?.[0]}
                              alt={service.title}
                              className="w-full h-36 object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <span className="bg-[#2F3A63] text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                                {serviceType}
                              </span>
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                {service.posted || "Recently"}
                              </span>
                            </div>
                          </div>

                          <div className="p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-base font-semibold text-[#2F3A63] line-clamp-1 flex-1">
                                {service.title}
                              </h3>
                            </div>

                            <p className="text-gray-500 text-xs mb-2 line-clamp-2 leading-relaxed">
                              {service.description}
                            </p>

                            <div className="flex items-center text-gray-500 mb-2">
                              <MapPin className="w-3 h-3 mr-1 text-[#2F3A63]" />
                              <span className="text-xs">{service.location}</span>
                            </div>

                            <div className="flex items-center justify-between text-gray-500 mb-3 text-xs">
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1 text-[#2F3A63]" />
                                <span>Available Now</span>
                              </div>
                              {renderStars(rating)}
                            </div>

                            <div className="flex justify-between items-center mb-3">
                              <span className="text-lg font-bold text-green-600">
                                {service.pay}
                              </span>
                              <span className="text-xs text-gray-500">
                                {reviewCount} reviews
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Link
                                to={`/categories/services/${service.id}`}
                                className="flex-1 bg-[#2F3A63] text-white text-center py-2 px-3 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium text-sm"
                              >
                                View Details
                              </Link>
                              <button className="flex-1 border border-[#2F3A63] text-[#2F3A63] text-center py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                                Contact
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

export default ServicesList;