// ResumesList.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, ChevronDown, ChevronLeft, ChevronRight, Heart } from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function ResumesList() {
  const resumes = data.resumes;
  const [savedItems, setSavedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [skillsFilter, locationFilter, searchTerm]);

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

  const toggleSave = (resume) => {
    let newSaved;
    const isSaved = savedItems.some(i => i.id === resume.id);
    if (isSaved) {
      newSaved = savedItems.filter(i => i.id !== resume.id);
    } else {
      newSaved = [...savedItems, resume];
    }
    setSavedItems(newSaved);
    localStorage.setItem('savedItems', JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent('savedItemsChanged'));
  };

  // Get unique locations for the location filter
  const uniqueLocations = [...new Set(resumes.map((resume) => resume.location))];
  // Get unique skills
  const uniqueSkills = [...new Set(resumes.flatMap((resume) => resume.skills))];

  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch =
      resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.skills.join(" ").toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.experience.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSkills = skillsFilter === "all" || resume.skills.includes(skillsFilter);

    const matchesLocation =
      locationFilter === "" || resume.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesSkills && matchesLocation;
  });

  const indexOfLastResume = currentPage * itemsPerPage;
  const indexOfFirstResume = indexOfLastResume - itemsPerPage;
  const currentResumes = filteredResumes.slice(indexOfFirstResume, indexOfLastResume);
  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);

  const startIndex = indexOfFirstResume + 1;
  const endIndex = Math.min(indexOfLastResume, filteredResumes.length);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Wallpaper */}
      <div
        className="relative h-[80vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30 bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome To Resumes
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Browse and connect with talented professionals.
            </p>
          </div>
        </div>

        {/* Search and Filter Section Overlay */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-10 max-w-5xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-2xl p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                {/* Skills Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Skills
                  </label>
                  <div className="relative">
                    <select
                      value={skillsFilter}
                      onChange={(e) => setSkillsFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] appearance-none"
                    >
                      <option value="all">All Skills</option>
                      {uniqueSkills.map((skill, index) => (
                        <option key={index} value={skill}>
                          {skill}
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

                {/* Search Button */}
                <div>
                  <button className="w-full bg-[#2F3A63] text-white py-3 px-6 rounded-lg hover:bg-[#2F3A63]/90 transition-colors font-medium flex items-center justify-center">
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
          {/* Back to Categories Button */}
          <div className="mb-6">
            <Link
              to="/categories"
              className="bg-[#2F3A63] text-white px-4 py-2 rounded-lg font-medium shadow-lg inline-block hover:bg-[#2F3A63]/90 transition-colors w-full sm:w-auto text-center sm:text-left"
            >
              Back to Categories
            </Link>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Professional Resumes
              </h2>
              <p className="text-gray-600 mt-1">
                Showing {startIndex}-{endIndex} of {filteredResumes.length} resumes
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600">Filters Applied</span>
            </div>
          </div>

          {/* Resumes Grid */}
          {filteredResumes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-xl mb-2">No resumes found</p>
              <p className="text-gray-500 mb-4">
                Try adjusting your search filters
              </p>
              <button
                onClick={() => {
                  setSkillsFilter("all");
                  setLocationFilter("");
                  setSearchTerm("");
                }}
                className="bg-[#2F3A63] text-white px-6 py-2 rounded-lg hover:bg-[#2F3A63]/90 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentResumes.map((resume) => {
                  const isSaved = savedItems.some(i => i.id === resume.id);
                  return (
                    <div
                      key={resume.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative">
                        <img
                          src={resume.images[0]}
                          alt={resume.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                            {resume.posted}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSave(resume);
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                          {resume.name}
                        </h3>

                        <p className="text-gray-600 text-sm mb-2">
                          {resume.experience}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {resume.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="text-xs bg-[#2F3A63]/10 text-[#2F3A63] px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center text-gray-700 mb-4">
                          <MapPin className="w-4 h-4 mr-2 text-[#2F3A63]" />
                          <span className="text-sm">{resume.location}</span>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/categories/resumes/${resume.id}`}
                            className="flex-1 bg-[#2F3A63] text-white text-center py-2 px-4 rounded-lg hover:bg-[#2F3A63]/90 transition-colors font-medium"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center space-x-2 mt-8 gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-[#2F3A63] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2F3A63]/5 transition-colors flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-[#2F3A63] text-white"
                          : "border border-[#2F3A63] hover:bg-[#2F3A63]/5"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-[#2F3A63] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2F3A63]/5 transition-colors flex items-center"
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

export default ResumesList;