// GigsDetails.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Calendar,
  Clock,
  Share2,
  Heart,
  Phone,
  Mail,
  CheckCircle,
  Loader,
} from "lucide-react";
import data from "../data/data.json";

function GigsDetails() {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Get real images for gigs
  const getGigImage = (gigType) => {
    const imageMap = {
      music:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      creative:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      technical:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      food: "https://images.unsplash.com/photo-1559314809-0f1555a0e4ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      event:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      labor:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      professional:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    };
    return (
      imageMap[gigType] ||
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    );
  };

  // Extract gig type
  const getGigType = (title, description) => {
    const text = (title + description).toLowerCase();
    if (text.includes("music") || text.includes("dj") || text.includes("band"))
      return "music";
    if (
      text.includes("design") ||
      text.includes("creative") ||
      text.includes("art")
    )
      return "creative";
    if (
      text.includes("tech") ||
      text.includes("web") ||
      text.includes("developer")
    )
      return "technical";
    if (
      text.includes("food") ||
      text.includes("coffee") ||
      text.includes("restaurant")
    )
      return "food";
    if (
      text.includes("event") ||
      text.includes("party") ||
      text.includes("wedding")
    )
      return "event";
    if (
      text.includes("labor") ||
      text.includes("construction") ||
      text.includes("repair")
    )
      return "labor";
    return "professional";
  };

  useEffect(() => {
    const foundGig = data.gigs.find((g) => g.id === parseInt(id));
    if (foundGig) {
      const gigType = getGigType(foundGig.title, foundGig.description);
      const gigImage = getGigImage(gigType);

      const enhancedGig = {
        ...foundGig,
        type: gigType,
        image: gigImage,
        rating: 4.5,
        reviews: 24,
        contact: {
          phone: "+1 (555) 123-4567",
          email: "contact@example.com",
        },
        requirements: [
          "Previous experience preferred",
          "Good communication skills",
          "Reliable and punctual",
          "Positive attitude",
        ],
      };

      setGig(enhancedGig);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#2F3A63] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading gig details...</p>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Gig not found</p>
          <Link
            to="/categories/gigs"
            className="text-[#2F3A63] hover:text-[#2F3A63]/80"
          >
            Back to Gigs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/categories/gigs"
              className="flex items-center text-[#2F3A63] hover:text-[#2F3A63]/80 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Gigs</span>
            </Link>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-[#2F3A63]/70 hover:text-[#2F3A63] transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSaved(!saved)}
                className={`p-2 transition-colors ${
                  saved ? "text-red-500" : "text-[#2F3A63]/70 hover:text-[#2F3A63]"
                }`}
              >
                <Heart className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Image */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative aspect-[4/3] bg-gray-200">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="w-8 h-8 text-[#2F3A63] animate-spin" />
                </div>
              )}
              <img
                src={gig.image}
                alt={gig.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImageLoading(false)}
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-3">
              <span className="bg-[#2F3A63]/10 text-[#2F3A63] text-sm px-3 py-1 rounded-full capitalize">
                {gig.type}
              </span>
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                {gig.posted}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {gig.title}
            </h1>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-medium text-gray-700">{gig.rating}</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{gig.reviews} reviews</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4 text-[#2F3A63]" />
              <span>{gig.location}</span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {gig.description}
            </p>

            {/* Price & Apply */}
            <div className="bg-[#2F3A63]/5 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    {gig.pay}
                  </span>
                  <p className="text-gray-600 text-sm">Gig rate</p>
                </div>
                <button className="bg-[#2F3A63] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2F3A63]/90 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-4 h-4 text-[#2F3A63]" />
                  <span>{gig.contact.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-4 h-4 text-[#2F3A63]" />
                  <span>{gig.contact.email}</span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="border-t pt-6 mt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <p className="font-medium text-gray-900">Flexible</p>
                  <p className="text-gray-600">Schedule</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <p className="font-medium text-gray-900">Immediate</p>
                  <p className="text-gray-600">Start</p>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Requirements
            </h3>
            <ul className="space-y-2">
              {gig.requirements.map((req, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 text-gray-700"
                >
                  <span className="w-2 h-2 bg-[#2F3A63] rounded-full mt-2 flex-shrink-0"></span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
            <div className="h-64 rounded-lg overflow-hidden bg-gray-200">
              <iframe
                title="Gig Location"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  gig.location
                )}&output=embed`}
                className="border-0"
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {/* Left Column - Image & Details */}
          <div className="col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative aspect-[16/9] bg-gray-200">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader className="w-8 h-8 text-[#2F3A63] animate-spin" />
                  </div>
                )}
                <img
                  src={gig.image}
                  alt={gig.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImageLoading(false)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About This Gig
              </h2>
              <p className="text-gray-700 leading-relaxed">{gig.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Requirements
              </h3>
              <ul className="space-y-2">
                {gig.requirements.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 text-gray-700"
                  >
                    <span className="w-2 h-2 bg-[#2F3A63] rounded-full mt-2 flex-shrink-0"></span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
              <div className="h-80 rounded-lg overflow-hidden bg-gray-200">
                <iframe
                  title="Gig Location"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    gig.location
                  )}&output=embed`}
                  className="border-0"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              {/* Category & Date */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-[#2F3A63]/10 text-[#2F3A63] text-sm px-3 py-1 rounded-full capitalize">
                  {gig.type}
                </span>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  {gig.posted}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {gig.title}
              </h1>

              {/* Rating & Location */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium text-gray-700">
                      {gig.rating}
                    </span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{gig.reviews} reviews</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-[#2F3A63]" />
                  <span>{gig.location}</span>
                </div>
              </div>

              {/* Price & Apply */}
              <div className="bg-[#2F3A63]/5 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <span className="text-3xl font-bold text-gray-900 block mb-1">
                    {gig.pay}
                  </span>
                  <p className="text-gray-600 text-sm mb-4">Gig rate</p>
                  <button className="w-full bg-[#2F3A63] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2F3A63]/90 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="w-4 h-4 text-[#2F3A63]" />
                    <span>{gig.contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-4 h-4 text-[#2F3A63]" />
                    <span>{gig.contact.email}</span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="border-t pt-6 mt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="font-medium text-gray-900">Flexible</p>
                    <p className="text-gray-600">Schedule</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="font-medium text-gray-900">Immediate</p>
                    <p className="text-gray-600">Start</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Apply Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6">
          <div>
            <span className="text-xl font-bold text-gray-900 block">
              {gig.pay}
            </span>
            <span className="text-gray-600 text-sm">Apply now</span>
          </div>
          <button className="bg-[#2F3A63] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2F3A63]/90 transition-colors">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default GigsDetails;