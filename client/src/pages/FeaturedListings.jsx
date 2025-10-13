import React from "react";
import { Star, ArrowRight } from "lucide-react";
import data from "../data/index.js"; // Adjust path as needed

const FeaturedListings = ({ featuredListings = data.featuredListings }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F3F3F3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#2F3A63] mb-4 tracking-tight">
            Featured Listings
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Hand-picked premium listings just for you—discover exceptional deals
            in your local community.
          </p>
        </div>

        {featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((item, index) => (
              <article
                key={item.id || index}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[#2F3A63]/10 transition-all duration-300 animate-scale-in border border-gray-200 hover:border-[#2F3A63]/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-[#2F3A63]/20 focus-within:ring-offset-2"
                style={{ animationDelay: `${index * 0.1}s` }}
                role="article"
                tabIndex={0}
                aria-labelledby={`listing-title-${index}`}
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
                  {item.badge && (
                    <div
                      className="absolute top-4 left-4 z-10 px-3 py-1 text-white text-xs font-bold rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
                      role="img"
                      aria-label={`${item.badge} badge`}
                    >
                      {item.badge}
                    </div>
                  )}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-focus:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      id={`listing-title-${index}`}
                      className="text-[#2F3A63] font-semibold text-lg line-clamp-2 leading-tight group-hover:text-[#2F3A63]/90 transition-colors duration-200"
                    >
                      {item.title}
                    </h3>
                    <div
                      className="flex items-center space-x-1 ml-2 flex-shrink-0"
                      aria-label={`Rating: ${item.rating} stars`}
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                      <span className="text-[#2F3A63] text-sm font-medium sr-only">
                        {item.rating} stars
                      </span>
                      <span
                        className="text-[#2F3A63] text-sm font-medium"
                        aria-hidden="true"
                      >
                        {item.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#2F3A63] group-hover:text-[#2F3A63]/90 transition-colors duration-200">
                      {item.price}
                    </span>
                    <span className="text-gray-500 text-sm font-medium truncate">
                      {item.location}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No featured listings available at the moment.
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#2F3A63] text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-[#1e2a4a] focus:outline-none focus:ring-2 focus:ring-[#2F3A63]/50 focus:ring-offset-2 transform hover:-translate-y-0.5">
            View All Listings
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;