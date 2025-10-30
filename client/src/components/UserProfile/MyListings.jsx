// components/MyListings.jsx
import React from "react";
import { ChevronRight } from "lucide-react";

const MyListings = ({ count, onViewAll }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 mb-6 sm:p-6">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-gray-900">My Listings</h3>
      <button onClick={onViewAll} className="text-sm text-[#2F3A63] hover:text-[#5669A4] font-medium flex items-center gap-1 transition-colors">
        View all
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
    <p className="text-3xl font-bold text-[#2F3A63] mt-2 sm:text-4xl">{count}</p>
    <p className="text-sm text-gray-500">active</p>
  </div>
);

export default MyListings;