// CommunityDetails.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Users, Clock, Heart } from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function CommunityDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    try {
      const foundItem = data.community.find((i) => i.id === parseInt(id));
      if (!foundItem) {
        setError("Event not found");
      } else {
        setItem(foundItem);
        // Use the same image logic as CommunityList
        setSelectedImage(getEventImage(foundItem));
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load event data");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
    setSavedItems(saved);
  }, [id]);

  const isSaved = savedItems.some(h => h.id === item?.id);

  const toggleSave = () => {
    if (!item) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedItems.filter(h => h.id !== item.id);
    } else {
      newSaved = [...savedItems, item];
    }
    setSavedItems(newSaved);
    localStorage.setItem('savedItems', JSON.stringify(newSaved));
    window.dispatchEvent(new CustomEvent('savedItemsChanged'));
  };

  // Extract event type from title/description (same as CommunityList)
  const extractEventType = (item) => {
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();

    if (title.includes("garden") || description.includes("garden"))
      return "gardening";
    if (title.includes("book") || description.includes("book"))
      return "education";
    if (title.includes("cleanup") || description.includes("clean"))
      return "volunteer";
    if (title.includes("art") || description.includes("workshop"))
      return "arts";
    if (title.includes("dance") || description.includes("music"))
      return "entertainment";
    if (title.includes("pet") || description.includes("animal"))
      return "animals";
    if (title.includes("food") || description.includes("cook")) return "food";
    if (title.includes("run") || description.includes("fitness"))
      return "sports";
    if (title.includes("movie") || description.includes("film"))
      return "entertainment";
    if (title.includes("history") || description.includes("tour"))
      return "education";
    if (title.includes("charity") || description.includes("fundraiser"))
      return "volunteer";
    if (title.includes("game") || description.includes("trivia"))
      return "social";
    if (title.includes("picnic") || description.includes("social"))
      return "social";
    if (title.includes("farming") || description.includes("market"))
      return "shopping";
    if (title.includes("tech") || description.includes("computer"))
      return "education";
    if (title.includes("holiday") || description.includes("festival"))
      return "celebration";

    return "community"; // default
  };

  // Different images for different event types (same as CommunityList)
  const getEventImage = (item) => {
    const eventType = extractEventType(item);

    switch (eventType) {
      case "gardening":
        return "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "education":
        return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "volunteer":
        return "https://images.unsplash.com/photo-1549923746-7c0bdf0955bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "arts":
        return "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "entertainment":
        return "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "sports":
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "social":
        return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      case "food":
        return "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
      default:
        return "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    }
  };

  // Get event type badge color
  const getEventTypeColor = (eventType) => {
    switch (eventType) {
      case "gardening":
        return "bg-green-100 text-green-800";
      case "education":
        return "bg-blue-100 text-blue-800";
      case "volunteer":
        return "bg-purple-100 text-purple-800";
      case "arts":
        return "bg-pink-100 text-pink-800";
      case "entertainment":
        return "bg-yellow-100 text-yellow-800";
      case "sports":
        return "bg-red-100 text-red-800";
      case "social":
        return "bg-indigo-100 text-indigo-800";
      case "food":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center text-gray-600 mt-10 text-xl">
        {error || "Event not found"}
      </div>
    );
  }

  const eventType = extractEventType(item);
  const eventTypeColor = getEventTypeColor(eventType);

  // Create multiple image thumbnails using the same main image
  const thumbnailImages = Array(4).fill(getEventImage(item));

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <Link
          to="/categories/community"
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
          Back to Community Events
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 md:flex gap-8">
          <div className="md:w-1/2 flex flex-col items-center">
            <img
              src={selectedImage}
              alt={item.title}
              className="w-full h-[400px] object-cover rounded-md border"
            />
            <div className="flex gap-3 mt-4">
              {thumbnailImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${item.title} - ${index + 1}`}
                  className={`w-20 h-20 object-cover border rounded cursor-pointer ${
                    selectedImage === img
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                {item.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${eventTypeColor}`}
              >
                {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
              </span>
            </div>

            <p className="text-gray-600 text-lg mb-6">{item.description}</p>

            <div className="mb-6 space-y-3">
              <p className="text-gray-700 flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                <strong>Location:</strong> {item.location}
              </p>
              <p className="text-gray-700 text-lg flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                <strong>Date:</strong> {formatDate(item.date)}
              </p>
              <p className="text-gray-700 text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                <strong>Time:</strong> All Day Event
              </p>
              <p className="text-gray-700 text-lg flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                <strong>Event Type:</strong>{" "}
                {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
              </p>
            </div>

            <div className="mt-8">
              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium">
                  Join Event
                </button>
                <button 
                  onClick={toggleSave}
                  className={`py-3 px-6 rounded-lg transition-colors font-medium flex items-center justify-center ${
                    isSaved 
                      ? 'bg-red-100 text-red-600 border border-red-600 hover:bg-red-200' 
                      : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-red-600' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Event'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mt-6 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            📍 Event Location
          </h2>
          <p className="text-gray-600 mb-4">{item.location}</p>
          <div className="w-full h-[400px] rounded-lg overflow-hidden border">
            <iframe
              title="Event Location Map"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                item.location
              )}&output=embed`}
            ></iframe>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mt-6 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            📝 Event Details
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                About This Event
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                What to Bring
              </h3>
              <p className="text-gray-600">
                Come prepared to have fun and meet new people! All necessary
                equipment and materials will be provided.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Contact Information
              </h3>
              <p className="text-gray-600">
                For more information about this event, please contact your local
                community center or event organizer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetails;