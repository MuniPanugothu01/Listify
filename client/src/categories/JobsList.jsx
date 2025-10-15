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

function JobsList() {
  const jobs = data.jobs || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, maxPrice, locationFilter, searchTerm]);

  // Get unique locations and types safely
  const uniqueLocations = [
    ...new Set((jobs || []).map((job) => job?.location).filter(Boolean)),
  ];
  const uniqueTypes = [
    ...new Set((jobs || []).map((job) => job?.type).filter(Boolean)),
  ];

  // Apply filters safely
  const filteredJobs = (jobs || []).filter((job) => {
    const title = job?.title || "";
    const location = job?.location || "";
    const description = job?.description || "";
    const type = job?.type || "";
    const pay = job?.pay || "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || type === typeFilter;

    const priceNum = parseInt((pay || "").replace(/[^0-9]/g, ""), 10) || 0;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = priceNum <= maxPriceNum;

    const matchesLocation =
      locationFilter === "" ||
      location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesType && matchesPrice && matchesLocation;
  });

  // Pagination logic
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = indexOfFirstJob + 1;
  const endIndex = Math.min(indexOfLastJob, filteredJobs.length);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[80vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome To Jobs
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore career opportunities in your local area.
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-10 max-w-5xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-2xl p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Job Type */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Job Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    {uniqueTypes.map((type, i) => (
                      <option key={i} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((loc, i) => (
                      <option key={i} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Max Salary */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Max Salary
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      placeholder="Max Salary"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div>
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
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
          <Link
            to="/categories"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg inline-block hover:bg-blue-600 transition-colors w-full sm:w-auto"
          >
            Back to Categories
          </Link>

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
              <p className="text-gray-600 mt-1">
                Showing {startIndex}-{endIndex} of {filteredJobs.length} jobs
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Filters Applied</span>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-xl mb-2">No jobs found</p>
              <p className="text-gray-500 mb-4">
                Try adjusting your search filters
              </p>
              <button
                onClick={() => {
                  setTypeFilter("all");
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
                {currentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img
                        src={
                          job.images?.[0] ||
                          "https://via.placeholder.com/300x200?text=No+Image"
                        }
                        alt={job.title || "Untitled"}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                          {job.type || "N/A"}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                          {job.posted || "Unknown"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        {job.title || "Untitled Job"}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {job.description || "No description provided."}
                      </p>
                      <div className="flex items-center text-gray-700 mb-4">
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-sm">{job.location || "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold text-green-600">
                          {job.pay || "N/A"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/categories/jobs/${job.id}`}
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

export default JobsList;
