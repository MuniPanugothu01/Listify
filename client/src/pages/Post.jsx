import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PostAdd = ({ data, setData }) => {
  const [formData, setFormData] = useState({
    postType: "",
    intent: "offering",
    title: "",
    city: "",
    zipcode: "",
    description: "",
    email: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emptyFields = Object.entries(formData).filter(([_, v]) => v === "");
    if (emptyFields.length) {
      alert("Please fill all required fields.");
      return;
    }

    const maxExistingId = Math.max(...Object.values(data).flat().map((item) => item.id), 0);
    const newId = maxExistingId + 1;

    const newItem = {
      id: newId,
      title: formData.title,
      type:
        formData.postType === "house for sale"
          ? "sale"
          : formData.postType === "house for rent"
          ? "rent"
          : formData.postType.split(" ").pop().toLowerCase(),
      price:
        formData.intent === "hiring"
          ? 0
          : parseInt(prompt("Enter price (e.g., 25 for gigs, 1500 for rent)")) || 0,
      description: formData.description,
      location: `${formData.city}, ${formData.zipcode}`,
      contactEmail: formData.email,
      sellerName: "You",
      sellerPhone: formData.phone,
      sellerImage: "https://randomuser.me/api/portraits/men/1.jpg",
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
      ],
    };

    const categoryMap = {
      "houses": "houses",
      "sales": "sales",
      "service offered": "services",
      "gigs": "gigs",
      "jobs": "jobs",
      "community event": "community",
      "discussions-fourums": "forums",
      "resumes": "resumes",
    };

    const category = categoryMap[formData.postType] || "houses";
    setData((prev) => ({
      ...prev,
      [category]: [...prev[category], newItem],
    }));

    alert("✅ Post added successfully!");
    navigate(`/${category}/${newId}`);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-6 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-[#2F3A63] mb-8">
          📝 Create New Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Post Type */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Post Type</label>
            <select
              name="postType"
              value={formData.postType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select Post Type</option>
              <option value="houses">Houses</option>
              <option value="sales">sales</option>
              <option value="service">Service</option>
              <option value="gigs">Gigs</option>
              <option value="jobs">Jobs</option>
              <option value="community event">Community Event</option>
              <option value="discussions-forums">Discussions-forums</option>
              <option value="resumes">Resumes</option>
            </select>
          </div>

          {/* Intent */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="intent"
                value="offering"
                checked={formData.intent === "offering"}
                onChange={handleInputChange}
              />
              <span>Offering/Rent</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="intent"
                value="hiring"
                checked={formData.intent === "hiring"}
                onChange={handleInputChange}
              />
              <span>Hiring/Sale</span>
            </label>
          </div>

          {/* Title */}
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* City + Zip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              name="zipcode"
              placeholder="Zip Code"
              value={formData.zipcode}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 h-28 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Contact Info */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Buttons */}
          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Submit Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostAdd;
