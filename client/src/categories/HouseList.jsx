import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Search, DollarSign, ChevronDown } from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function HousesList() {
  const houses = data.houses;
  const [searchTerm, setSearchTerm] = useState(""); // Keeping for general search if needed, but not used in hero
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [bedroomsFilter, setBedroomsFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [listingType, setListingType] = useState("all"); // For tabs: all, rent, sale

  // Get unique locations for the location filter
  const uniqueLocations = [
    ...new Set(houses.map((house) => house.location.split(",")[0])),
  ];
  // Assume unique property types from data, e.g., apartment, villa, etc.
  const uniquePropertyTypes = [
    ...new Set(houses.map((house) => house.propertyType || "apartment")),
  ];
  // Assume bedrooms are numbers, unique options
  const uniqueBedrooms = ["all", "1", "2", "3", "4+"].filter(
    (b) =>
      b === "all" ||
      houses.some(
        (h) => String(h.bedrooms) === b || (b === "4+" && h.bedrooms >= 4)
      )
  );

  const filteredHouses = houses.filter((house) => {
    const matchesSearch =
      house.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      house.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPropertyType =
      propertyTypeFilter === "all" || house.propertyType === propertyTypeFilter;

    const matchesBedrooms =
      bedroomsFilter === "all" ||
      bedroomsFilter === String(house.bedrooms) ||
      (bedroomsFilter === "4+" && house.bedrooms >= 4);

    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = maxPriceNum === Infinity || house.price <= maxPriceNum;

    const matchesListingType =
      listingType === "all" || house.type === listingType;

    const matchesLocation =
      locationFilter === "" ||
      house.location.toLowerCase().includes(locationFilter.toLowerCase());

    return (
      matchesSearch &&
      matchesPropertyType &&
      matchesBedrooms &&
      matchesPrice &&
      matchesListingType &&
      matchesLocation
    );
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Wallpaper */}
      <div
        className="relative h-[80vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 bg-opacity-40"></div>
        <div className="absolute top-4 left-4 z-20 ">
          <Link
            to="/categories"
            className=" bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
          >
            Back to Categories
          </Link>
        </div>
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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {/* Property Type */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Looking for
                  </label>
                  <div className="relative">
                    <select
                      value={propertyTypeFilter}
                      onChange={(e) => setPropertyTypeFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      <option value="all">Property Type</option>
                      {uniquePropertyTypes.map((ptype, index) => (
                        <option key={index} value={ptype}>
                          {ptype}
                        </option>
                      ))}
                    </select>
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
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

                {/* Bedrooms Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Bedrooms
                  </label>
                  <div className="relative">
                    <select
                      value={bedroomsFilter}
                      onChange={(e) => setBedroomsFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      <option value="all">Bedrooms</option>
                      {uniqueBedrooms.map((b, index) => (
                        <option key={index} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Max Price */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Your Budget
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div>
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
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
      <div className="bg-gray-50 pt-20 pb-8 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Discover Our Featured Listings
              </h2>
              <p className="text-gray-600 mt-1">
                Showing {filteredHouses.length} of {houses.length} properties
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Filters Applied</span>
            </div>
          </div>

          {/* Houses Grid */}
          {filteredHouses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-xl mb-2">No properties found</p>
              <p className="text-gray-500 mb-4">
                Try adjusting your search filters
              </p>
              <button
                onClick={() => {
                  setPropertyTypeFilter("all");
                  setBedroomsFilter("all");
                  setMaxPrice("");
                  setLocationFilter("");
                  setListingType("all");
                  setSearchTerm("");
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredHouses.map((house) => (
                <div
                  key={house.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={house.images[0]}
                      alt={house.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          house.type === "rent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {house.type === "rent" ? "For Rent" : "For Sale"}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {house.posted}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {house.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {house.description}
                    </p>

                    <div className="flex items-center text-gray-700 mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm">
                        {house.location.split(",")[0]}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-700 mb-4">
                      <Bed className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">{house.bedrooms} beds</span>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-green-600">
                        {house.type === "rent"
                          ? `$${house.price}/mo`
                          : `$${house.price.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/categories/houses/${house.id}`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        View Details
                      </Link>
                      <a
                        href={`mailto:${house.contactEmail}?subject=Inquiry about ${house.title}`}
                        className="flex-1 border border-blue-600 text-blue-600 text-center py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                      >
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HousesList;