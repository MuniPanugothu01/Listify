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
  Calendar,
  Tag,
  Heart,
} from "lucide-react";
import data from "../data/data.json";

function ForSaleList() {
  const forSaleItems = Array.isArray(data?.marketplace) ? data.marketplace : [];
  const [savedItems, setSavedItems] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("any");
  const [datePostedFilter, setDatePostedFilter] = useState("any");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const itemsPerPage = 8; // 2 rows of 4 items

  useEffect(() => {
    setCurrentPage(1);
  }, [
    maxPrice,
    locationFilter,
    searchTerm,
    conditionFilter,
    datePostedFilter,
    sortBy,
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

  const toggleSave = (item) => {
    let newSaved;
    const isSaved = savedItems.some(i => i.id === item.id);
    if (isSaved) {
      newSaved = savedItems.filter(i => i.id !== item.id);
    } else {
      newSaved = [...savedItems, item];
    }
    setSavedItems(newSaved);
    localStorage.setItem('savedItems', JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent('savedItemsChanged'));
  };

  // Get unique values for filters
  const uniqueLocations = [
    ...new Set(
      forSaleItems.map((item) => item?.location || "").filter(Boolean)
    ),
  ];

  // Date posted options
  const datePostedOptions = [
    { value: "any", label: "Any time" },
    { value: "today", label: "Last 24 hours" },
    { value: "week", label: "Last 7 days" },
    { value: "month", label: "Last 30 days" },
  ];

  // Condition options
  const conditionOptions = [
    { value: "any", label: "Any Condition" },
    { value: "New", label: "New" },
    { value: "Like New", label: "Like New" },
    { value: "Good", label: "Good" },
    { value: "Fair", label: "Fair" },
    { value: "Poor", label: "Poor" },
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "condition", label: "Best Condition" },
  ];

  // Parse price safely
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    if (priceString === "Free") return 0;
    if (priceString === "Negotiable") return 0;
    try {
      return parseInt(priceString.replace(/[$,]/g, ""), 10) || 0;
    } catch {
      return 0;
    }
  };

  const filteredItems = forSaleItems.filter((item) => {
    const title = item?.title ?? "";
    const location = item?.location ?? "";
    const description = item?.description ?? "";
    const condition = item?.condition ?? "";
    const posted = item?.posted ?? "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    // Price filtering
    const priceNum = parsePrice(item?.price);
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = priceNum <= maxPriceNum;

    // Location filtering
    const matchesLocation =
      locationFilter === "" ||
      location.toLowerCase().includes(locationFilter.toLowerCase());

    // Condition filtering
    const matchesCondition =
      conditionFilter === "any" || condition === conditionFilter;

    // Date posted filtering
    const matchesDatePosted = datePostedFilter === "any" || true;

    return (
      matchesSearch &&
      matchesPrice &&
      matchesLocation &&
      matchesCondition &&
      matchesDatePosted
    );
  });

  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    const priceA = parsePrice(a?.price);
    const priceB = parsePrice(b?.price);

    switch (sortBy) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "condition":
        const conditionOrder = {
          New: 5,
          "Like New": 4,
          Good: 3,
          Fair: 2,
          Poor: 1,
        };
        return (
          (conditionOrder[b.condition] || 0) -
          (conditionOrder[a.condition] || 0)
        );
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
    setConditionFilter("any");
    setDatePostedFilter("any");
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
  };

  const clearAllFilters = () => {
    setMaxPrice("");
    setLocationFilter("");
    setConditionFilter("any");
    setDatePostedFilter("any");
    setSearchTerm("");
    setSortBy("newest");
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

  // Get condition badge color
  const getConditionColor = (condition) => {
    switch (condition) {
      case "New":
        return "bg-green-100 text-green-800";
      case "Like New":
        return "bg-blue-100 text-blue-800";
      case "Good":
        return "bg-emerald-100 text-emerald-800";
      case "Fair":
        return "bg-yellow-100 text-yellow-800";
      case "Poor":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get type badge color and text
  const getTypeInfo = (type) => {
    switch (type) {
      case "sale":
        return { color: "bg-red-100 text-red-800", text: "For Sale" };
      case "free":
        return { color: "bg-green-100 text-green-800", text: "Free" };
      case "wanted":
        return { color: "bg-purple-100 text-purple-800", text: "Wanted" };
      default:
        return { color: "bg-gray-100 text-gray-800", text: type };
    }
  };

  // Different images for different item types
  const getItemImage = (item) => {
    const itemType = item.type || "sale";
    const itemTitle = item.title || "";

    // Different image categories based on item type and title
    if (itemType === "sale") {
      if (
        itemTitle.toLowerCase().includes("jeans") ||
        itemTitle.toLowerCase().includes("clothing")
      ) {
        return "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("phone") ||
        itemTitle.toLowerCase().includes("electronic")
      ) {
        return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80";
      } else if (itemTitle.toLowerCase().includes("book")) {
        return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("furniture") ||
        itemTitle.toLowerCase().includes("table") ||
        itemTitle.toLowerCase().includes("sofa")
      ) {
        return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("game") ||
        itemTitle.toLowerCase().includes("console")
      ) {
        return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("sport") ||
        itemTitle.toLowerCase().includes("basketball") ||
        itemTitle.toLowerCase().includes("tennis")
      ) {
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("car") ||
        itemTitle.toLowerCase().includes("tire") ||
        itemTitle.toLowerCase().includes("motorcycle")
      ) {
        return "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (itemTitle.toLowerCase().includes("plant")) {
        return "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else {
        return "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      }
    } else if (itemType === "free") {
      return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    } else if (itemType === "wanted") {
      return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    }

    return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[80vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome To Marketplace
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover great deals on quality used items from your local
              community.
            </p>
          </div>
        </div>

        {/* Search Tabs */}
        <div className="absolute bottom-14 left-0 right-0 flex justify-center z-10">
          <div className="px-6 py-2 rounded-lg shadow-lg">
            <div className="flex space-x-1">
              <button className="px-6 py-2 rounded-full text-sm font-medium bg-[#A5A9AC]/90 text-white rounded-lg">
                All Items
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section Overlay */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-10 max-w-5xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Search Input */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Search Items
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63]"
                    />
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
                      placeholder="Max Budget"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63]"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div>
                  <button className="w-full bg-[#2F3A63]  cursor-pointer text-white py-3 px-6 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium flex items-center justify-center">
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
                Discover Our Marketplace
              </h2>
              <p className="text-gray-500">
                Showing {Math.min(itemsPerPage, currentItems.length)} of{" "}
                {sortedItems.length} items
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
            {/* Filters Sidebar */}
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

                {/* Condition */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Condition
                  </h4>
                  <select
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {conditionOptions.map((option) => (
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

            {/* Items Grid */}
            <div className="flex-1">
              {sortedItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-xl mb-2">No items found</p>
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

                  {/* Items Grid - 2 rows of 4 items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {currentItems.map((item) => {
                      const typeInfo = getTypeInfo(item.type);
                      const isSaved = savedItems.some(i => i.id === item.id);
                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="relative">
                            <img
                              src={getItemImage(item)}
                              alt={item.title || "Untitled"}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}
                              >
                                {typeInfo.text}
                              </span>
                            </div>
                            <div className="absolute top-2 right-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
                                  item.condition
                                )}`}
                              >
                                {item.condition || "Unknown"}
                              </span>
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {item.posted || "Unknown"}
                              </span>
                            </div>
                            <div className="absolute bottom-2 right-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSave(item);
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

                          <div className="p-4">
                            <h3 className="text-base font-semibold text-[#2F3A63] mb-2 line-clamp-2">
                              {item.title || "Untitled Item"}
                            </h3>

                            <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">
                              {item.description || "No description provided."}
                            </p>

                            <div className="flex items-center text-gray-500 mb-3">
                              <MapPin className="w-4 h-4 mr-2 text-[#2F3A63]" />
                              <span className="text-sm">
                                {item.location || "N/A"}
                              </span>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                              <span
                                className={`text-xl font-bold ${
                                  item.price === "Free"
                                    ? "text-green-600"
                                    : item.price === "Negotiable"
                                    ? "text-blue-600"
                                    : "text-green-600"
                                }`}
                              >
                                {item.price || "N/A"}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Link
                                to={`/categories/sales/${item.id}`}
                                className="flex-1 bg-[#2F3A63] text-white text-center py-2 px-3 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium text-sm"
                              >
                                View Details
                              </Link>
                              <button className="flex-1 border  cursor-pointer border-[#2F3A63] text-[#2F3A63] text-center py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                                Contact Seller
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

export default ForSaleList;