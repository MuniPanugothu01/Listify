import React from "react";
import { 
  Shield, 
  Users, 
  Zap, 
  Heart, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  Target,
  Globe,
  Award
} from "lucide-react";

function Review() {
  const principles = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Prioritizing user privacy and scam prevention with advanced verification systems and secure transactions.",
      features: ["Identity Verification", "Secure Payments", "24/7 Moderation", "Fraud Prevention"],
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
    },
    {
      icon: Users,
      title: "Community-Driven",
      description: "Empowering users through collaboration, authentic reviews, and community-led initiatives that shape our platform.",
      features: ["User Reviews", "Community Events", "Local Networks", "Collaborative Support"],
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
    },
    {
      icon: Zap,
      title: "Simplicity First",
      description: "A clean, intuitive platform that eliminates complexity while maximizing functionality and user experience.",
      features: ["One-Click Listings", "Smart Search", "Mobile Optimized", "Zero Learning Curve"],
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
    },
    {
      icon: Heart,
      title: "Social Impact",
      description: "Supporting social good through open-source initiatives, charity partnerships, and community development programs.",
      features: ["Charity Donations", "Local Support", "Eco-Friendly", "Community Grants"],
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80"
    }
  ];



  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden border lg:rounded-[10%]">
      

      <div className="max-w-7xl mx-auto relative z-10 ">
        {/* Header Section */}
        <div className="text-center mb-20">   
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2F3A63] mb-6 tracking-tight">
            Built on  Strong Principles
          </h2>
          
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            The core values that guide every decision we make and every feature we build at Listify
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {principles.map((principle, index) => {
            const IconComponent = principle.icon;
            return (
              <div
                key={principle.title}
                className="group relative bg-white rounded-3xl overflow-hidden border border-gray-200/50 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row h-full">
                  {/* Image Section */}
                  <div className="relative lg:w-2/5 h-48 lg:h-auto overflow-hidden">
                    <img
                      src={principle.image}
                      alt={principle.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Icon Overlay */}
                    <div className="absolute top-4 left-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${principle.gradient} text-white shadow-lg`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#2F3A63] transition-colors duration-300">
                      {principle.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {principle.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-3 mb-6">
                      {principle.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Learn More Button */}
                    <button className="flex items-center space-x-2 text-[#2F3A63] font-semibold text-sm hover:space-x-3 transition-all duration-300 group/btn">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Review;