// JobsDetails.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import {
  MapPin,
  Mail,
  Heart,
  Share2,
  Calendar,
  Star,
  ArrowLeft,
  ExternalLink,
  Users,
  CheckCircle,
  Clock,
  Briefcase,
  Building,
  DollarSign,
  GraduationCap,
  Award,
} from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function JobsDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    try {
      const foundJob = data.jobs.find((j) => j.id === parseInt(id));
      if (!foundJob) {
        setError("Job not found");
      } else {
        setJob(foundJob);
        setSelectedImage(foundJob.images[0]);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load job data");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
    setSavedItems(saved);
  }, [id]);

  const isSaved = savedItems.some((h) => h.id === job?.id);

  const toggleSave = () => {
    if (!job) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedItems.filter((h) => h.id !== job.id);
    } else {
      newSaved = [...savedItems, job];
    }
    setSavedItems(newSaved);
    localStorage.setItem("savedItems", JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent("savedItemsChanged"));
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: job.description,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
  };

  // Extract job category from title/description
  const extractJobCategory = (job) => {
    const title = job.title.toLowerCase();
    const description = job.description.toLowerCase();

    if (title.includes("developer") || description.includes("software"))
      return "technology";
    if (title.includes("designer") || description.includes("design"))
      return "design";
    if (title.includes("manager") || description.includes("management"))
      return "management";
    if (title.includes("sales") || description.includes("marketing"))
      return "sales";
    if (title.includes("teacher") || description.includes("education"))
      return "education";
    if (title.includes("health") || description.includes("care"))
      return "healthcare";
    if (title.includes("customer") || description.includes("support"))
      return "customer service";
    if (title.includes("finance") || description.includes("accounting"))
      return "finance";
    if (title.includes("engineer") || description.includes("engineering"))
      return "engineering";
    if (title.includes("admin") || description.includes("administrative"))
      return "administrative";

    return "general";
  };

  // Get job category color
  const getJobCategoryColor = (category) => {
    switch (category) {
      case "technology":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "design":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "management":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "sales":
        return "bg-green-100 text-green-800 border border-green-200";
      case "education":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "healthcare":
        return "bg-red-100 text-red-800 border border-red-200";
      case "customer service":
        return "bg-cyan-100 text-cyan-800 border border-cyan-200";
      case "finance":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "engineering":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "administrative":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Extract features from description
  const extractFeatures = (description) => {
    const features = [];
    if (description.toLowerCase().includes("remote")) features.push("Remote Work Options");
    if (description.toLowerCase().includes("flexible")) features.push("Flexible Hours");
    if (description.toLowerCase().includes("health")) features.push("Health Insurance");
    if (description.toLowerCase().includes("dental")) features.push("Dental Coverage");
    if (description.toLowerCase().includes("vision")) features.push("Vision Insurance");
    if (description.toLowerCase().includes("401")) features.push("401(k) Matching");
    if (description.toLowerCase().includes("paid time off") || description.toLowerCase().includes("pto")) features.push("Paid Time Off");
    if (description.toLowerCase().includes("bonus")) features.push("Performance Bonus");
    if (description.toLowerCase().includes("career")) features.push("Career Growth");
    if (description.toLowerCase().includes("training")) features.push("Training & Development");

    // Add default features if none found
    if (features.length === 0) {
      features.push(
        "Competitive Salary",
        "Professional Development",
        "Positive Work Environment",
        "Career Advancement"
      );
    }

    return features.slice(0, 6);
  };

  // Get similar jobs (exclude current job)
  const getSimilarJobs = () => {
    if (!job) return [];
    return data.jobs.filter((j) => j.id !== job.id).slice(0, 6);
  };

  // Extract job details
  const extractJobDetails = (job) => {
    return {
      experience: "2-5 years",
      education: "Bachelor's Degree",
      employmentType: job.type || "Full-time",
      schedule: "Monday - Friday",
      travel: "None required",
      workLocation: "On-site",
      reportsTo: "Department Manager",
      teamSize: "10-15 people",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F3A63] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The job you're looking for doesn't exist.
          </p>
          <Link
            to="/categories/jobs"
            className="bg-[#2F3A63] text-white px-6 py-3 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const jobCategory = extractJobCategory(job);
  const jobCategoryColor = getJobCategoryColor(jobCategory);
  const features = extractFeatures(job.description);
  const jobDetails = extractJobDetails(job);
  const similarJobs = getSimilarJobs();
  
  const displayImages = job.images.length < 4
    ? [...job.images, ...Array(4 - job.images.length).fill(job.images[0])]
    : job.images.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/categories/jobs"
              className="inline-flex items-center text-[#2F3A63] font-medium hover:text-[#1E2A4D] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Jobs
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={shareJob}
                className="p-2 text-gray-600 hover:text-[#2F3A63] transition-colors relative"
              >
                <Share2 className="w-5 h-5" />
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={copyLink}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-t-lg flex items-center gap-3"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Copy Link
                    </button>
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-b-lg flex items-center gap-3">
                      <Mail className="w-4 h-4" />
                      Share via Email
                    </button>
                  </div>
                )}
              </button>

              <button
                onClick={toggleSave}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isSaved
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? "fill-red-600" : ""}`} />
                <span className="hidden sm:inline font-medium">
                  {isSaved ? "Saved" : "Save"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:w-2/3">
            {/* Image Gallery - Modern Style */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt={job.title}
                  className="w-full h-100 object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${jobCategoryColor}`}>
                    {job.type}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="bg-[#2F3A63]/10 text-[#2F3A63] px-3 py-1.5 rounded-full text-sm font-medium border border-[#2F3A63]/20">
                    {jobCategory.charAt(0).toUpperCase() + jobCategory.slice(1)}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4 grid grid-cols-4 gap-3">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? " ring-opacity-20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${job.title} - ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header with Salary and Title */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">{job.company || "Leading Company"}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {job.salary}
                    </div>
                    <div className="text-sm text-gray-500">Annual Salary</div>
                  </div>
                </div>

                {/* Enhanced Job Stats */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {/* Employment Type */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Briefcase className="w-6 h-6 text-[#2F3A63]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Type</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {jobDetails.employmentType}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Award className="w-6 h-6 text-[#2F3A63]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Experience</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {jobDetails.experience}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <GraduationCap className="w-6 h-6 text-[#2F3A63]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Education</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {jobDetails.education}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <MapPin className="w-6 h-6 text-[#2F3A63]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Location</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {job.location.split(",")[0]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Job Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <Clock className="w-5 h-5 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Schedule</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {jobDetails.schedule}
                    </div>
                  </div>
                  <div className="text-center">
                    <Users className="w-5 h-5 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Work Type</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {jobDetails.workLocation}
                    </div>
                  </div>
                  <div className="text-center">
                    <MapPin className="w-5 h-5 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Travel</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {jobDetails.travel}
                    </div>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-5 h-5 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Posted</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {job.posted}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="px-6 flex space-x-8 overflow-x-auto">
                  {["overview", "requirements", "location"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors capitalize ${
                        activeTab === tab
                          ? "border-[#2F3A63] text-[#2F3A63]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Job Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Benefits & Perks
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "requirements" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Qualifications
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Experience Level</span>
                            <span className="font-medium">
                              {jobDetails.experience}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Education</span>
                            <span className="font-medium">
                              {jobDetails.education}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Employment Type</span>
                            <span className="font-medium">
                              {jobDetails.employmentType}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Schedule</span>
                            <span className="font-medium">
                              {jobDetails.schedule}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Additional Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Work Location</span>
                            <span className="font-medium">
                              {jobDetails.workLocation}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Travel Required</span>
                            <span className="font-medium">
                              {jobDetails.travel}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Reports To</span>
                            <span className="font-medium">
                              {jobDetails.reportsTo}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Team Size</span>
                            <span className="font-medium">
                              {jobDetails.teamSize}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "location" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Job Location
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {job.location}
                      </p>

                      <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200">
                        <iframe
                          title="Job Location Map"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(
                            job.location
                          )}&output=embed&zoom=15`}
                          className="border-0"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:w-1/3 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Recruiter
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
                  alt={job.sellerName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {job.sellerName}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    HR Manager
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      (28 reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${job.contactEmail}?subject=Application for ${job.title}`}
                  className="w-full bg-[#2F3A63] text-white py-3 px-4 rounded-lg cursor-pointer hover:bg-[#1E2A4D] transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Recruiter
                </a>

                <button className="w-full border border-[#2F3A63] text-[#2F3A63] py-3 px-4 rounded-lg hover:bg-[#2F3A63] hover:text-white transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <FaComments className="w-4 h-4" />
                  Chat with Recruiter
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Posted {job.posted}
                </div>
              </div>
            </div>

            {/* Apply Now Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Apply for This Job
              </h3>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800">Immediate Opening</div>
                      <div className="text-sm text-green-600">Applications reviewed daily</div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <Briefcase className="w-5 h-5" />
                  Apply Now
                </button>

                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Application Process</div>
                  <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
                    <div className="text-center">
                      <div className="w-6 h-6 bg-[#2F3A63] text-white rounded-full flex items-center justify-center text-xs mx-auto mb-1">1</div>
                      <div>Apply</div>
                    </div>
                    <div className="w-8 h-px bg-gray-300"></div>
                    <div className="text-center">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs mx-auto mb-1">2</div>
                      <div>Interview</div>
                    </div>
                    <div className="w-8 h-px bg-gray-300"></div>
                    <div className="text-center">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs mx-auto mb-1">3</div>
                      <div>Offer</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#2F3A63]" />
                  Similar Jobs ({similarJobs.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {similarJobs.map((similarJob) => {
                  const similarCategory = extractJobCategory(similarJob);
                  const similarCategoryColor = getJobCategoryColor(similarCategory);
                  
                  return (
                    <Link
                      key={similarJob.id}
                      to={`/categories/jobs/${similarJob.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex gap-3">
                        <img
                          src={similarJob.images[0]}
                          alt={similarJob.title}
                          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                              {similarJob.title}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${similarCategoryColor}`}
                            >
                              {similarJob.type}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-600 truncate">
                              {similarJob.location.split(",")[0]}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <DollarSign className="w-3 h-3" />
                            <span className="font-semibold text-green-600">
                              {similarJob.salary}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {similarJob.posted}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <Link
                  to="/categories/jobs"
                  className="w-full text-center text-[#2F3A63] font-medium hover:text-[#1E2A4D] transition-colors text-sm inline-flex items-center justify-center gap-1"
                >
                  View All Jobs
                  <ArrowLeft className="w-4 h-4 transform rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobsDetails;