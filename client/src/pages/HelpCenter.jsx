import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronDown,
  Search,
  X,
  Send,
  HelpCircle,
  Mail,
  MessageCircle,
} from "lucide-react";
import Lottie from "lottie-react";
import ContactUs from '../components/lottie/ContactUs.json';

const HelpCenter = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const nameRef = useRef(null);

  // FAQ data separated for better maintainability
  const faqSections = [
    {
      id: "account",
      title: "Account Management",
      icon: "👤",
      items: [
        {
          question: "How do I create an account?",
          answer:
            "Visit the sign-up page and follow the prompts to register with your email. You'll need to verify your email address to complete the registration process.",
        },
        {
          question: "How do I reset my password?",
          answer:
            "Click 'Forgot Password' on the login screen and follow the email instructions. The password reset link will expire in 1 hour for security reasons.",
        },
        {
          question: "Can I change my email address?",
          answer:
            "Yes, you can change your email in account settings. You'll need to verify the new email address before it becomes active.",
        },
      ],
    },
    {
      id: "posting",
      title: "Posting and Managing Listings",
      icon: "📝",
      items: [
        {
          question: "How do I post a new ad?",
          answer:
            "Navigate to 'Post Ads' in the menu and fill out the form with your listing details. Make sure to include clear photos and accurate descriptions for better engagement.",
        },
        {
          question: "How do I edit or delete a listing?",
          answer:
            "Go to your dashboard, find the listing, and use the edit/delete options. You can only edit active listings, and deleted listings cannot be recovered.",
        },
        {
          question: "Why was my listing rejected?",
          answer:
            "Listings may be rejected if they violate our community guidelines, contain prohibited items, or have incomplete information. Check your email for specific reasons.",
        },
      ],
    },
    {
      id: "pricing",
      title: "Pricing and Payments",
      icon: "💰",
      items: [
        {
          question: "Are there any fees for posting?",
          answer:
            "Basic postings are free for up to 5 listings per month. Premium features and additional listings may require payment. View our pricing page for details.",
        },
        {
          question: "How do I handle payments?",
          answer:
            "We provide a secure payment gateway for transactions. We recommend using our integrated payment system for buyer and seller protection.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept credit cards, debit cards, PayPal, and bank transfers for premium features. Local payment options may vary by region.",
        },
      ],
    },
    {
      id: "safety",
      title: "Safety and Security",
      icon: "🛡",
      items: [
        {
          question: "How do I report a suspicious user?",
          answer:
            "Use the report button on their profile or listing. You can also contact our safety team directly through this form with specific details.",
        },
        {
          question: "What measures do you take for security?",
          answer:
            "We use end-to-end encryption, two-factor authentication, and manual verification for high-value transactions. All data is stored securely following GDPR guidelines.",
        },
        {
          question: "How can I stay safe during meetings?",
          answer:
            "Always meet in public places, bring a friend, and verify the other party's identity. Use our verified user system for added security.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: "🔧",
      items: [
        {
          question: "Why isn't my ad showing up?",
          answer:
            "New ads undergo a brief review process (usually 1-2 hours). If it's still not visible after 24 hours, check your email for notifications or contact support.",
        },
        {
          question: "How do I contact tech support?",
          answer:
            "Use the form on this page for general inquiries. For urgent technical issues, include 'URGENT' in your subject line for faster response.",
        },
        {
          question: "The website/app is not loading properly",
          answer:
            "Clear your browser cache and cookies, or try updating the app. If issues persist, describe the problem in detail including your device and browser information.",
        },
      ],
    },
  ];

  // Initialize expanded sections
  useEffect(() => {
    const initialExpandedState = {};
    faqSections.forEach((section) => {
      initialExpandedState[section.id] = false;
    });
    setExpandedSections(initialExpandedState);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitStatus === "success") setSubmitStatus(null);
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      errors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    return errors;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setSubmitStatus("error");
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", formData);

      // Success handling
      setSubmitStatus("success");
      setShowSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTouchedFields({});

      // Auto-hide success message
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const expandAllSections = () => {
    const allExpanded = {};
    faqSections.forEach((section) => {
      allExpanded[section.id] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAllSections = () => {
    const allCollapsed = {};
    faqSections.forEach((section) => {
      allCollapsed[section.id] = false;
    });
    setExpandedSections(allCollapsed);
  };

  const clearSearch = () => setSearchQuery("");

  // Filter FAQ sections based on search
  const filteredSections = faqSections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.items.some(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const errors = validateForm();
  const hasErrors = Object.keys(errors).length > 0;

  // Quick contact options
  const quickContacts = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Support",
      description: "support@yourapp.com",
      response: "Within 24 hours",
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Live Chat",
      description: "Available 9AM-6PM EST",
      response: "Instant response",
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: "Community Forum",
      description: "Get help from other users",
      response: "Community driven",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3A63] mb-3 sm:mb-4 tracking-tight">
            Contact US
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find instant answers to common questions or get personalized help
            from our support team. We're here to help you succeed.
          </p>
        </header>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 sm:mb-12">
          {quickContacts.map((contact, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#2F3A63]/10 text-[#2F3A63] rounded-lg mb-3">
                {contact.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {contact.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {contact.description}
              </p>
              <p className="text-xs text-[#2F3A63] font-medium">
                {contact.response}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content: Two Columns - Lottie Left, Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 items-stretch">
          {/* Left: Lottie Animation */}
            <div className="w-full h-full flex items-center justify-center">
              <Lottie
                animationData={ContactUs}
                loop={true}
                autoplay={true}
                className="w-full h-auto max-h-[400px] lg:max-h-[500px]"
              />
            </div>
       

          {/* Right: Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8 flex flex-col h-full order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#2F3A63] rounded-lg flex items-center justify-center">
                <Send className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2F3A63]">
                Contact Support
              </h2>
            </div>

            <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
              Can't find what you're looking for? Send us a message and our team
              will get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
              {/* Status Messages */}
              {showSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">Message sent successfully!</p>
                    <p className="text-sm mt-1">
                      Thank you for contacting us. We'll get back to you within
                      24 hours.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSuccess(false)}
                    className="ml-4 text-green-700 hover:text-green-900 flex-shrink-0"
                    aria-label="Dismiss message"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {submitStatus === "error" && !showSuccess && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="font-medium">
                    Please fix the following errors:
                  </p>
                  <ul className="text-sm mt-1 list-disc list-inside">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Full Name *
                  </label>
                  <input
                    ref={nameRef}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur("name")}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63] focus:border-transparent transition-colors duration-200 ${
                      touchedFields.name && errors.name
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  />
                  {touchedFields.name && errors.name && (
                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 block"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur("email")}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63] focus:border-transparent transition-colors duration-200 ${
                      touchedFields.email && errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  />
                  {touchedFields.email && errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Subject *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Briefly describe your issue"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur("subject")}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63] focus:border-transparent transition-colors duration-200 ${
                    touchedFields.subject && errors.subject
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
                {touchedFields.subject && errors.subject && (
                  <p className="text-red-600 text-xs mt-1">{errors.subject}</p>
                )}
              </div>

              <div className="space-y-2 flex-1">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Please provide detailed information about your issue or question..."
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur("message")}
                  disabled={isSubmitting}
                  className={`w-full h-full min-h-[150px] px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63] focus:border-transparent resize-vertical transition-colors duration-200 ${
                    touchedFields.message && errors.message
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  } ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
                {touchedFields.message && errors.message && (
                  <p className="text-red-600 text-xs mt-1">{errors.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.message.length}/500 characters
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || hasErrors}
                  className={`w-full font-semibold py-3 text-sm rounded-xl transition-all duration-200 shadow-sm text-white flex items-center justify-center gap-2 ${
                    isSubmitting || hasErrors
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#2F3A63] hover:bg-[#1e2a4a] hover:shadow-md"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Typical response time: 2-4 hours during business days
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Section - Moved below the main content */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#2F3A63] rounded-lg flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#2F3A63]">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={expandAllSections}
                className="text-sm text-[#2F3A63] hover:text-[#1e2a4a] font-medium"
              >
                Expand All
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={collapseAllSections}
                className="text-sm text-[#2F3A63] hover:text-[#1e2a4a] font-medium"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* FAQ Sections */}
          <div className="space-y-4">
            {filteredSections.map((section) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{section.icon}</span>
                    <h3 className="text-left font-semibold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      expandedSections[section.id] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedSections[section.id] && (
                  <div className="p-4 bg-white space-y-4">
                    {section.items.map((item, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {item.question}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredSections.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No FAQs found matching your search.</p>
              <button
                onClick={clearSearch}
                className="text-[#2F3A63] hover:text-[#1e2a4a] font-medium mt-2"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;