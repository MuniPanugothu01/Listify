// DiscussionForumsDetails.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function DiscussionForumsDetails() {
  const { id } = useParams();
  const [forum, setForum] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const foundForum = data.discussionForums.find((f) => f.id === parseInt(id));
      if (!foundForum) {
        setError("Forum not found");
      } else {
        setForum(foundForum);
        setSelectedImage(foundForum.images[0]);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load forum data");
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

  if (error || !forum) {
    return (
      <div className="text-center text-gray-600 mt-10 text-xl">
        {error || "Forum not found"}
      </div>
    );
  }

  const displayImages =
    forum.images.length < 4
      ? [...forum.images, ...Array(4 - forum.images.length).fill(forum.images[0])]
      : forum.images.slice(0, 4);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <Link
          to="/categories/discussion-forums"
          className="inline-flex items-center mb-6 text-[#2F3A63] font-medium"
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
          Back to Discussions
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 md:flex gap-8">
          <div className="md:w-1/2 flex flex-col items-center">
            <img
              src={selectedImage}
              alt={forum.title}
              className="w-full h-[400px] object-cover rounded-md border"
            />
            <div className="flex gap-3 mt-4">
              {displayImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${forum.title} - ${index + 1}`}
                  className={`w-20 h-20 object-cover border rounded cursor-pointer ${
                    selectedImage === img ? "border-[#2F3A63]" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-semibold text-gray-900">{forum.title}</h1>
              <span className="bg-[#2F3A63]/10 text-[#2F3A63] px-3 py-1 rounded-full text-sm font-medium">
                {forum.comments} comments
              </span>
            </div>
            
            <p className="text-gray-600 text-lg mt-2">{forum.description}</p>

            <div className="mt-6 space-y-3">
              <p className="text-gray-700 text-lg">
                <strong>Author:</strong> {forum.author}
              </p>
              <p className="text-gray-700 text-lg">
                <strong>Posted:</strong> {forum.posted}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex gap-4">
                <button className="bg-[#2F3A63] text-white py-3 px-6 rounded-lg hover:bg-[#2F3A63]/90 transition-colors flex items-center font-medium">
                  Join Discussion
                </button>
                <button className="border border-[#2F3A63] text-[#2F3A63] py-3 px-6 rounded-lg hover:bg-[#2F3A63]/5 transition-colors font-medium">
                  Save Topic
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussionForumsDetails;