import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Bed,
  Search,
  DollarSign,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  RefreshCw,
  Bath,
  Square,
  Home,
  Calendar,
  Heart,
} from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function HousesList() {
  const houses = data.houses;
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [bedroomsFilter, setBedroomsFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [listingType, setListingType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [savedHouses, setSavedHouses] = useState([]);

  // Enhanced filter states
  const [datePostedFilter, setDatePostedFilter] = useState("any");
  const [conditionFilter, setConditionFilter] = useState("any");
  const [sortBy, setSortBy] = useState("newest");
  const [bathroomsFilter, setBathroomsFilter] = useState("all");
  const [minSqft, setMinSqft] = useState("");
  const [maxSqft, setMaxSqft] = useState("");

  // Show only 6 cards per page (2 rows of 3 cards)
  const itemsPerPage = 6;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    propertyTypeFilter,
    bedroomsFilter,
    bathroomsFilter,
    maxPrice,
    locationFilter,
    listingType,
    searchTerm,
    datePostedFilter,
    conditionFilter,
    sortBy,
    minSqft,
    maxSqft,
  ]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
    setSavedHouses(saved);
  }, []);

  const toggleSave = (house) => {
    let newSaved;
    const isSaved = savedHouses.some(h => h.id === house.id);
    if (isSaved) {
      newSaved = savedHouses.filter(h => h.id !== house.id);
    } else {
      newSaved = [...savedHouses, house];
    }
    setSavedHouses(newSaved);
    localStorage.setItem('savedItems', JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent('savedItemsChanged'));
  };

  // Get unique values for filters
  const uniqueLocations = [
    ...new Set(houses.map((house) => house.location.split(",")[0])),
  ];

  // Extract bedrooms from description (fallback for current data)
  const extractBedroomsFromDescription = (description) => {
    const bedroomMatch = description.match(
      /(\d+)-bedroom|(\d+) bedroom|(\d+) beds?/i
    );
    return bedroomMatch
      ? parseInt(bedroomMatch[1] || bedroomMatch[2] || bedroomMatch[3])
      : 2;
  };

  // Extract property type from title/description (fallback)
  const extractPropertyType = (house) => {
    const title = house.title.toLowerCase();
    const description = house.description.toLowerCase();

    if (title.includes("apartment") || description.includes("apartment"))
      return "apartment";
    if (title.includes("house") || description.includes("house"))
      return "house";
    if (title.includes("condo") || description.includes("condo"))
      return "condo";
    if (title.includes("villa") || description.includes("villa"))
      return "villa";
    if (title.includes("townhouse") || description.includes("townhouse"))
      return "townhouse";
    if (title.includes("loft") || description.includes("loft")) return "loft";
    if (title.includes("studio") || description.includes("studio"))
      return "studio";
    if (title.includes("mansion") || description.includes("mansion"))
      return "mansion";
    if (title.includes("cabin") || description.includes("cabin"))
      return "cabin";
    if (title.includes("farmhouse") || description.includes("farmhouse"))
      return "farmhouse";

    return "house"; // default
  };

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
    { value: "new", label: "New Construction" },
    { value: "excellent", label: "Excellent" },
    { value: "good", label: "Good" },
    { value: "needs-renovation", label: "Needs Renovation" },
  ];

  // Property type options
  const propertyTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "villa", label: "Villa" },
    { value: "townhouse", label: "Townhouse" },
    { value: "loft", label: "Loft" },
    { value: "studio", label: "Studio" },
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "sqft-high", label: "Largest First" },
    { value: "sqft-low", label: "Smallest First" },
  ];

  // Bathroom options
  const bathroomOptions = [
    { value: "all", label: "Any Bathrooms" },
    { value: "1", label: "1+ Bathrooms" },
    { value: "2", label: "2+ Bathrooms" },
    { value: "3", label: "3+ Bathrooms" },
    { value: "4", label: "4+ Bathrooms" },
  ];

  // Bedroom options
  const bedroomOptions = [
    { value: "all", label: "Any Bedrooms" },
    { value: "1", label: "1 Bedroom" },
    { value: "2", label: "2 Bedrooms" },
    { value: "3", label: "3 Bedrooms" },
    { value: "4", label: "4+ Bedrooms" },
  ];

  const filteredHouses = houses.filter((house) => {
    const matchesSearch =
      house.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Get bedrooms from house data or extract from description
    const bedrooms =
      house.bedrooms || extractBedroomsFromDescription(house.description);

    // Get property type from house data or extract from title/description
    const propertyType = house.propertyType || extractPropertyType(house);

    const matchesPropertyType =
      propertyTypeFilter === "all" || propertyType === propertyTypeFilter;

    const matchesBedrooms =
      bedroomsFilter === "all" ||
      bedroomsFilter === String(bedrooms) ||
      (bedroomsFilter === "4" && bedrooms >= 4);

    // Estimate bathrooms based on bedrooms (common ratio)
    const estimatedBathrooms = Math.max(1, Math.floor(bedrooms / 2));
    const matchesBathrooms =
      bathroomsFilter === "all" ||
      (bathroomsFilter === "1" && estimatedBathrooms >= 1) ||
      (bathroomsFilter === "2" && estimatedBathrooms >= 2) ||
      (bathroomsFilter === "3" && estimatedBathrooms >= 3) ||
      (bathroomsFilter === "4" && estimatedBathrooms >= 4);

    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = maxPriceNum === Infinity || house.price <= maxPriceNum;

    const matchesListingType =
      listingType === "all" || house.type === listingType;

    const matchesLocation =
      locationFilter === "" ||
      house.location.toLowerCase().includes(locationFilter.toLowerCase());

    // Square footage filtering
    const minSqftNum = minSqft ? parseFloat(minSqft) : 0;
    const maxSqftNum = maxSqft ? parseFloat(maxSqft) : Infinity;
    const matchesSqft = house.sqft >= minSqftNum && house.sqft <= maxSqftNum;

    // Date posted filtering (simplified - using relative strings)
    const matchesDatePosted =
      datePostedFilter === "any" ||
      (datePostedFilter === "today" && house.posted.includes("today")) ||
      (datePostedFilter === "week" &&
        (house.posted.includes("week") || house.posted.includes("today"))) ||
      (datePostedFilter === "month" && !house.posted.includes("year"));

    // Condition filtering (simplified - assume all are in good condition for now)
    const matchesCondition = conditionFilter === "any" || true;

    return (
      matchesSearch &&
      matchesPropertyType &&
      matchesBedrooms &&
      matchesBathrooms &&
      matchesPrice &&
      matchesListingType &&
      matchesLocation &&
      matchesSqft &&
      matchesDatePosted &&
      matchesCondition
    );
  });

  // Sort filtered houses
  const sortedHouses = [...filteredHouses].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "sqft-low":
        return a.sqft - b.sqft;
      case "sqft-high":
        return b.sqft - a.sqft;
      case "newest":
      default:
        // Simple sorting based on ID (assuming higher ID = newer)
        return b.id - a.id;
    }
  });

  const indexOfLastHouse = currentPage * itemsPerPage;
  const indexOfFirstHouse = indexOfLastHouse - itemsPerPage;
  const currentHouses = sortedHouses.slice(indexOfFirstHouse, indexOfLastHouse);
  const totalPages = Math.ceil(sortedHouses.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setDatePostedFilter("any");
    setConditionFilter("any");
    setBathroomsFilter("all");
    setMinSqft("");
    setMaxSqft("");
    setPropertyTypeFilter("all");
    setBedroomsFilter("all");
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
  };

  const clearAllFilters = () => {
    setPropertyTypeFilter("all");
    setBedroomsFilter("all");
    setBathroomsFilter("all");
    setMaxPrice("");
    setMinSqft("");
    setMaxSqft("");
    setLocationFilter("");
    setListingType("all");
    setSearchTerm("");
    setDatePostedFilter("any");
    setConditionFilter("any");
    setSortBy("newest");
  };

  // Get bedrooms for display
  const getBedrooms = (house) => {
    return house.bedrooms || extractBedroomsFromDescription(house.description);
  };

  // Get property type for display
  const getPropertyType = (house) => {
    return house.propertyType || extractPropertyType(house);
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[80vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome To Houzez
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Houzez is an innovative real estate WordPress theme that helps
              ensure your website&apos;s success in this super-competitive
              market.
            </p>
          </div>
        </div>

        {/* Search Tabs */}
        <div className="absolute bottom-14 left-0 right-0 flex justify-center z-10">
          <div className=" px-6 py-2 rounded-lg shadow-lg ">
            <div className="flex space-x-1">
              {["all", "rent", "sale"].map((type) => (
                <button
                  key={type}
                  onClick={() => setListingType(type)}
                  className={`px-6 py-2 rounded-full text-sm font-medium bg-[#A5A9AC]/90  rounded-lg transition-colors ${
                    listingType === type
                      ? " text-white"
                      : "text-white hover:text-gray-800"
                  }`}
                >
                  {type === "all"
                    ? "All"
                    : `For ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filter Section Overlay */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-10  max-w-5xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Property Type */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Property Type
                  </label>
                  <div className="relative">
                    <select
                      value={propertyTypeFilter}
                      onChange={(e) => setPropertyTypeFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] appearance-none"
                    >
                      {propertyTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                      <option value="">All Cities</option>
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
                Discover Our Featured Listings
              </h2>
              <p className="text-gray-500">
                Showing {Math.min(itemsPerPage, currentHouses.length)} of{" "}
                {sortedHouses.length} properties
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

                {/* Square Footage */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Square Footage
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Square className="w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Min Sq Ft"
                        value={minSqft}
                        onChange={(e) => setMinSqft(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Max Sq Ft"
                        value={maxSqft}
                        onChange={(e) => setMaxSqft(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Bedrooms
                  </h4>
                  <select
                    value={bedroomsFilter}
                    onChange={(e) => setBedroomsFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {bedroomOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Bathrooms
                  </h4>
                  <select
                    value={bathroomsFilter}
                    onChange={(e) => setBathroomsFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {bathroomOptions.map((option) => (
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

            {/* Houses Grid */}
            <div className="flex-1">
              {sortedHouses.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-xl mb-2">
                    No properties found
                  </p>
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
                    {currentHouses.map((house) => {
                      const bedrooms = getBedrooms(house);
                      const propertyType = getPropertyType(house);
                      // Estimate bathrooms based on bedrooms
                      const estimatedBathrooms = Math.max(
                        1,
                        Math.floor(bedrooms / 2)
                      );
                      const isSaved = savedHouses.some(h => h.id === house.id);

                      return (
                        <div
                          key={house.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="relative">
                            <img
                              src={house.images[0]}
                              alt={house.title}
                              className="w-full h-36 object-cover  "
                            />
                            <div className="absolute top-2 left-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  house.type === "rent"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {house.type === "rent"
                                  ? "For Rent"
                                  : "For Sale"}
                              </span>
                            </div>
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSave(house);
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
                            <div className="absolute bottom-2 left-2">
                              <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                {house.posted}
                              </span>
                            </div>
                          </div>

                          <div className="p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-base font-semibold text-[#2F3A63] line-clamp-1 flex-1">
                                {house.title}
                              </h3>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize ml-2">
                                {propertyType}
                              </span>
                            </div>

                            <p className="text-gray-500 text-xs mb-2 line-clamp-2 leading-relaxed">
                              {house.description}
                            </p>

                            <div className="flex items-center text-gray-500 mb-2">
                              <MapPin className="w-3 h-3 mr-1 text-[#2F3A63]" />
                              <span className="text-xs">
                                {house.location.split(",")[0]}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-gray-500 mb-3 text-xs">
                              <div className="flex items-center">
                                <Bed className="w-3 h-3 mr-1 text-[#2F3A63]" />
                                <span>
                                  {bedrooms} {bedrooms === 1 ? "bed" : "beds"}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Bath className="w-3 h-3 mr-1 text-[#2F3A63]" />
                                <span>
                                  {estimatedBathrooms}{" "}
                                  {estimatedBathrooms === 1 ? "bath" : "baths"}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Square className="w-3 h-3 mr-1 text-[#2F3A63]" />
                                <span>{house.sqft} sqft</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mb-3">
                              <span className="text-lg font-bold text-green-600">
                                {house.type === "rent"
                                  ? `$${house.price}/mo`
                                  : `$${house.price.toLocaleString()}`}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Link
                                to={`/categories/houses/${house.id}`}
                                className="flex-1 bg-[#2F3A63] text-white text-center py-2 px-3 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium text-sm"
                              >
                                View Details
                              </Link>
                              <a
                                href={`mailto:${house.contactEmail}?subject=Inquiry about ${house.title}`}
                                className="flex-1 border border-[#2F3A63] text-[#2F3A63] text-center py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
                              >
                                Contact
                              </a>
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

export default HousesList;
