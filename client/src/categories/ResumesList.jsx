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
  User,
  Calendar,
  Heart,
  Briefcase,
  Award,
  GraduationCap,
} from "lucide-react";
import data from "../data/data.json";

function ResumesList() {
  const resumes = data.resumes || [];
  const [savedItems, setSavedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("any");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Enhanced filter states
  const [datePostedFilter, setDatePostedFilter] = useState("any");
  const [educationFilter, setEducationFilter] = useState("any");
  const [sortBy, setSortBy] = useState("newest");

  // Show only 6 cards per page (2 rows of 3 cards)
  const itemsPerPage = 6;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    skillsFilter,
    locationFilter,
    experienceFilter,
    searchTerm,
    datePostedFilter,
    educationFilter,
    sortBy,
  ]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
    setSavedItems(saved);
  }, []);

  useEffect(() => {
    const loadSaved = () => {
      const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
      setSavedItems(saved);
    };

    window.addEventListener("savedItemsChanged", loadSaved);
    return () => window.removeEventListener("savedItemsChanged", loadSaved);
  }, []);

  const toggleSave = (resume) => {
    let newSaved;
    const isSaved = savedItems.some((i) => i.id === resume.id);
    if (isSaved) {
      newSaved = savedItems.filter((i) => i.id !== resume.id);
    } else {
      newSaved = [...savedItems, resume];
    }
    setSavedItems(newSaved);
    localStorage.setItem("savedItems", JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent("savedItemsChanged"));
  };

  // Get unique values for filters
  const uniqueLocations = [
    ...new Set(resumes.map((resume) => resume.location)),
  ];
  const uniqueSkills = [...new Set(resumes.flatMap((resume) => resume.skills))];

  // Extract experience levels from experience field
  const getExperienceLevel = (experience) => {
    if (!experience) return "Not specified";
    const expLower = experience.toLowerCase();
    if (
      expLower.includes("senior") ||
      expLower.includes("lead") ||
      expLower.includes("principal")
    ) {
      return "Senior Level";
    } else if (expLower.includes("mid") || expLower.includes("intermediate")) {
      return "Mid Level";
    } else if (
      expLower.includes("junior") ||
      expLower.includes("entry") ||
      expLower.includes("fresh")
    ) {
      return "Entry Level";
    } else {
      return "Experienced";
    }
  };

  const uniqueExperienceLevels = [
    ...new Set(resumes.map((resume) => getExperienceLevel(resume.experience))),
  ];

  // Date posted options
  const datePostedOptions = [
    { value: "any", label: "Any time" },
    { value: "today", label: "Last 24 hours" },
    { value: "week", label: "Last 7 days" },
    { value: "month", label: "Last 30 days" },
  ];

  // Education options
  const educationOptions = [
    { value: "any", label: "Any Education" },
    { value: "bachelors", label: "Bachelor's Degree" },
    { value: "masters", label: "Master's Degree" },
    { value: "phd", label: "PhD" },
    { value: "diploma", label: "Diploma" },
  ];

  // Skills options
  const skillsOptions = [
    { value: "all", label: "All Skills" },
    ...uniqueSkills.map((skill) => ({ value: skill, label: skill })),
  ];

  // Experience options
  const experienceOptions = [
    { value: "any", label: "Any Experience" },
    ...uniqueExperienceLevels.map((level) => ({ value: level, label: level })),
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "experience", label: "Most Experienced" },
    { value: "skills", label: "Most Skills" },
    { value: "recent", label: "Most Recent" },
  ];

  // Generate random rating for resumes (for demo purposes)
  const getRandomRating = (resumeId) => {
    const ratings = [4.2, 4.5, 4.8, 4.0, 4.7, 4.9, 4.3, 4.6];
    return ratings[resumeId % ratings.length];
  };

  // Generate random review count
  const getRandomReviewCount = (resumeId) => {
    const counts = [12, 8, 25, 15, 32, 7, 18, 21];
    return counts[resumeId % counts.length];
  };

  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch =
      resume.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.skills
        ?.join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      resume.experience?.toLowerCase().includes(searchTerm.toLowerCase());

    // Skills filtering
    const matchesSkills =
      skillsFilter === "all" || resume.skills?.includes(skillsFilter);

    const matchesLocation =
      locationFilter === "" ||
      resume.location?.toLowerCase().includes(locationFilter.toLowerCase());

    // Experience filtering
    const resumeExperienceLevel = getExperienceLevel(resume.experience);
    const matchesExperience =
      experienceFilter === "any" || resumeExperienceLevel === experienceFilter;

    // Date posted filtering (simplified)
    const matchesDatePosted = datePostedFilter === "any" || true;

    // Education filtering (simplified - based on skills/experience)
    const matchesEducation = educationFilter === "any" || true;

    return (
      matchesSearch &&
      matchesSkills &&
      matchesLocation &&
      matchesExperience &&
      matchesDatePosted &&
      matchesEducation
    );
  });

  // Sort filtered resumes
  const sortedResumes = [...filteredResumes].sort((a, b) => {
    const skillsA = a.skills?.length || 0;
    const skillsB = b.skills?.length || 0;
    const dateA = new Date(a.posted);
    const dateB = new Date(b.posted);

    switch (sortBy) {
      case "experience":
        return (b.experience?.length || 0) - (a.experience?.length || 0);
      case "skills":
        return skillsB - skillsA;
      case "recent":
        return dateB - dateA;
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  const indexOfLastResume = currentPage * itemsPerPage;
  const indexOfFirstResume = indexOfLastResume - itemsPerPage;
  const currentResumes = sortedResumes.slice(
    indexOfFirstResume,
    indexOfLastResume
  );
  const totalPages = Math.ceil(sortedResumes.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setDatePostedFilter("any");
    setEducationFilter("any");
    setExperienceFilter("any");
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
  };

  const clearAllFilters = () => {
    setSkillsFilter("all");
    setLocationFilter("");
    setExperienceFilter("any");
    setSearchTerm("");
    setDatePostedFilter("any");
    setEducationFilter("any");
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

  // Get experience badge color
  const getExperienceBadgeColor = (experience) => {
    const level = getExperienceLevel(experience);
    switch (level) {
      case "Senior Level":
        return "bg-purple-100 text-purple-800";
      case "Mid Level":
        return "bg-blue-100 text-blue-800";
      case "Entry Level":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
              Find Top Talent
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover skilled professionals and connect with the best
              candidates for your team.
            </p>
          </div>
        </div>

        {/* Search and Filter Section Overlay */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-10 max-w-5xl mx-auto">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
                      {skillsOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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

                {/* Experience Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Experience
                  </label>
                  <div className="relative">
                    <select
                      value={experienceFilter}
                      onChange={(e) => setExperienceFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] appearance-none"
                    >
                      {experienceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
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
                Professional Resumes
              </h2>
              <p className="text-gray-500">
                Showing {Math.min(itemsPerPage, currentResumes.length)} of{" "}
                {sortedResumes.length} resumes
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

                {/* Skills */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">Skills</h4>
                  <select
                    value={skillsFilter}
                    onChange={(e) => setSkillsFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {skillsOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
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

                {/* Education Level */}
                <div>
                  <h4 className="font-semibold text-[#2F3A63] mb-3">
                    Education
                  </h4>
                  <select
                    value={educationFilter}
                    onChange={(e) => setEducationFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F3A63] focus:border-[#2F3A63] text-gray-500"
                  >
                    {educationOptions.map((option) => (
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

            {/* Resumes Grid */}
            <div className="flex-1">
              {sortedResumes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-xl mb-2">No resumes found</p>
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
                    {currentResumes.map((resume) => {
                      const rating = getRandomRating(resume.id);
                      const reviewCount = getRandomReviewCount(resume.id);
                      const isSaved = savedItems.some(
                        (i) => i.id === resume.id
                      );
                      const experienceLevel = getExperienceLevel(
                        resume.experience
                      );

                      return (
                        <div
                          key={resume.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="relative">
                            <img
                              src={
                                resume.images?.[0] ||
                                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                              }
                              alt={resume.name}
                              className="w-full h-36 object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceBadgeColor(
                                  resume.experience
                                )}`}
                              >
                                {experienceLevel}
                              </span>
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                {resume.posted}
                              </span>
                            </div>
                            <div className="absolute bottom-2 right-2">
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
                                      ? "fill-red-600 text-red-600"
                                      : "text-gray-400 hover:text-red-500"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          <div className="p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-base font-semibold text-[#2F3A63] line-clamp-1 flex-1">
                                {resume.name}
                              </h3>
                            </div>

                            <div className="flex items-center text-gray-600 mb-2">
                              <Briefcase className="w-3 h-3 mr-1 text-[#2F3A63]" />
                              <span className="text-sm font-medium">
                                {resume.experience}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                              {resume.skills
                                ?.slice(0, 3)
                                .map((skill, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-[#2F3A63]/10 text-[#2F3A63] px-2 py-1 rounded"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {resume.skills?.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  +{resume.skills.length - 3} more
                                </span>
                              )}
                            </div>

                            <div className="flex items-center text-gray-500 mb-2">
                              <MapPin className="w-3 h-3 mr-1 text-[#2F3A63]" />
                              <span className="text-xs">{resume.location}</span>
                            </div>

                            <div className="flex items-center justify-between text-gray-500 mb-3 text-xs">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1 text-[#2F3A63]" />
                                <span>Updated {resume.posted}</span>
                              </div>
                              {renderStars(rating)}
                            </div>

                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm font-semibold text-green-600">
                                Available for work
                              </span>
                              <span className="text-xs text-gray-500">
                                {reviewCount} reviews
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Link
                                to={`/categories/resumes/${resume.id}`}
                                className="flex-1 bg-[#2F3A63] text-white text-center py-2 px-3 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium text-sm"
                              >
                                View Profile
                              </Link>
                              <button className="flex-1 border border-[#2F3A63] text-[#2F3A63] text-center  cursor-pointer py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
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

export default ResumesList;
