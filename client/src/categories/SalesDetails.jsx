import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaHeart,
  FaShareAlt,
  FaPhone,
  FaCalendarAlt,
  FaStar,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaComments,
  FaBox,
  FaCheck,
  FaSync,
  FaHome,
  FaTag,
} from "react-icons/fa";

// Import your JSON data
import data from "../data/data.json";

function SalesDetails() {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Get item image function - SAME AS ForSaleList.jsx
  const getItemImage = (item) => {
    const itemType = item.type || "sale";
    const itemTitle = item.title || "";

    // Different image categories based on item type and title
    if (itemType === "sale") {
      if (
        itemTitle.toLowerCase().includes("jeans") ||
        itemTitle.toLowerCase().includes("clothing")
      ) {
        return "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("phone") ||
        itemTitle.toLowerCase().includes("electronic")
      ) {
        return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80";
      } else if (itemTitle.toLowerCase().includes("book")) {
        return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("furniture") ||
        itemTitle.toLowerCase().includes("table") ||
        itemTitle.toLowerCase().includes("sofa")
      ) {
        return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("game") ||
        itemTitle.toLowerCase().includes("console")
      ) {
        return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("sport") ||
        itemTitle.toLowerCase().includes("basketball") ||
        itemTitle.toLowerCase().includes("tennis")
      ) {
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (
        itemTitle.toLowerCase().includes("car") ||
        itemTitle.toLowerCase().includes("tire") ||
        itemTitle.toLowerCase().includes("motorcycle")
      ) {
        return "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else if (itemTitle.toLowerCase().includes("plant")) {
        return "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      } else {
        return "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      }
    } else if (itemType === "free") {
      return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    } else if (itemType === "wanted") {
      return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    }

    return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
  };

  useEffect(() => {
    try {
      const foundSale = data.marketplace.find((s) => s.id === parseInt(id));
      if (!foundSale) {
        setError("Item not found");
      } else {
        setSale(foundSale);
        // Use the same image logic as ForSaleList.jsx
        const primaryImage = foundSale.images?.[0] || getItemImage(foundSale);
        setSelectedImage(primaryImage);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load item data");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItems") || "[]");
    setSavedItems(saved);
  }, [id]);

  const isSaved = savedItems.some((h) => h.id === sale?.id);

  const toggleSave = () => {
    if (!sale) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedItems.filter((h) => h.id !== sale.id);
    } else {
      newSaved = [...savedItems, sale];
    }
    setSavedItems(newSaved);
    localStorage.setItem("savedItems", JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent("savedItemsChanged"));
  };

  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: sale.title,
        text: sale.description,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
  };

  // Get type badge color and text
  const getTypeInfo = (type) => {
    switch (type) {
      case "sale":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          text: "For Sale",
        };
      case "free":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          text: "Free",
        };
      case "wanted":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          text: "Wanted",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          text: type,
        };
    }
  };

  // Get condition badge color
  const getConditionColor = (condition) => {
    switch (condition) {
      case "New":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Like New":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Good":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "Fair":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Poor":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Extract features from description
  const extractFeatures = (description) => {
    const features = [];
    if (!description) return features;

    if (
      description.toLowerCase().includes("brand new") ||
      description.toLowerCase().includes("new")
    )
      features.push("Brand New");
    if (
      description.toLowerCase().includes("excellent") ||
      description.toLowerCase().includes("perfect")
    )
      features.push("Excellent Condition");
    if (
      description.toLowerCase().includes("rare") ||
      description.toLowerCase().includes("limited")
    )
      features.push("Rare Item");
    if (
      description.toLowerCase().includes("authentic") ||
      description.toLowerCase().includes("original")
    )
      features.push("Authentic");
    if (description.toLowerCase().includes("warranty"))
      features.push("Warranty Included");
    if (
      description.toLowerCase().includes("delivery") ||
      description.toLowerCase().includes("shipping")
    )
      features.push("Delivery Available");
    if (description.toLowerCase().includes("negotiable"))
      features.push("Price Negotiable");
    if (
      description.toLowerCase().includes("urgent") ||
      description.toLowerCase().includes("quick")
    )
      features.push("Quick Sale");

    // Add default features if none found
    if (features.length === 0) {
      features.push(
        "Good Condition",
        "Well Maintained",
        "Clean Item",
        "Ready to Use"
      );
    }

    return features.slice(0, 6);
  };

  // Get similar items (exclude current item)
  const getSimilarItems = () => {
    if (!sale) return [];
    return data.marketplace
      .filter((item) => item.id !== sale.id && item.type === sale.type)
      .slice(0, 6);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F3A63] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaBox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Item Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The item you're looking for doesn't exist.
          </p>
          <Link
            to="/categories/sales"
            className="bg-[#2F3A63] text-white px-6 py-3 rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium inline-flex items-center"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const features = extractFeatures(sale.description);
  const similarItems = getSimilarItems();
  const typeInfo = getTypeInfo(sale.type);
  const conditionColor = getConditionColor(sale.condition);

  // Use the same image logic for display images
  const displayImages =
    sale.images && sale.images.length > 0
      ? sale.images.length < 4
        ? [
            ...sale.images,
            ...Array(4 - sale.images.length).fill(sale.images[0]),
          ]
        : sale.images.slice(0, 4)
      : [
          getItemImage(sale),
          getItemImage(sale),
          getItemImage(sale),
          getItemImage(sale),
        ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/categories/sales"
              className="inline-flex items-center text-[#2F3A63] font-medium hover:text-[#1E2A4D] transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={shareProperty}
                className="p-2 text-gray-600 hover:text-[#2F3A63] transition-colors relative"
              >
                <FaShareAlt className="w-4 h-4" />
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={copyLink}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-t-lg flex items-center gap-3"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      Copy Link
                    </button>
                    <button className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-b-lg flex items-center gap-3">
                      <FaEnvelope className="w-4 h-4" />
                      Share via Email
                    </button>
                  </div>
                )}
              </button>

              <button
                onClick={toggleSave}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isSaved
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaHeart
                  className={`w-4 h-4 ${
                    isSaved ? "fill-red-600 text-red-600" : ""
                  }`}
                />
                <span className="hidden sm:inline font-medium">
                  {isSaved ? "Saved" : "Save"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt={sale.title}
                  className="w-full h-100 object-cover"
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${typeInfo.color} border`}
                  >
                    {typeInfo.text}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${conditionColor}`}
                  >
                    {sale.condition}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4 grid grid-cols-4 gap-3">
                {displayImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? ""
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${sale.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Item Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {sale.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      <span className="font-medium">{sale.location}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold mb-1 ${
                        sale.price === "Free"
                          ? "text-green-600"
                          : sale.price === "Negotiable"
                          ? "text-blue-600"
                          : "text-[#2F3A63]"
                      }`}
                    >
                      {sale.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      {sale.type === "free"
                        ? "Free Item"
                        : sale.type === "wanted"
                        ? "Price Negotiable"
                        : "Sale Price"}
                    </div>
                  </div>
                </div>

                {/* Item Stats */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    {/* Condition */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 border border-gray-200">
                        <FaShieldAlt className="w-4 h-4 text-[#2F3A63]" />
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        Condition
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {sale.condition}
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-px h-8 bg-gray-300 mx-2"></div>

                    {/* Category */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 border border-gray-200">
                        <FaBox className="w-4 h-4 text-[#2F3A63]" />
                      </div>
                      <div className="text-xs text-gray-600 mb-1">Category</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {sale.type}
                      </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-px h-8 bg-gray-300 mx-2"></div>

                    {/* Availability */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 border border-gray-200">
                        <FaCheck className="w-4 h-4 text-[#2F3A63]" />
                      </div>
                      <div className="text-xs text-gray-600 mb-1">Status</div>
                      <div className="font-semibold text-gray-900 text-sm">
                        Available
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <FaCalendarAlt className="w-4 h-4 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Listed</div>
                    <div className="font-semibold text-gray-900 text-xs">
                      {sale.posted}
                    </div>
                  </div>
                  <div className="text-center">
                    <FaMapMarkerAlt className="w-4 h-4 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Location</div>
                    <div className="font-semibold text-gray-900 text-xs">
                      {sale.location.split(",")[0]}
                    </div>
                  </div>
                  <div className="text-center">
                    <FaSync className="w-4 h-4 text-[#2F3A63] mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Type</div>
                    <div className="font-semibold text-gray-900 text-xs">
                      {typeInfo.text}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="px-6 flex space-x-8">
                  {["overview", "details", "location"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors capitalize ${
                        activeTab === tab
                          ? "border-[#2F3A63] text-[#2F3A63]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Item Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {sale.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Item Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Condition</span>
                            <span className="font-medium">
                              {sale.condition}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Price Type</span>
                            <span className="font-medium">{typeInfo.text}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Listed Date</span>
                            <span className="font-medium">{sale.posted}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Item ID</span>
                            <span className="font-medium">#{sale.id}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Seller Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Seller Type</span>
                            <span className="font-medium">Individual</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Response Time</span>
                            <span className="font-medium">Within 24 hours</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Meetup</span>
                            <span className="font-medium">Public Location</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Delivery</span>
                            <span className="font-medium">Available</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "location" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Pickup Location
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {sale.location}. The seller prefers to meet in a public
                        location for safety. Contact the seller to arrange a
                        convenient meeting time and place.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2F3A63]">
                            Public
                          </div>
                          <div className="text-sm text-gray-600">
                            Meeting Place
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2F3A63]">
                            Flexible
                          </div>
                          <div className="text-sm text-gray-600">Timings</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-[#2F3A63]">
                            Safe
                          </div>
                          <div className="text-sm text-gray-600">
                            Transaction
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Map Location
                      </h3>
                      <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200">
                        <iframe
                          title="Item Location Map"
                          width="100%"
                          height="100%"
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(
                            sale.location
                          )}&output=embed&zoom=15`}
                          className="border-0"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:w-1/3 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Seller
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2F3A63] to-[#4A5FC1] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {sale.sellerName?.charAt(0) || "S"}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {sale.sellerName || "Seller"}
                  </h4>
                  <p className="text-gray-600 text-sm">Marketplace Seller</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      (12 reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-[#2F3A63] text-white py-3 px-4 cursor-pointer rounded-lg hover:bg-[#1E2A4D] transition-colors font-medium flex items-center justify-center gap-2">
                  <FaComments className="w-4 h-4" />
                  Message Seller
                </button>

                <button className="w-full border border-[#2F3A63] cursor-pointer text-[#2F3A63] py-3 px-4 rounded-lg hover:bg-[#2F3A63] hover:text-white transition-colors font-medium flex items-center justify-center gap-2">
                  <FaPhone className="w-4 h-4" />
                  Call Seller
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  <FaCalendarAlt className="w-4 h-4 inline mr-1" />
                  Listed {sale.posted}
                </div>
              </div>
            </div>

            {/* Similar Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FaBox className="w-5 h-5 text-[#2F3A63]" />
                  Similar Items ({similarItems.length})
                </h3>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {similarItems.map((item) => {
                  const itemTypeInfo = getTypeInfo(item.type);
                  return (
                    <Link
                      key={item.id}
                      to={`/categories/sales/${item.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex gap-3">
                        <img
                          src={getItemImage(item)}
                          alt={item.title}
                          className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                              {item.title}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${itemTypeInfo.color}`}
                            >
                              {itemTypeInfo.text}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-2">
                            <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-600 truncate">
                              {item.location.split(",")[0]}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <span
                              className={`font-bold text-sm ${
                                item.price === "Free"
                                  ? "text-green-600"
                                  : item.price === "Negotiable"
                                  ? "text-blue-600"
                                  : "text-[#2F3A63]"
                              }`}
                            >
                              {item.price}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {item.posted}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <Link
                  to="/categories/sales"
                  className="w-full text-center text-[#2F3A63] font-medium hover:text-[#1E2A4D] transition-colors text-sm inline-flex items-center justify-center gap-1"
                >
                  View All Items
                  <FaArrowLeft className="w-4 h-4 transform rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesDetails;
