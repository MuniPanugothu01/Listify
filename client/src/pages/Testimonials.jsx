// src/components/Testimonials.jsx
import { Star, Quote, Award, TrendingUp, Heart, Sparkles } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import data from "../data/index.js";
import { Link} from "react-router-dom";

import Lottie from "lottie-react"; // Make sure to install lottie-react
import reviewAnimation from "../components/lottie/Review.json"; // adjust path if needed



const Testimonials = ({ testimonials = data.testimonials }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const lottieRef = useRef();

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  const stats = [
    { value: "50K+", label: "Happy Users", icon: Heart },
    { value: "4.9/5", label: "Average Rating", icon: Star },
    { value: "98%", label: "Success Rate", icon: TrendingUp },
    { value: "24/7", label: "Support", icon: Award }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#F3F3F3] overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">  
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2F3A63] mb-6 tracking-tight">
            Loved by Our Community
            
          </h2>
          
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied users who have transformed their buying and selling experience with Listify
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:"
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-[#2F3A63] rounded-xl">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Featured Testimonial with Lottie Animation */}
          <div 
            className="relative rounded-3xl p-8 text-black shadow-2xl overflow-hidden"
            onMouseEnter={() => {
              setIsPaused(true);
              if (lottieRef.current) lottieRef.current.pause();
            }}
            onMouseLeave={() => {
              setIsPaused(false);
              if (lottieRef.current) lottieRef.current.play();
            }}
          >
            {/* Lottie Animation Background */}
            <div className="absolute inset-0 z-0">
              <Lottie
                lottieRef={lottieRef}
                animationData={reviewAnimation}
                loop={true}
                autoplay={true}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0  mix-blend-multiply"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              <blockquote className="text-lg lg:text-xl leading-relaxed mb-6 font-medium relative z-10">
                "{testimonials[currentTestimonial]?.text}"
              </blockquote>

              <div className="flex items-center space-x-4">
                <img
                  src={testimonials[currentTestimonial]?.avatar}
                  alt={testimonials[currentTestimonial]?.author}
                  className="w-14 h-14 rounded-full border-2 border-white/20"
                />
                <div>
                  <div className="font-bold text-lg">
                    {testimonials[currentTestimonial]?.author}
                  </div>
                  <div className="text-white/70 text-sm">
                    {testimonials[currentTestimonial]?.role}
                  </div>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center space-x-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-white w-6' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials List */}
          <div className="space-y-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#2F3A63]/20 group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full flex-shrink-0  transition-transform duration-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-bold text-gray-900">
                          {testimonial.author}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {testimonial.role}
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infinite Scroll Testimonials */}
     <div className="relative max-w-7xl mx-auto overflow-hidden">
  {/* Left fade gradient */}
  <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F3F3F3] to-transparent z-10"></div>
  
  {/* Right fade gradient */}
  <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F3F3F3] to-transparent z-10"></div>
  
  {/* Scrolling testimonials that go behind the gradients */}
  <div 
    className="flex space-x-6 py-4"
    style={{
      animation: 'scroll-left 30s linear infinite',
      animationPlayState: isPaused ? 'paused' : 'running'
    }}
    onMouseEnter={() => setIsPaused(true)}
    onMouseLeave={() => setIsPaused(false)}
  >
    {[...testimonials, ...testimonials].map((testimonial, index) => (
      <div
        key={index}
        className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:"
      >
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-yellow-400 fill-yellow-400"
            />
          ))}
        </div>
        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
          "{testimonial.text}"
        </p>
        <div className="flex items-center space-x-3">
          <img
            src={testimonial.avatar}
            alt={testimonial.author}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold text-gray-900 text-sm">
              {testimonial.author}
            </div>
            <div className="text-gray-500 text-xs">
              {testimonial.role}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-[#2F3A63] rounded-3xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Join Our Community?
            </h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Start buying and selling with confidence today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Link to="/signin">
              <button className="bg-white text-[#2F3A63] px-8 py-3 cursor-pointer rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover: shadow-lg">
                Get Started Free
              </button>
              </Link>
              
              
              <button className="border-2 border-white cursor-pointer text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
                View All Reviews
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;