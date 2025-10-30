import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaTools,
  FaBriefcase,
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaUserTie,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaShieldAlt,
  FaRocket,
  FaExclamationTriangle,
  FaGlobeAmericas,
  FaDollarSign,
  FaTag,
} from "react-icons/fa";

const PostAdd = ({ data, setData }) => {
  const [formData, setFormData] = useState({
    postType: "",
    intent: "offering",
    title: "",
    city: "",
    zipcode: "",
    description: "",
    email: "",
    phone: "",
    price: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepDirection, setStepDirection] = useState("forward");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const categoryOptions = [
    {
      value: "houses",
      label: "Real Estate",
      icon: FaHome,
      desc: "Properties & rentals",
    },
    {
      value: "sales",
      label: "For Sale",
      icon: FaShoppingCart,
      desc: "Items & merchandise",
    },
    {
      value: "services",
      label: "Services",
      icon: FaTools,
      desc: "Professional services",
    },
    {
      value: "gigs",
      label: "Gigs",
      icon: FaBriefcase,
      desc: "Short-term work",
    },
    {
      value: "jobs",
      label: "Jobs",
      icon: FaUserTie,
      desc: "Employment opportunities",
    },
    {
      value: "community",
      label: "Events",
      icon: FaCalendarAlt,
      desc: "Community events",
    },
    {
      value: "forums",
      label: "Discussion",
      icon: FaComments,
      desc: "Forums & talks",
    },
    {
      value: "resumes",
      label: "Resumes",
      icon: FaFileAlt,
      desc: "Job seekers",
    },
  ];

  const steps = [
    { number: 1, title: "Category", icon: FaTag },
    { number: 2, title: "Details", icon: FaFileAlt },
    { number: 3, title: "Location", icon: FaMapMarkerAlt },
    { number: 4, title: "Contact", icon: FaPhone },
  ];

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.postType) newErrors.postType = "Please select a category";
        if (!formData.intent) newErrors.intent = "Please select post intent";
        break;
      case 2:
        if (!formData.title?.trim()) newErrors.title = "Title is required";
        if (!formData.description?.trim())
          newErrors.description = "Description is required";
        if (formData.description?.length > 500)
          newErrors.description =
            "Description must be less than 500 characters";
        break;
      case 3:
        if (!formData.city?.trim()) newErrors.city = "City is required";
        if (!formData.zipcode?.trim())
          newErrors.zipcode = "ZIP code is required";
        break;
      case 4:
        if (!formData.email?.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Please enter a valid email address";
        if (!formData.phone?.trim())
          newErrors.phone = "Phone number is required";
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategorySelect = (value) => {
    setFormData((prev) => ({ ...prev, postType: value }));
    if (errors.postType) {
      setErrors((prev) => ({ ...prev, postType: "" }));
    }
  };

  const handleIntentSelect = (value) => {
    setFormData((prev) => ({ ...prev, intent: value }));
    if (errors.intent) {
      setErrors((prev) => ({ ...prev, intent: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const maxExistingId = Math.max(
        ...Object.values(data)
          .flat()
          .map((item) => item.id),
        0
      );
      const newId = maxExistingId + 1;

      const categoryMap = {
        houses: "houses",
        sales: "sales",
        services: "services",
        gigs: "gigs",
        jobs: "jobs",
        community: "community",
        forums: "forums",
        resumes: "resumes",
      };

      const category = categoryMap[formData.postType] || "houses";

      const newItem = {
        id: newId,
        title: formData.title,
        type: formData.postType,
        intent: formData.intent,
        price: formData.price ? parseInt(formData.price) : 0,
        description: formData.description,
        location: `${formData.city}, ${formData.zipcode}`,
        contactEmail: formData.email,
        sellerName: "You",
        sellerPhone: formData.phone,
        sellerImage: "https://randomuser.me/api/portraits/men/1.jpg",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
        ],
        createdAt: new Date().toISOString(),
        status: "active",
      };

      setData((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), newItem],
      }));

      setIsSubmitting(false);
      navigate(`/categories/${category}/${newId}`);
    } catch (error) {
      setIsSubmitting(false);
      alert("Failed to create post. Please try again.");
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setStepDirection("forward");
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStepDirection("backward");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All progress will be lost."
      )
    ) {
      navigate("/");
    }
  };

  const getStepContent = () => {
    const stepContent = {
      1: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-green-700 mb-3">
              Select Category
            </h2>
            <p className="text-gray-600">
              Choose the most relevant category for your post
            </p>
          </div>

          {/* Category Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {categoryOptions.map((item) => (
              <div
                key={item.value}
                onClick={() => handleCategorySelect(item.value)}
                className="relative cursor-pointer group transition-all duration-300"
              >
                <div
                  className={`p-5 rounded-xl border-2 text-center h-full flex flex-col items-center justify-center transition-all duration-300 ${
                    formData.postType === item.value
                      ? "border-green-600 bg-green-50 shadow-md ring-2 ring-green-500 ring-opacity-20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {/* Checkmark Badge */}
                  {formData.postType === item.value && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounceIn">
                      <FaCheck className="text-white text-xs font-bold" />
                    </div>
                  )}

                  <item.icon
                    className={`text-2xl mb-3 transition-colors duration-300 ${
                      formData.postType === item.value
                        ? "text-green-600"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  />
                  <div className="font-semibold text-green-700 text-sm mb-1">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 leading-tight">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.postType && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg border border-red-200">
              <FaExclamationTriangle className="flex-shrink-0" />
              {errors.postType}
            </div>
          )}

          {/* Post Type Selection */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
              <FaGlobeAmericas className="text-green-600" />
              Post Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Offering Option */}
              <div
                onClick={() => handleIntentSelect("offering")}
                className="relative cursor-pointer transition-all duration-300"
              >
                <div
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.intent === "offering"
                      ? "border-green-600 bg-green-50 shadow-md ring-2 ring-green-500 ring-opacity-20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {/* Checkmark Badge */}
                  {formData.intent === "offering" && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounceIn">
                      <FaCheck className="text-white text-xs font-bold" />
                    </div>
                  )}

                  <div className="flex items-center">
                    <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                      <FaShoppingCart className="text-sm" />
                    </div>
                    <div>
                      <div className="font-semibold text-green-700">
                        Offering
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Selling items, providing services, renting
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seeking Option */}
              <div
                onClick={() => handleIntentSelect("hiring")}
                className="relative cursor-pointer transition-all duration-300"
              >
                <div
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.intent === "hiring"
                      ? "border-green-600 bg-green-50 shadow-md ring-2 ring-green-500 ring-opacity-20"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {/* Checkmark Badge */}
                  {formData.intent === "hiring" && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounceIn">
                      <FaCheck className="text-white text-xs font-bold" />
                    </div>
                  )}

                  <div className="flex items-center">
                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg mr-3">
                      <FaBriefcase className="text-sm" />
                    </div>
                    <div>
                      <div className="font-semibold text-green-700">
                        Seeking
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Looking to hire, buy, or find services
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {errors.intent && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-3 bg-red-50 px-4 py-2 rounded-lg">
                <FaExclamationTriangle className="flex-shrink-0" />
                {errors.intent}
              </div>
            )}
          </div>
        </div>
      ),

      2: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-green-700 mb-3">
              Post Details
            </h2>
            <p className="text-gray-600">
              Provide detailed information about your listing
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-green-700 font-medium mb-3">
                Title *
              </label>
              <input
                name="title"
                placeholder="e.g., Professional web development services"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 outline-none transition-colors ${
                  errors.title
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-100"
                }`}
                required
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-green-700 font-medium mb-3 flex items-center gap-2">
                <FaDollarSign className="text-gray-500" />
                Price (Optional)
              </label>
              <input
                type="number"
                name="price"
                placeholder="Enter amount in USD"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-green-700 font-medium mb-3">
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Describe your post in detail. Include important information, requirements, or specifications..."
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 outline-none transition-colors resize-none ${
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-100"
                }`}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <div>
                  {errors.description ? (
                    <span className="text-red-600 text-sm flex items-center gap-2">
                      <FaExclamationTriangle className="flex-shrink-0" />
                      {errors.description}
                    </span>
                  ) : (
                    <span
                      className={`text-sm ${
                        formData.description.length > 450
                          ? "text-amber-600"
                          : "text-gray-500"
                      }`}
                    >
                      {formData.description.length}/500 characters
                    </span>
                  )}
                </div>
                {formData.description.length > 450 && !errors.description && (
                  <span className="text-amber-600 text-sm flex items-center gap-2">
                    <FaExclamationTriangle className="flex-shrink-0" />
                    Approaching character limit
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ),

      3: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-green-700 mb-3">
              Location Information
            </h2>
            <p className="text-gray-600">Where is this located?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-green-700 font-medium mb-3">
                City *
              </label>
              <input
                name="city"
                placeholder="Enter city name"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 outline-none transition-colors ${
                  errors.city
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-100"
                }`}
                required
              />
              {errors.city && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  {errors.city}
                </p>
              )}
            </div>
            <div>
              <label className="block text-green-700 font-medium mb-3">
                ZIP Code *
              </label>
              <input
                name="zipcode"
                placeholder="Enter ZIP code"
                value={formData.zipcode}
                onChange={handleInputChange}
                className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 outline-none transition-colors ${
                  errors.zipcode
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-100"
                }`}
                required
              />
              {errors.zipcode && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  {errors.zipcode}
                </p>
              )}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-5 bg-gray-50 mt-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 text-green-600 p-2 rounded-lg mt-1">
                <FaShieldAlt className="text-lg" />
              </div>
              <div>
                <h4 className="font-medium text-green-700 mb-1">
                  Your Privacy Matters
                </h4>
                <p className="text-gray-600 text-sm">
                  Only the city and ZIP code will be visible to other users.
                  Your exact address remains private and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),

      4: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-green-700 mb-3">
              Contact Details
            </h2>
            <p className="text-gray-600">How should people contact you?</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-green-700 font-medium mb-3 flex items-center gap-2">
                <FaEnvelope className="text-gray-500" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 outline-none transition-colors ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-100"
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-green-700 font-medium mb-3 flex items-center gap-2">
                <FaPhone className="text-gray-500" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full border-2 rounded-lg px-4 py-3 focus:ring-2 outline-none transition-colors ${
                  errors.phone
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-100"
                }`}
                required
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="border border-green-200 rounded-lg p-5 bg-green-50 mt-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 text-green-600 p-2 rounded-lg mt-1">
                <FaCheck className="text-lg" />
              </div>
              <div>
                <h4 className="font-medium text-green-800 mb-1">
                  Ready to Publish
                </h4>
                <p className="text-green-700 text-sm">
                  Review your information carefully. Once published, your
                  listing will be visible to other users.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    };

    return (
      <div
        className={`transition-all duration-500 ease-in-out ${
          stepDirection === "forward"
            ? "animate-slideInFromRight"
            : "animate-slideInFromLeft"
        }`}
      >
        {stepContent[currentStep]}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl w-full max-w-7xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-green-700">
                Create New Post
              </h1>
              <p className="text-gray-600 mt-1">
                Complete all steps to publish your listing
              </p>
            </div>
            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium">
              Step {currentStep} of 4
            </div>
          </div>

          {/* Enhanced Progress Steps */}
          <div className="flex justify-between items-center relative px-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                {/* Step Circle */}
                <div className="flex flex-col items-center z-10 relative">
                  <div className="relative">
                    {/* Pulse animation for current step */}
                    {currentStep === step.number && (
                      <div className="absolute -inset-2 bg-green-100 rounded-full animate-pulse"></div>
                    )}

                    <div
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        currentStep >= step.number
                          ? "bg-green-600 border-green-600 text-white shadow-lg"
                          : "bg-white border-gray-300 text-gray-400"
                      } ${
                        currentStep === step.number
                          ? "ring-4 ring-green-100 scale-110"
                          : ""
                      }`}
                    >
                      {currentStep > step.number ? (
                        <FaCheck className="text-sm font-bold" />
                      ) : (
                        <step.icon className="text-sm" />
                      )}

                      <div
                        className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center transition-all duration-300 ${
                          currentStep >= step.number
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {step.number}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`mt-3 text-sm font-medium transition-all duration-300 ${
                      currentStep >= step.number
                        ? "text-green-600 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Progress Line between steps */}
                {index < steps.length - 1 && (
                  <div className="flex-1 relative h-2 mx-2">
                    {/* Background Track */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200 rounded-full"></div>

                    {/* Animated Progress Line */}
                    <div
                      className="absolute top-0 left-0 h-0.5 bg-green-600 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width:
                          currentStep > step.number
                            ? "100%"
                            : currentStep === step.number
                            ? "50%"
                            : "0%",
                      }}
                    >
                      {/* Moving Dot */}
                      {currentStep === step.number + 1 && (
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-600 rounded-full shadow-lg animate-ping-slow"></div>
                      )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Progress Bar */}
          <div className="mt-6 lg:hidden">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Category</span>
              <span>Details</span>
              <span>Location</span>
              <span>Contact</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit}>
            {getStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={currentStep === 1 ? handleCancel : prevStep}
                disabled={isSubmitting}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <FaArrowLeft className="text-sm" />
                {currentStep === 1 ? "Cancel" : "Back"}
              </button>

              <div className="flex gap-3">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Continue
                    <FaArrowRight className="text-sm" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <FaRocket className="text-sm" />
                        Publish Post
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-slideInFromRight {
          animation: slideInFromRight 0.3s ease-out;
        }

        .animate-slideInFromLeft {
          animation: slideInFromLeft 0.3s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-bounceIn {
          animation: bounceIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PostAdd;
