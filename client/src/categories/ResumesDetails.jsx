// ResumesDetails.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ChevronDown, Heart } from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function ResumesDetails() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    try {
      const foundResume = data.resumes.find((r) => r.id === parseInt(id));
      if (!foundResume) {
        setError("Resume not found");
      } else {
        setResume(foundResume);
        setSelectedImage(foundResume.images[0]);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load resume data");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
    setSavedItems(saved);
  }, [id]);

  const isSaved = savedItems.some(h => h.id === resume?.id);

  const toggleSave = () => {
    if (!resume) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedItems.filter(h => h.id !== resume.id);
    } else {
      newSaved = [...savedItems, resume];
    }
    setSavedItems(newSaved);
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

  if (!resume) {
    return (
      <div className="text-center text-gray-600 mt-10 text-xl">
        Resume not found
      </div>
    );
  }

  const displayImages =
    resume.images.length < 4
      ? [...resume.images, ...Array(4 - resume.images.length).fill(resume.images[0])]
      : resume.images.slice(0, 4);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <Link
          to="/categories/resumes"
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
          Back to Resumes
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 md:flex gap-8">
          <div className="md:w-1/2 flex flex-col items-center">
            <img
              src={selectedImage}
              alt={resume.name}
              className="w-full h-[400px] object-cover rounded-md border"
            />
            <div className="flex gap-3 mt-4">
              {displayImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${resume.name} - ${index + 1}`}
                  className={`w-20 h-20 object-cover border rounded cursor-pointer ${
                    selectedImage === img ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="md:w-1/2 mt-6 md:mt-0">
            <h1 className="text-2xl font-semibold text-gray-900">{resume.name}</h1>
            
            <p className="text-gray-600 text-lg mt-2">{resume.experience}</p>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-gray-700 flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                <strong>Location:</strong> {resume.location}
              </p>
              <p className="text-gray-700 text-lg">
                <strong>Posted:</strong> {resume.posted}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium">
                  Contact Candidate
                </button>
                <button 
                  onClick={toggleSave}
                  className={`py-3 px-6 rounded-lg transition-colors font-medium flex items-center ${
                    isSaved 
                      ? 'bg-red-100 text-red-600 border border-red-600 hover:bg-red-200' 
                      : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-red-600' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Resume'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumesDetails;