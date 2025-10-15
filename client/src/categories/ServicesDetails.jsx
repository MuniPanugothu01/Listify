// ServicesDetails.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ChevronDown } from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function ServicesDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const foundService = data.services.find((s) => s.id === parseInt(id));
      if (!foundService) {
        setError("Service not found");
      } else {
        setService(foundService);
        setSelectedImage(foundService.images[0]);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load service data");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center text-gray-600 mt-10 text-xl">
        Service not found
      </div>
    );
  }

  const displayImages =
    service.images.length < 4
      ? [...service.images, ...Array(4 - service.images.length).fill(service.images[0])]
      : service.images.slice(0, 4);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <Link
          to="/categories/services"
          className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Services
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 md:flex gap-8">
          <div className="md:w-1/2 flex flex-col items-center">
            <img
              src={selectedImage}
              alt={service.title}
              className="w-full h-[400px] object-cover rounded-md border"
            />
            <div className="flex gap-3 mt-4">
              {displayImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${service.title} - ${index + 1}`}
                  className={`w-20 h-20 object-cover border rounded cursor-pointer ${
                    selectedImage === img ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="md:w-1/2 mt-6 md:mt-0">
            <h1 className="text-2xl font-semibold text-gray-900">{service.title}</h1>
            
            <p className="text-gray-600 text-lg mt-2">{service.description}</p>

            <div className="mt-4">
              <span className="text-3xl font-bold text-green-600">
                {service.pay}
              </span>
              <p className="text-sm text-gray-500 mt-1">Service Rate</p>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-gray-700 flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                <strong>Location:</strong> {service.location}
              </p>
              <p className="text-gray-700 text-lg">
                <strong>Posted:</strong> {service.posted}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium">
                  Save Service
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mt-6 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">📍 Location</h2>
          <p className="text-gray-600 mb-4">{service.location}</p>
          <div className="w-full h-[400px] rounded-lg overflow-hidden border">
            <iframe
              title="Service Location Map"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(service.location)}&output=embed`}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesDetails;