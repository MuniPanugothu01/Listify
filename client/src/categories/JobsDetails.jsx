// JobsDetails.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ChevronDown, Heart } from "lucide-react";

// Import your JSON data
import data from "../data/data.json";

function JobsDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    try {
      const foundJob = data.jobs.find((j) => j.id === parseInt(id));
      if (!foundJob) {
        setError("Job not found");
      } else {
        setJob(foundJob);
        setSelectedImage(foundJob.images[0]);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load job data");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
    setSavedItems(saved);
  }, [id]);

  const isSaved = savedItems.some(h => h.id === job?.id);

  const toggleSave = () => {
    if (!job) return;
    let newSaved;
    if (isSaved) {
      newSaved = savedItems.filter(h => h.id !== job.id);
    } else {
      newSaved = [...savedItems, job];
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

  if (error || !job) {
    return (
      <div className="text-center text-gray-600 mt-10 text-xl">
        {error || "Job not found"}
      </div>
    );
  }

  const displayImages =
    job.images.length < 4
      ? [...job.images, ...Array(4 - job.images.length).fill(job.images[0])]
      : job.images.slice(0, 4);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="container mx-auto px-4">
        <Link
          to="/categories/jobs"
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
          Back to Jobs
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 md:flex gap-8">
          <div className="md:w-1/2 flex flex-col items-center">
            <img
              src={selectedImage}
              alt={job.title}
              className="w-full h-[400px] object-cover rounded-md border"
            />
            <div className="flex gap-3 mt-4">
              {displayImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${job.title} - ${index + 1}`}
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
              <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
              <span className="bg-[#2F3A63]/10 text-[#2F3A63] px-3 py-1 rounded-full text-sm font-medium">
                {job.type}
              </span>
            </div>
            
            <p className="text-gray-600 text-lg mt-2">{job.description}</p>

            <div className="mt-4">
              <span className="text-3xl font-bold text-green-600">
                {job.salary}
              </span>
              <p className="text-sm text-gray-500 mt-1">Salary</p>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-gray-700 flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-[#2F3A63]" />
                <strong>Location:</strong> {job.location}
              </p>
              <p className="text-gray-700 text-lg">
                <strong>Posted:</strong> {job.posted}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex gap-4">
                <button className="bg-[#2F3A63] text-white py-3 px-6 rounded-lg hover:bg-[#2F3A63]/90 transition-colors flex items-center font-medium">
                  Apply Now
                </button>
                <button 
                  onClick={toggleSave}
                  className={`py-3 px-6 rounded-lg transition-colors font-medium flex items-center ${
                    isSaved 
                      ? 'bg-red-100 text-red-600 border border-red-600 hover:bg-red-200' 
                      : 'border border-[#2F3A63] text-[#2F3A63] hover:bg-[#2F3A63]/5'
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-red-600' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Job'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mt-6 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">📍 Location</h2>
          <p className="text-gray-600 mb-4">{job.location}</p>
          <div className="w-full h-[400px] rounded-lg overflow-hidden border">
            <iframe
              title="Job Location Map"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(job.location)}&output=embed`}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobsDetails;