import React, { useState } from "react";
import { 
  Star, 
  ArrowRight, 
  Heart, 
  MapPin, 
  Clock, 
  Eye, 
  Shield,
  Sparkles,
  TrendingUp,
  Zap
} from "lucide-react";
import data from "../data/index.js";

const FeaturedListings = ({ featuredListings = data.featuredListings }) => {
  const [favorites, setFavorites] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState("all");

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };


  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#F3F3F3] overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Featured Listings
          </h2>
          
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Hand-picked premium listings with verified sellers—discover exceptional deals and exclusive opportunities in your community.
          </p>
        </div>

  

        {/* Listings Grid */}
        {featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {featuredListings.map((item, index) => (
              <article
                key={item.id || index}
                className="group bg-white rounded-3xl overflow-hidden  transition-all duration-500  border border-gray-200/50 relative"
                role="article"
                aria-labelledby={`listing-title-${index}`}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        {item.badge}
                      </span>
                    </div>
                  )}

        

                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 "
                  />

                  {/* Overlay */}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title and Rating */}
                  <div className="flex items-start justify-between mb-4">
                    <h3
                      id={`listing-title-${index}`}
                      className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight flex-1 pr-4 group-hover:text-[#2F3A63] transition-colors duration-300"
                    >
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-1 flex-shrink-0 bg-[#2F3A63]/10 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-[#2F3A63] text-sm font-bold">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2 text-gray-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium truncate">{item.location}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{item.views || "2.1K"} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.time || "2h"} ago</span>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                    <div>
                      <span className="text-2xl font-bold text-[#2F3A63]">
                        {item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-gray-400 text-sm line-through ml-2">
                          {item.originalPrice}
                        </span>
                      )}
                    </div>
                    <button className="bg-[#2F3A63] text-white px-4 py-2 rounded-xl font-semibold text-sm hover:shadow-lg  transition-all duration-300">
                      View Details
                    </button>
                  </div>
                </div>

            
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200/50">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Listings Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Check back later for new featured listings in your area.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedListings;