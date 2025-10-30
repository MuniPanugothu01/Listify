import React, { useState, useEffect } from "react";
import { Search, X, ChevronDown, HelpCircle, Sparkles, MessageCircle, BookOpen } from "lucide-react";

const FAQSection = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Enhanced FAQ data with colors and popular flags
  const faqSections = [
    {
      id: "account",
      title: "Account Management",
      icon: "👤",
      items: [
        {
          question: "How do I create an account?",
          answer: "Visit the sign-up page and follow the prompts to register with your email. You'll need to verify your email address to complete the registration process.",
          popular: true
        },
        {
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password' on the login screen and follow the email instructions. The password reset link will expire in 1 hour for security reasons.",
          popular: false
        },
        {
          question: "Can I change my email address?",
          answer: "Yes, you can change your email in account settings. You'll need to verify the new email address before it becomes active.",
          popular: false
        }
      ]
    },
    {
      id: "posting",
      title: "Posting & Listings",
      icon: "📝",
      items: [
        {
          question: "How do I post a new ad?",
          answer: "Navigate to 'Post Ads' in the menu and fill out the form with your listing details. Make sure to include clear photos and accurate descriptions for better engagement.",
          popular: true
        },
        {
          question: "How do I edit or delete a listing?",
          answer: "Go to your dashboard, find the listing, and use the edit/delete options. You can only edit active listings, and deleted listings cannot be recovered.",
          popular: false
        },
        {
          question: "Why was my listing rejected?",
          answer: "Listings may be rejected if they violate our community guidelines, contain prohibited items, or have incomplete information. Check your email for specific reasons.",
          popular: true
        }
      ]
    },
    {
      id: "pricing",
      title: "Pricing & Payments",
      icon: "💰",
      items: [
        {
          question: "Are there any fees for posting?",
          answer: "Basic postings are free for up to 5 listings per month. Premium features and additional listings may require payment. View our pricing page for details.",
          popular: true
        },
        {
          question: "How do I handle payments?",
          answer: "We provide a secure payment gateway for transactions. We recommend using our integrated payment system for buyer and seller protection.",
          popular: false
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept credit cards, debit cards, PayPal, and bank transfers for premium features. Local payment options may vary by region.",
          popular: false
        }
      ]
    },
    {
      id: "safety",
      title: "Safety & Security",
      icon: "🛡️",
      items: [
        {
          question: "How do I report a suspicious user?",
          answer: "Use the report button on their profile or listing. You can also contact our safety team directly through this form with specific details.",
          popular: true
        },
        {
          question: "What measures do you take for security?",
          answer: "We use end-to-end encryption, two-factor authentication, and manual verification for high-value transactions. All data is stored securely following GDPR guidelines.",
          popular: false
        },
        {
          question: "How can I stay safe during meetings?",
          answer: "Always meet in public places, bring a friend, and verify the other party's identity. Use our verified user system for added security.",
          popular: true
        }
      ]
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: "🔧",
      items: [
        {
          question: "Why isn't my ad showing up?",
          answer: "New ads undergo a brief review process (usually 1-2 hours). If it's still not visible after 24 hours, check your email for notifications or contact support.",
          popular: true
        },
        {
          question: "How do I contact tech support?",
          answer: "Use the form on this page for general inquiries. For urgent technical issues, include 'URGENT' in your subject line for faster response.",
          popular: false
        },
        {
          question: "The website/app is not loading properly",
          answer: "Clear your browser cache and cookies, or try updating the app. If issues persist, describe the problem in detail including your device and browser information.",
          popular: false
        }
      ]
    }
  ];

  // Calculate statistics
  const totalQuestions = faqSections.reduce((sum, section) => sum + section.items.length, 0);
  const popularQuestions = faqSections.reduce((sum, section) => 
    sum + section.items.filter(item => item.popular).length, 0
  );

  // Initialize expanded sections
  useEffect(() => {
    const initialExpandedState = {};
    faqSections.forEach((section) => {
      initialExpandedState[section.id] = false;
    });
    setExpandedSections(initialExpandedState);
  }, []);

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

  // Get categories for filter
  const categories = [
    { id: "all", name: "All Categories", count: totalQuestions },
    ...faqSections.map(section => ({
      id: section.id,
      name: section.title,
      count: section.items.length
    }))
  ];

  // Filter FAQ sections based on search and category
  const filteredSections = faqSections.filter(
    (section) =>
      (activeCategory === "all" || section.id === activeCategory) &&
      (section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.items.some(
          (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Frequently Asked Questions
          </h1>
          
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Get instant answers to common questions about using our platform. 
            Everything you need to know about buying, selling, and staying safe.
          </p>
        </div>
        {/* FAQ Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 p-6 lg:p-8">
          {/* Header with Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
            
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  How Can We Help?
                </h2>
                <p className="text-gray-600 text-sm">
                  Quick answers to your questions
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={expandAllSections}
                  className="px-4 py-2 text-sm font-medium text-[#2F3A63] bg-[#2F3A63]/10 rounded-lg hover:bg-[#2F3A63]/20 transition-colors duration-200"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAllSections}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>
       
          {/* FAQ Sections */}
          <div className="space-y-4">
            {filteredSections.map((section) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 group"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 transition-all duration-200 group-hover:border-[#2F3A63]/20"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} text-white shadow-lg`}>
                      <span className="text-lg">{section.icon}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {section.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {section.items.length} questions
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                      expandedSections[section.id] ? "rotate-180 text-[#2F3A63]" : "group-hover:text-[#2F3A63]"
                    }`}
                  />
                </button>

                {expandedSections[section.id] && (
                  <div className="p-6 bg-white space-y-6 border-t border-gray-100">
                    {section.items.map((item, index) => (
                      <div 
                        key={index} 
                        className="border border-gray-100 rounded-xl p-5 hover:border-[#2F3A63]/20 transition-all duration-200 hover:shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          {item.popular && (
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Popular
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                              {item.question}
                            </h4>
                            <p className="text-gray-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
 
          {/* Help Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-[#2F3A63]/5 to-blue-500/5 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Still need help?
              </h3>
              <p className="text-gray-600 mb-4">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <button className="bg-[#2F3A63] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1e2a4a] transition-colors duration-200 inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;