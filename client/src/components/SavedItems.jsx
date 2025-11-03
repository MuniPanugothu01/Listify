import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, ChevronLeft } from "lucide-react";
import Footer from "../pages/Footer.jsx";

function SavedItems() {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const loadSaved = () => {
      const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
      setSavedItems(saved);
    };

    loadSaved();
    window.addEventListener("savedItemsChanged", loadSaved);
    return () => window.removeEventListener("savedItemsChanged", loadSaved);
  }, []);

  const toggleSave = (item) => {
    const newSaved = savedItems.filter((i) => i.id !== item.id);
    setSavedItems(newSaved);
    localStorage.setItem("savedItems", JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent("savedItemsChanged"));
  };

  const getPriceDisplay = (item) => {
    if (!item.price) return "Price not specified";
    const price =
      typeof item.price === "number"
        ? item.price
        : parseFloat(item.price.replace(/[^\d.]/g, ""));
    if (isNaN(price)) return "Price not specified";
    return item.type === "rent" ? `$${price}/mo` : `$${price.toLocaleString()}`;
  };

  const getTypeDisplay = (item) => {
    return item.type === "rent"
      ? "For Rent"
      : item.type === "sale"
      ? "For Sale"
      : item.type || "Item";
  };

  const getContactEmail = (item) => item.contactEmail || "contact@example.com";

  const getLocationDisplay = (item) =>
    item.location ? item.location.split(",")[0] : "N/A";

  if (savedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <Link
            to="/categories"
            className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Categories
          </Link>
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Saved Items
            </h2>
            <p className="text-gray-600 mb-8">
              Start saving properties you love to see them here!
            </p>
            <Link
              to="/categories/houses"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Houses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 ">
      <div className="container mx-auto px-4">
        <Link
          to="/categories"
          className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Saved Items ({savedItems.length})
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={
                    item.images?.[0] ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === "rent"
                        ? "bg-blue-100 text-blue-800"
                        : item.type === "sale"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getTypeDisplay(item)}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => toggleSave(item)}
                    className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {item.posted || "Unknown"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center text-gray-500 mb-3 text-sm">
                  <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                  <span>{getLocationDisplay(item)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-green-600">
                    {getPriceDisplay(item)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/${item.category || "houses"}/${item.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    View Details
                  </Link>
                  <a
                    href={`mailto:${getContactEmail(
                      item
                    )}?subject=Inquiry about ${item.title}`}
                    className="flex-1 border border-blue-600 text-blue-600 text-center py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SavedItems;
