// src/components/Testimonials.jsx
import { Star } from "lucide-react";
import React from "react";
import data from "../data/index.js"; // Adjust path as needed

const Testimonials = ({ testimonials = data.testimonials }) => {
  // Duplicate testimonials to make infinite loop seamless
  const loopTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F3F3F3] overflow-hidden">
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .scroll-container {
          display: flex;
          width: 200%;
          animation: scroll-left 25s linear infinite;
        }

        .testimonial-card {
          flex: 0 0 33.333%;
          box-sizing: border-box;
          padding: 2rem;
          margin-right: 2rem;
          background: white;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
          transition: none;
        }

        @media (max-width: 768px) {
          .testimonial-card {
            flex: 0 0 80%;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#2F3A63] mb-4 tracking-tight">
            What Our Users Say
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Real stories from our amazing community
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="scroll-container">
            {loopTestimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  {testimonial.text}
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="text-[#2F3A63] font-semibold">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
