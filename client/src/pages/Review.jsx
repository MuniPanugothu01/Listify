import React from "react";

function Review() {
  return (
    <div className="bg-[#F3F3F3] text-gray-500">
      {/* Values Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#F3F3F3]">
        <div className="relative max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#2F3A63] mb-6 tracking-tight">
            Core <span className="text-[#2F3A63]/80">Principles</span>
          </h2>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            The guiding principles that define everything we do at{" "}
            <span className="text-[#2F3A63] font-semibold">Listify</span>.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
                alt: "Trust & Safety",
                title: "Trust & Safety",
                desc: "Prioritizing user privacy and scam prevention with a local-first mindset.",
                bgColor: "bg-white",
                accentColor: "#2F3A63",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
                alt: "Community-Driven",
                title: "Community-Driven",
                desc: "Empowering users through collaboration, reviews, and community initiatives.",
                bgColor: "bg-white",
                accentColor: "#2F3A63",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
                alt: "Simplicity",
                title: "Simplicity",
                desc: "A clean, intuitive platform that focuses on functionality and ease of use.",
                bgColor: "bg-white",
                accentColor: "#2F3A63",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
                alt: "Philanthropy",
                title: "Philanthropy",
                desc: "Supporting social good through open-source, charity, and local initiatives.",
                bgColor: "bg-white",
                accentColor: "#2F3A63",
              },
            ].map((value, index) => (
              <div
                key={index}
                className={`${value.bgColor} border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-[${value.accentColor}]/20 transition-all duration-500 overflow-hidden h-80 flex flex-col group focus-within:outline-none focus-within:ring-2 focus-within:ring-[${value.accentColor}]/20 focus-within:ring-offset-2`}
                role="button"
                tabIndex={0}
                aria-label={`Learn more about ${value.title}`}
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={value.image}
                    alt={value.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay for hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <h3 className="text-xl font-bold text-white text-left leading-tight">
                      {value.title}
                    </h3>
                  </div>
                </div>

                {/* Description Section - Slides up on hover */}
                <div className="flex-1 p-6 bg-white relative -mt-6 z-10 group-hover:mt-0 transition-all duration-500 ease-in-out">
                  <div className="bg-[${value.accentColor}]/5 rounded-xl p-4 border-l-4 border-[${value.accentColor}]">
                    <h3 className="text-xl font-bold text-[${value.accentColor}] mb-2 leading-tight">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Review;