import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const emptyFields = Object.entries(formData).filter(([_, v]) => v === "");
    if (emptyFields.length) {
      alert("Please fill all required fields.");
      setIsSubmitting(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const maxExistingId = Math.max(...Object.values(data).flat().map((item) => item.id), 0);
    const newId = maxExistingId + 1;

    const newItem = {
      id: newId,
      title: formData.title,
      type:
        formData.postType === "house for sale"
          ? "sale"
          : formData.postType === "house for rent"
          ? "rent"
          : formData.postType.split(" ").pop().toLowerCase(),
      price:
        formData.intent === "hiring"
          ? 0
          : parseInt(prompt("Enter price (e.g., 25 for gigs, 1500 for rent)")) || 0,
      description: formData.description,
      location: `${formData.city}, ${formData.zipcode}`,
      contactEmail: formData.email,
      sellerName: "You",
      sellerPhone: formData.phone,
      sellerImage: "https://randomuser.me/api/portraits/men/1.jpg",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
      ],
    };

    const categoryMap = {
      "houses": "houses",
      "sales": "sales",
      "service offered": "services",
      "gigs": "gigs",
      "jobs": "jobs",
      "community event": "community",
      "discussions-fourums": "forums",
      "resumes": "resumes",
    };

    const category = categoryMap[formData.postType] || "houses";
    setData((prev) => ({
      ...prev,
      [category]: [...prev[category], newItem],
    }));

    setIsSubmitting(false);
    alert("✅ Post added successfully!");
    navigate(`/${category}/${newId}`);
  };

  const handleCancel = () => {
    navigate("/");
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { number: 1, title: "Category", icon: "📋" },
    { number: 2, title: "Details", icon: "📝" },
    { number: 3, title: "Location", icon: "📍" },
    { number: 4, title: "Contact", icon: "📞" }
  ];

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden">
        
        {/* Progress Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
              <p className="text-gray-600 mt-1">Share your listing in just a few steps</p>
            </div>
            <div className="bg-[#2F3A63] text-white px-4 py-2 rounded-full text-sm font-medium">
              Step {currentStep} of 4
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between relative">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  currentStep >= step.number 
                    ? 'bg-[#2F3A63] border-[#2F3A63] text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <span className="text-lg">{step.icon}</span>
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-[#2F3A63]' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <div 
                className="h-full bg-[#2F3A63] transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Category & Intent */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">What are you posting?</h2>
                  <p className="text-gray-600 mt-2">Choose the category that best fits your post</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { value: "houses", label: "🏠 Houses", desc: "Real estate" },
                    { value: "sales", label: "🛒 Sales", desc: "Items for sale" },
                    { value: "service", label: "🔧 Service", desc: "Services offered" },
                    { value: "gigs", label: "💼 Gigs", desc: "Short-term work" },
                    { value: "jobs", label: "👔 Jobs", desc: "Employment" },
                    { value: "community event", label: "🎪 Events", desc: "Community events" },
                    { value: "discussions-forums", label: "💬 Forums", desc: "Discussions" },
                    { value: "resumes", label: "📄 Resumes", desc: "Job seekers" }
                  ].map((item) => (
                    <label key={item.value} className={`relative cursor-pointer group ${
                      formData.postType === item.value ? 'ring-2 ring-[#2F3A63]' : ''
                    }`}>
                      <input
                        type="radio"
                        name="postType"
                        value={item.value}
                        checked={formData.postType === item.value}
                        onChange={handleInputChange}
                        className="absolute opacity-0"
                      />
                      <div className={`p-4 rounded-xl border-2 text-center transition-all ${
                        formData.postType === item.value 
                          ? 'border-[#2F3A63] bg-[#2F3A63]/5' 
                          : 'border-gray-200 group-hover:border-gray-300 bg-white'
                      }`}>
                        <div className="text-2xl mb-2">{item.label.split(' ')[0]}</div>
                        <div className="font-medium text-gray-900 text-sm">{item.label.split(' ').slice(1).join(' ')}</div>
                        <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Post Intent</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.intent === "offering" 
                        ? 'border-[#2F3A63] bg-white shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="intent"
                        value="offering"
                        checked={formData.intent === "offering"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">I'm Offering</div>
                        <div className="text-sm text-gray-600">Renting, providing services, selling items</div>
                      </div>
                    </label>
                    
                    <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.intent === "hiring" 
                        ? 'border-[#2F3A63] bg-white shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="intent"
                        value="hiring"
                        checked={formData.intent === "hiring"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">I'm Looking For</div>
                        <div className="text-sm text-gray-600">Hiring, buying, seeking services</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Post Details</h2>
                  <p className="text-gray-600 mt-2">Tell us more about your post</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Post Title *</label>
                    <input
                      name="title"
                      placeholder="e.g., Professional web development services"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#2F3A63] focus:ring-2 focus:ring-[#2F3A63]/20 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Description *</label>
                    <textarea
                      name="description"
                      placeholder="Describe your post in detail. Include important information, requirements, or specifications..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#2F3A63] focus:ring-2 focus:ring-[#2F3A63]/20 outline-none transition-all resize-none"
                      required
                    />
                    <div className="text-sm text-gray-500 mt-2">
                      {formData.description.length}/500 characters
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Location Details</h2>
                  <p className="text-gray-600 mt-2">Where is this located?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">City *</label>
                    <input
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#2F3A63] focus:ring-2 focus:ring-[#2F3A63]/20 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">ZIP Code *</label>
                    <input
                      name="zipcode"
                      placeholder="Enter ZIP code"
                      value={formData.zipcode}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#2F3A63] focus:ring-2 focus:ring-[#2F3A63]/20 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#2F3A63] text-white p-3 rounded-xl">
                      <span className="text-xl">📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Location Privacy</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Your exact address will not be shown publicly. Only the city and ZIP code will be visible to other users.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                  <p className="text-gray-600 mt-2">How can people reach you?</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#2F3A63] focus:ring-2 focus:ring-[#2F3A63]/20 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#2F3A63] focus:ring-2 focus:ring-[#2F3A63]/20 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500 text-white p-3 rounded-xl">
                      <span className="text-xl">✅</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">Ready to Publish!</h4>
                      <p className="text-green-700 text-sm mt-1">
                        Review your information and click "Publish Post" to make your listing live.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={currentStep === 1 ? handleCancel : prevStep}
                disabled={isSubmitting}
                className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium disabled:opacity-50"
              >
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </button>

              <div className="flex gap-4">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.postType || !formData.intent}
                    className="px-8 py-3 bg-[#2F3A63] text-white rounded-xl hover:bg-[#253156] transition-all font-medium shadow-lg shadow-[#2F3A63]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Continue
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PostAdd;