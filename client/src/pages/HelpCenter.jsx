// import React, { useState } from "react";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Textarea } from "../components/ui/textarea";
// import { ChevronDown, Search } from "lucide-react";

// const HelpCenter = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const [expandedSections, setExpandedSections] = useState({
//     account: false,
//     posting: false,
//     pricing: false,
//     safety: false,
//     technical: false,
//   });
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission (e.g., API call)
//     console.log("Form submitted:", formData);
//     // Reset form if needed
//   };

//   const toggleSection = (section) => {
//     setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
//   };

//   const faqSections = [
//     {
//       id: "account",
//       title: "Account Management",
//       items: [
//         {
//           question: "How do I create an account?",
//           answer:
//             "Visit the sign-up page and follow the prompts to register with your email.",
//         },
//         {
//           question: "How do I reset my password?",
//           answer:
//             "Click 'Forgot Password' on the login screen and follow the email instructions.",
//         },
//       ],
//     },
//     {
//       id: "posting",
//       title: "Posting and Managing Listings",
//       items: [
//         {
//           question: "How do I post a new ad?",
//           answer:
//             "Navigate to 'Post Ads' in the menu and fill out the form with your listing details.",
//         },
//         {
//           question: "How do I edit or delete a listing?",
//           answer:
//             "Go to your dashboard, find the listing, and use the edit/delete options.",
//         },
//       ],
//     },
//     {
//       id: "pricing",
//       title: "Pricing and Payments",
//       items: [
//         {
//           question: "Are there any fees for posting?",
//           answer:
//             "Basic postings are free; premium features may require payment.",
//         },
//         {
//           question: "How do I handle payments?",
//           answer: "Use our secure payment gateway for any transactions.",
//         },
//       ],
//     },
//     {
//       id: "safety",
//       title: "Safety and Security",
//       items: [
//         {
//           question: "How do I report a suspicious user?",
//           answer: "Use the report button on their profile or listing.",
//         },
//         {
//           question: "What measures do you take for security?",
//           answer: "We use encryption and verification to protect your data.",
//         },
//       ],
//     },
//     {
//       id: "technical",
//       title: "Technical Support",
//       items: [
//         {
//           question: "Why isn't my ad showing up?",
//           answer:
//             "Check if it's under review or contact support if issues persist.",
//         },
//         {
//           question: "How do I contact tech support?",
//           answer: "Use the form below or check our status page.",
//         },
//       ],
//     },
//   ];

//   const filteredSections = faqSections.filter(
//     (section) =>
//       section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       section.items.some((item) =>
//         item.question.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//   );

//   return (
//     <div className="min-h-screen bg-[#f4f4f4] py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <header className="text-center mb-12">
//           <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
//             Help Center
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Find answers to your questions or get in touch with our support
//             team.
//           </p>
//         </header>

//         {/* Main Content: Two Columns */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//           {/* Left: Get in Touch Form */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
//             <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//               Get in Touch
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Before you send us a message, have you checked our FAQ section?
//               You might find your answer there!
//             </p>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <label
//                   htmlFor="name"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Name
//                 </label>
//                 <Input
//                   id="name"
//                   name="name"
//                   type="text"
//                   placeholder="Enter your name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label
//                   htmlFor="email"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Email
//                 </label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label
//                   htmlFor="subject"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Subject
//                 </label>
//                 <Input
//                   id="subject"
//                   name="subject"
//                   type="text"
//                   placeholder="How can we help?"
//                   value={formData.subject}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label
//                   htmlFor="message"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Message
//                 </label>
//                 <Textarea
//                   id="message"
//                   name="message"
//                   placeholder="Enter your message"
//                   rows={4}
//                   value={formData.message}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <Button
//                 type="submit"
//                 className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
//               >
//                 Send Message
//               </Button>
//             </form>
//           </div>

//           {/* Right: Frequently Asked Questions */}
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
//             <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//               Frequently Asked Questions
//             </h2>
//             <div className="relative mb-6">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 type="text"
//                 placeholder="Search for answers..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-4"
//               />
//             </div>
//             <div className="space-y-2">
//               {filteredSections.map((section) => (
//                 <div
//                   key={section.id}
//                   className="border-b border-gray-200 last:border-b-0"
//                 >
//                   <button
//                     type="button"
//                     onClick={() => toggleSection(section.id)}
//                     className="w-full flex justify-between items-center py-4 text-left text-gray-900 font-medium hover:text-[#2563eb] transition-colors duration-200"
//                     aria-expanded={expandedSections[section.id]}
//                     aria-controls={`${section.id}-content`}
//                   >
//                     {section.title}
//                     <ChevronDown
//                       className={`w-5 h-5 transition-transform duration-200 ${
//                         expandedSections[section.id] ? "rotate-180" : ""
//                       }`}
//                     />
//                   </button>
//                   <div
//                     id={`${section.id}-content`}
//                     className={`overflow-hidden transition-all duration-300 ${
//                       expandedSections[section.id] ? "max-h-96" : "max-h-0"
//                     }`}
//                   >
//                     <div className="pl-4 pb-4 space-y-3">
//                       {section.items.map((item, idx) => (
//                         <div key={idx} className="text-sm text-gray-600">
//                           <p className="font-medium text-gray-900 mb-1">
//                             {item.question}
//                           </p>
//                           <p>{item.answer}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HelpCenter;

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

const HelpCenter = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [expandedSections, setExpandedSections] = useState({
    account: false,
    posting: false,
    pricing: false,
    safety: false,
    technical: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [showSuccess, setShowSuccess] = useState(false);
  const nameRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitStatus === "success") setSubmitStatus(null);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValid = validateEmail(formData.email);
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message ||
      !emailValid
    ) {
      setSubmitStatus("error");
      if (!formData.name || !formData.subject || !formData.message) {
        nameRef.current?.focus();
      }
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", formData);
      setSubmitStatus("success");
      setShowSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setShowSuccess(false), 5000); // Auto-hide after 5s
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearSearch = () => setSearchQuery("");

  const faqSections = [
    {
      id: "account",
      title: "Account Management",
      items: [
        {
          question: "How do I create an account?",
          answer:
            "Visit the sign-up page and follow the prompts to register with your email.",
        },
        {
          question: "How do I reset my password?",
          answer:
            "Click 'Forgot Password' on the login screen and follow the email instructions.",
        },
      ],
    },
    {
      id: "posting",
      title: "Posting and Managing Listings",
      items: [
        {
          question: "How do I post a new ad?",
          answer:
            "Navigate to 'Post Ads' in the menu and fill out the form with your listing details.",
        },
        {
          question: "How do I edit or delete a listing?",
          answer:
            "Go to your dashboard, find the listing, and use the edit/delete options.",
        },
      ],
    },
    {
      id: "pricing",
      title: "Pricing and Payments",
      items: [
        {
          question: "Are there any fees for posting?",
          answer:
            "Basic postings are free; premium features may require payment.",
        },
        {
          question: "How do I handle payments?",
          answer: "Use our secure payment gateway for any transactions.",
        },
      ],
    },
    {
      id: "safety",
      title: "Safety and Security",
      items: [
        {
          question: "How do I report a suspicious user?",
          answer: "Use the report button on their profile or listing.",
        },
        {
          question: "What measures do you take for security?",
          answer: "We use encryption and verification to protect your data.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical Support",
      items: [
        {
          question: "Why isn't my ad showing up?",
          answer:
            "Check if it's under review or contact support if issues persist.",
        },
        {
          question: "How do I contact tech support?",
          answer: "Use the form below or check our status page.",
        },
      ],
    },
  ];

  const filteredSections = faqSections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.items.some((item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  useEffect(() => {
    if (submitStatus === "error") {
      nameRef.current?.focus();
    }
  }, [submitStatus]);

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3A63] mb-3 sm:mb-4 tracking-tight">
            Help Center
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find answers to your questions or get in touch with our support
            team.
          </p>
        </header>

        {/* Main Content: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
          {/* Left: Get in Touch Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 order-2 lg:order-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#2F3A63] mb-4 sm:mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
              Before you send us a message, have you checked our FAQ section?
              You might find your answer there!
            </p>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {showSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm flex items-center justify-between">
                  <span>
                    Thank you! Your message has been sent. We'll get back to you
                    soon.
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSuccess(false)}
                    className="ml-2 text-green-700 hover:text-green-900"
                    aria-label="Dismiss message"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              {submitStatus === "error" && !showSuccess && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm">
                  Please fill in all fields correctly and try again. (Email must
                  be valid)
                </div>
              )}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Name *
                </label>
                <input
                  ref={nameRef}
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
                />
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
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Enter your message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical transition-colors duration-200"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-semibold py-2.5 sm:py-3 text-sm rounded-xl transition-all duration-200 shadow-sm text-white flex items-center justify-center ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#2F3A63] hover:bg-[#1e2a4a] hover:shadow-md"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          {/* Right: Frequently Asked Questions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 order-1 lg:order-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#2F3A63] mb-4 sm:mb-6">
              Frequently Asked Questions
            </h2>
            <div className="relative mb-4 sm:mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 sm:pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F3A63] focus:border-transparent transition-colors duration-200"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            {filteredSections.length === 0 ? (
              <p className="text-gray-500 text-center py-8 text-sm sm:text-base">
                No results found. Try a different search term.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
                {filteredSections.map((section) => (
                  <div
                    key={section.id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex justify-between items-center py-3 sm:py-4 text-left text-gray-900 font-medium hover:text-[#2F3A63] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/20 rounded-md px-2 hover:bg-[#2F3A63]/5"
                      aria-expanded={expandedSections[section.id]}
                      aria-controls={`${section.id}-content`}
                    >
                      <span className="text-sm sm:text-base">
                        {section.title}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                          expandedSections[section.id] ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      id={`${section.id}-content`}
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedSections[section.id]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-4 pb-4 space-y-3">
                        {section.items.map((item, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            <p className="font-medium text-[#2F3A63] mb-1">
                              {item.question}
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
