import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Mail, Bed, Square, Heart } from "lucide-react";

// Import your JSON data
import data from "../data/data.json";


function HouseDetails() {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedHouses, setSavedHouses] = useState([]);

useEffect(() => {
  try {
    const foundHouse = data.houses.find((house) => house.id === parseInt(id));
    if (!foundHouse) {
      setError("House not found");
    } else {
      setHouse(foundHouse);
      setSelectedImage(foundHouse.images[0]);
    }
    setLoading(false);
  } catch (err) {
    setError("Failed to load house data");
    setLoading(false);
  }
}, [id]);

useEffect(() => {
  const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
  setSavedHouses(saved);
}, [id]);

const isSaved = savedHouses.some(h => h.id === house?.id);

const toggleSave = () => {
  if (!house) return;
  let newSaved;
  if (isSaved) {
    newSaved = savedHouses.filter(h => h.id !== house.id);
  } else {
    newSaved = [...savedHouses, house];
  }
  setSavedHouses(newSaved);
  localStorage.setItem('savedItems', JSON.stringify(newSaved));
  window.dispatchEvent(new CustomEvent('savedItemsChanged'));
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="text-center text-gray-600 mt-10 text-xl">
        House not found
      </div>
    );
  }

  const displayImages =
    house.images.length < 4
      ? [...house.images, ...Array(4 - house.images.length).fill(house.images[0])]
      : house.images.slice(0, 4);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <Link
          to="/categories/houses"
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
          Back to Houses
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 md:flex gap-8">
          <div className="md:w-1/2 flex flex-col items-center">
            <img
              src={selectedImage}
              alt={house.title}
              className="w-full h-[400px] object-cover rounded-md border"
            />
            <div className="flex gap-3 mt-4">
              {displayImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${house.title} - ${index + 1}`}
                  className={`w-20 h-20 object-cover border rounded cursor-pointer ${
                    selectedImage === img ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-semibold text-gray-900">{house.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                house.type === "rent" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
              }`}>
                {house.type === "rent" ? "For Rent" : "For Sale"}
              </span>
            </div>
            
            <p className="text-gray-600 text-lg mt-2">{house.description}</p>

            <div className="mt-4">
              <span className="text-3xl font-bold text-green-600">
                {house.type === "rent" ? `$${house.price}/month` : `$${house.price.toLocaleString()}`}
              </span>
              {house.type === "sale" && (
                <p className="text-sm text-gray-500 mt-1">Sale Price</p>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <Square className="w-5 h-5 mr-2 text-blue-600" />
                <span><strong>{house.sqft} sqft</strong></span>
              </div>
              {/* Removed bedrooms since it's not in your data */}
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-gray-700 flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                <strong>Location:</strong> {house.location}
              </p>
              <p className="text-gray-700 flex items-center text-lg">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                <strong>Contact:</strong>{" "}
                <a
                  href={`mailto:${house.contactEmail}`}
                  className="text-blue-600 hover:underline ml-1"
                >
                  {house.contactEmail}
                </a>
              </p>
              <p className="text-gray-700 text-lg">
                <strong>Posted:</strong> {house.posted}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex gap-4">
                <a
                  href={`mailto:${house.contactEmail}?subject=Inquiry about ${house.title}`}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Owner
                </a>
                <button 
                  onClick={toggleSave}
                  className={`py-3 px-6 rounded-lg transition-colors font-medium flex items-center ${
                    isSaved 
                      ? 'bg-red-100 text-red-600 border border-red-600 hover:bg-red-200' 
                      : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-red-600' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Property'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mt-6 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">📍 Location</h2>
          <p className="text-gray-600 mb-4">{house.location}</p>
          <div className="w-full h-[400px] rounded-lg overflow-hidden border">
            <iframe
              title="Property Location Map"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(house.location)}&output=embed`}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HouseDetails;