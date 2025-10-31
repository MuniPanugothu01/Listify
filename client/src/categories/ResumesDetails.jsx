// ResumesDetails.js
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
  GraduationCap,
  Award,
  FileText,
  Languages,
  User,
  Download,
} from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function ResumesDetails() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    try {
      const foundResume = data.resumes.find((r) => r.id === parseInt(id));
      if (!foundResume) {
        setError("Resume not found");
      } else {
        setResume(foundResume);
        setSelectedImage(foundResume.images[0]);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load resume data");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
    setSavedItems(saved);
  }, [id]);

  const isSaved = savedItems.some((h) => h.id === resume?.id);

  const toggleSave = () => {
    if (!resume) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedItems.filter((h) => h.id !== resume.id);
    } else {
      newSaved = [...savedItems, resume];
    }
    setSavedItems(newSaved);
    localStorage.setItem("savedItems", JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent("savedItemsChanged"));
  };

  const shareResume = () => {
    if (navigator.share) {
      navigator.share({
        title: `${resume.name} - Resume`,
        text: resume.experience,
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

  // Extract candidate category from skills/experience
  const extractCandidateCategory = (resume) => {
    const skills = resume.skills.join(" ").toLowerCase();
    const experience = resume.experience.toLowerCase();

    if (skills.includes("react") || skills.includes("javascript") || skills.includes("developer"))
      return "technology";
    if (skills.includes("design") || skills.includes("ui") || skills.includes("ux"))
      return "design";
    if (skills.includes("manager") || skills.includes("lead") || experience.includes("management"))
      return "management";
    if (skills.includes("sales") || skills.includes("marketing"))
      return "sales";
    if (skills.includes("teacher") || skills.includes("education"))
      return "education";
    if (skills.includes("health") || skills.includes("care"))
      return "healthcare";
    if (skills.includes("customer") || skills.includes("support"))
      return "customer service";
    if (skills.includes("finance") || skills.includes("accounting"))
      return "finance";
    if (skills.includes("engineer") || experience.includes("engineering"))
      return "engineering";

    return "professional";
  };

  // Get candidate category color
  const getCandidateCategoryColor = (category) => {
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
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Extract features from experience and skills
  const extractFeatures = (resume) => {
    const features = [];
    const experience = resume.experience.toLowerCase();
    const skills = resume.skills.join(" ").toLowerCase();

    if (experience.includes("senior") || experience.includes("lead")) features.push("Senior Level Experience");
    if (experience.includes("remote") || skills.includes("remote")) features.push("Remote Work Experience");
    if (experience.includes("team") || skills.includes("collaboration")) features.push("Team Collaboration");
    if (skills.includes("communication") || experience.includes("communication")) features.push("Excellent Communication");
    if (skills.includes("problem") || experience.includes("problem")) features.push("Problem Solving Skills");
    if (skills.includes("leadership") || experience.includes("lead")) features.push("Leadership Qualities");
    if (experience.includes("project") || skills.includes("project")) features.push("Project Management");
    if (skills.includes("analytical") || experience.includes("analysis")) features.push("Analytical Thinking");
    if (skills.includes("creative") || experience.includes("creative")) features.push("Creative Mindset");
    if (experience.includes("fast-paced") || skills.includes("adapt")) features.push("Adaptable to Change");

    // Add default features if none found
    if (features.length === 0) {
      features.push(
        "Professional Experience",
        "Strong Work Ethic",
        "Quick Learner",
        "Reliable & Punctual"
      );
    }

    return features.slice(0, 6);
  };

  // Get similar resumes (exclude current resume)
  const getSimilarResumes = () => {
    if (!resume) return [];
    return data.resumes.filter((r) => r.id !== resume.id).slice(0, 6);
  };

  // Extract resume details
  const extractResumeDetails = (resume) => {
    return {
      experienceLevel: "5+ years",
      education: "Bachelor's Degree",
      availability: "Immediate",
      workPreference: "Full-time",
      languages: "English, Spanish",
      certifications: "3 Professional Certifications",
      expectedSalary: "$75,000 - $95,000",
      noticePeriod: "2 weeks",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F3A63] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading resume details...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Resume Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The resume you're looking for doesn't exist.
          </p>
          <Link
            to="/categories/resumes"
            className="bg-[#2F3A63] text-white px-6 py-3 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resumes
          </Link>
        </div>
      </div>
    );
  }

  const candidateCategory = extractCandidateCategory(resume);
  const candidateCategoryColor = getCandidateCategoryColor(candidateCategory);
  const features = extractFeatures(resume);
  const resumeDetails = extractResumeDetails(resume);
  const similarResumes = getSimilarResumes();
  
  const displayImages = resume.images.length < 4
    ? [...resume.images, ...Array(4 - resume.images.length).fill(resume.images[0])]
    : resume.images.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/categories/resumes"
              className="inline-flex items-center text-[#2F3A63] font-medium hover:text-[#1E2A4D] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Resumes
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={shareResume}
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
                  alt={resume.name}
                  className="w-full h-100 object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${candidateCategoryColor}`}>
                    {candidateCategory.charAt(0).toUpperCase() + candidateCategory.slice(1)} Professional
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
                        ? " ring-[#2F3A63] ring-opacity-20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${resume.name} - ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header with Name and Title */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {resume.name}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{resume.location}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#2F3A63] mb-1">
                      Available for Work
                    </div>
                    <div className="text-sm text-gray-500">Active Candidate</div>
                  </div>
                </div>

                {/* Enhanced Resume Stats */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {/* Experience */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Award className="w-6 h-6 text-[#2F3A63]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Experience</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {resumeDetails.experienceLevel}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <GraduationCap className="w-6 h-6 text-[#2F3A63]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Education</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {resumeDetails.education}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Clock className="w-6 h-6 text-[#2F3A63]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Availability</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {resumeDetails.availability}
                      </div>
                    </div>

                    {/* Expected Salary */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 border border-gray-200">
                        <Briefcase className="w-6 h-6 text-[#2F3A63]" />
                      </div>
                      <div className="text-sm text-gray-600 mb-1">Expected Salary</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {resumeDetails.expectedSalary}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Resume Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <User className="w-5 h-5 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Work Preference</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {resumeDetails.workPreference}
                    </div>
                  </div>
                  <div className="text-center">
                    <Languages className="w-5 h-5 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Languages</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {resumeDetails.languages}
                    </div>
                  </div>
                  <div className="text-center">
                    <FileText className="w-5 h-5 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Certifications</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {resumeDetails.certifications}
                    </div>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-5 h-5 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Notice Period</div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {resumeDetails.noticePeriod}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="px-6 flex space-x-8 overflow-x-auto">
                  {["overview", "skills", "experience"].map((tab) => (
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
                        Professional Summary
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {resume.experience}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Key Strengths
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

                {activeTab === "skills" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Technical Skills
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {resume.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="bg-[#2F3A63]/10 text-[#2F3A63] px-4 py-2 rounded-lg text-sm font-medium border border-[#2F3A63]/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Professional Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Experience Level</span>
                            <span className="font-medium">
                              {resumeDetails.experienceLevel}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Education</span>
                            <span className="font-medium">
                              {resumeDetails.education}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Work Preference</span>
                            <span className="font-medium">
                              {resumeDetails.workPreference}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Availability</span>
                            <span className="font-medium">
                              {resumeDetails.availability}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Additional Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Languages</span>
                            <span className="font-medium">
                              {resumeDetails.languages}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Certifications</span>
                            <span className="font-medium">
                              {resumeDetails.certifications}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Expected Salary</span>
                            <span className="font-medium text-green-600">
                              {resumeDetails.expectedSalary}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Notice Period</span>
                            <span className="font-medium">
                              {resumeDetails.noticePeriod}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "experience" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Work Experience & Background
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {resume.experience}
                      </p>

                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Senior Developer</h4>
                          <p className="text-sm text-gray-600 mb-2">Tech Solutions Inc. • 2020 - Present</p>
                          <p className="text-gray-700">Led development teams and delivered multiple successful projects.</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Software Engineer</h4>
                          <p className="text-sm text-gray-600 mb-2">Digital Innovations • 2018 - 2020</p>
                          <p className="text-gray-700">Developed and maintained enterprise-level applications.</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Junior Developer</h4>
                          <p className="text-sm text-gray-600 mb-2">StartUp Co. • 2016 - 2018</p>
                          <p className="text-gray-700">Gained foundational experience in software development practices.</p>
                        </div>
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
                Contact Candidate
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={resume.images[0]}
                  alt={resume.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {resume.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Professional Candidate
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      (15 reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${resume.contactEmail}?subject=Interest in Your Resume`}
                  className="w-full bg-[#2F3A63] text-white py-3 px-4 rounded-lg cursor-pointer hover:bg-[#1E2A4D] transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Candidate
                </a>

                <button className="w-full border border-[#2F3A63] text-[#2F3A63] py-3 px-4 rounded-lg hover:bg-[#2F3A63] hover:text-white transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <FaComments className="w-4 h-4" />
                  Schedule Interview
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Posted {resume.posted}
                </div>
              </div>
            </div>

            {/* Download Resume Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Download Resume
              </h3>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Download className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800">Resume Available</div>
                      <div className="text-sm text-green-600">Full PDF document</div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                  <FileText className="w-5 h-5" />
                  Download Resume PDF
                </button>

                <div className="text-center text-sm text-gray-600">
                  Includes complete work history, education, and references
                </div>
              </div>
            </div>

            {/* Similar Resumes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#2F3A63]" />
                  Similar Candidates ({similarResumes.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {similarResumes.map((similarResume) => {
                  const similarCategory = extractCandidateCategory(similarResume);
                  const similarCategoryColor = getCandidateCategoryColor(similarCategory);
                  
                  return (
                    <Link
                      key={similarResume.id}
                      to={`/categories/resumes/${similarResume.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex gap-3">
                        <img
                          src={similarResume.images[0]}
                          alt={similarResume.name}
                          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                              {similarResume.name}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${similarCategoryColor}`}
                            >
                              {similarCategory.charAt(0).toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-600 truncate">
                              {similarResume.location.split(",")[0]}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <Briefcase className="w-3 h-3" />
                            <span className="truncate">{similarResume.experience.split(".")[0]}</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {similarResume.skills.slice(0, 2).map((skill, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {similarResume.posted}
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
                  to="/categories/resumes"
                  className="w-full text-center text-[#2F3A63] font-medium hover:text-[#1E2A4D] transition-colors text-sm inline-flex items-center justify-center gap-1"
                >
                  View All Candidates
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

export default ResumesDetails;