// ServicesList.jsx (Safe & Fixed)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Search,
  DollarSign,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import data from "../data/data.json";

function ServicesList() {
  const services = Array.isArray(data?.services) ? data.services : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  useEffect(() => {
    setCurrentPage(1);
  }, [maxPrice, locationFilter, searchTerm]);

  // Get unique locations
  const uniqueLocations = [
    ...new Set(
      services.map((service) => service?.location || "").filter(Boolean)
    ),
  ];

  const filteredServices = services.filter((service) => {
    const title = service?.title ?? "";
    const location = service?.location ?? "";
    const description = service?.description ?? "";
    const payValue = typeof service?.pay === "string" ? service.pay : "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    // Safely parse price
    let priceNum = 0;
    try {
      priceNum = parseInt(payValue.replace(/[^0-9]/g, ""), 10) || 0;
    } catch {
      priceNum = 0;
    }

    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = priceNum <= maxPriceNum;

    const matchesLocation =
      locationFilter === "" ||
      location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesPrice && matchesLocation;
  });

  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const startIndex = indexOfFirstService + 1;
  const endIndex = Math.min(indexOfLastService, filteredServices.length);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[80vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome To Services
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Find top home and repair professionals in our community.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-10 max-w-5xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-2xl p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div>
                  <button
                    onClick={() => setSearchTerm(searchTerm.trim())}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                  >
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
          <div className="mb-6">
            <Link
              to="/categories"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg inline-block hover:bg-blue-600 transition-colors w-full sm:w-auto text-center sm:text-left"
            >
              Back to Categories
            </Link>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Services
              </h2>
              <p className="text-gray-600 mt-1">
                Showing {startIndex}-{endIndex} of {filteredServices.length} services
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Filters Applied</span>
            </div>
          </div>

          {/* Services Grid */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-xl mb-2">No services found</p>
              <p className="text-gray-500 mb-4">
                Try adjusting your search filters
              </p>
              <button
                onClick={() => {
                  setMaxPrice("");
                  setLocationFilter("");
                  setSearchTerm("");
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img
                        src={
                          service.images?.[0] ||
                          "https://via.placeholder.com/300x200?text=No+Image"
                        }
                        alt={service.title || "Untitled"}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                          {service.posted || "Unknown"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        {service.title || "Untitled Service"}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {service.description || "No description provided."}
                      </p>

                      <div className="flex items-center text-gray-700 mb-4">
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-sm">
                          {service.location || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold text-green-600">
                          {service.pay || "N/A"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/categories/services/${service.id}`}
                          className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center space-x-2 mt-8 gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors flex items-center"
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
  );
}

export default ServicesList;
