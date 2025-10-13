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
                gradient: "from-[#2F3A63] to-blue-600",
                bgColor: "bg-[#2F3A63]/5",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
                alt: "Community-Driven",
                title: "Community-Driven",
                desc: "Empowering users through collaboration, reviews, and community initiatives.",
                gradient: "from-[#2F3A63]/80 via-blue-600 to-[#2F3A63]",
                bgColor: "bg-[#2F3A63]/5",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
                alt: "Simplicity",
                title: "Simplicity",
                desc: "A clean, intuitive platform that focuses on functionality and ease of use.",
                gradient: "from-[#2F3A63] to-indigo-600",
                bgColor: "bg-[#2F3A63]/5",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
                alt: "Philanthropy",
                title: "Philanthropy",
                desc: "Supporting social good through open-source, charity, and local initiatives.",
                gradient: "from-[#2F3A63]/80 via-purple-600 to-[#2F3A63]",
                bgColor: "bg-[#2F3A63]/5",
              },
            ].map((value, index) => (
              <div
                key={index}
                className={`group relative ${value.bgColor} border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl hover:border-[#2F3A63]/20 transition-all duration-500 overflow-hidden [perspective:1000px] h-80 focus-within:outline-none focus-within:ring-2 focus-within:ring-[#2F3A63]/20 focus-within:ring-offset-2`}
                role="button"
                tabIndex={0}
                aria-label={`Flip to learn more about ${value.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    e.currentTarget.classList.toggle("flipped");
                }}
              >
                {/* Flip Card Inner */}
                <div className="relative w-full h-full [transform-style:preserve-3d] cursor-pointer text-black transition-transform duration-700  group-hover:[transform:rotateY(180deg)]">
                  {/* Front Face - Image with Title */}
                  <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col cursor-pointer text-black rounded-2xl overflow-hidden">
                    <img
                      src={value.image}
                      alt={value.alt}
                      loading="lazy"
                      className="h-72 w-full object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="flex-1 flex items-center justify-center bg-white/80 backdrop-blur-sm px-6">
                      <h3 className="text-xl font-bold text-[#2F3A63] text-center leading-tight">
                        {value.title}
                      </h3>
                    </div>
                  </div>

                  {/* Back Face - Description */}
                  <div
                    className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] ${value.gradient} p-6 flex flex-col justify-center items-center text-center text-white rounded-2xl font-semibold shadow-2xl`}
                  >
                    <p className="leading-relaxed text-sm text-black lg:text-base mb-4">
                      {value.desc}
                    </p>
                    <span className="text-xs text-black opacity-90">
                      Flip back to see image
                    </span>
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
