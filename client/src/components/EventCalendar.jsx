import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Calendar,
  Home,
  ShoppingCart,
  Heart,
  Briefcase,
  Music,
  MessageCircle,
  FileText,
  Shield,
  TrendingUp,
  Star,
  Eye,
} from "lucide-react";

export default function MarketplaceDiscovery() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1));
  const [selectedDate, setSelectedDate] = useState(5); // Single date instead of array
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Marketplace Statistics
  const marketplaceStats = [
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "24/7", label: "Support", icon: Shield },
    { value: "98%", label: "Satisfaction", icon: Star },
    { value: "5.2M", label: "Monthly Views", icon: Eye },
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Enhanced categories with detailed information
  const categories = [
    {
      imageUrl: "/Housing.jpg",
      label: "Housing",
      description: "2,341 active listings • Verified landlords",
      path: "/categories/houses",
      stats: { active: 2341, newToday: 47, verified: 1890 },
      icon: Home,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      label: "Sales",
      description: "1,892 great deals • Price comparisons",
      path: "/categories/sales",
      stats: { active: 1892, newToday: 123, verified: 1567 },
      icon: ShoppingCart,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      imageUrl: "/community.jpg",
      label: "Community",
      description: "Local events & neighborhood connections",
      path: "/categories/community",
      stats: { active: 856, newToday: 23, verified: 723 },
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      label: "Services",
      description: "Home & repair professionals • Rated & reviewed",
      path: "/categories/services",
      stats: { active: 1123, newToday: 45, verified: 890 },
      icon: Briefcase,
      gradient: "from-orange-500 to-red-500",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop",
      label: "Gigs",
      description: "Music & entertainment opportunities",
      path: "/categories/gigs",
      stats: { active: 567, newToday: 34, verified: 456 },
      icon: Music,
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
      label: "Jobs",
      description: "Career opportunities • Local employers",
      path: "/categories/jobs",
      stats: { active: 1789, newToday: 89, verified: 1456 },
      icon: Briefcase,
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400&h=300&fit=crop",
      label: "Discussion Forums",
      description: "Join community discussions • Share insights",
      path: "/categories/discussion",
      stats: { active: 3456, newToday: 156, verified: 2987 },
      icon: MessageCircle,
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400&h=300&fit=crop",
      label: "Resumes",
      description: "Find and share professional resumes",
      path: "/categories/resumes",
      stats: { active: 678, newToday: 12, verified: 543 },
      icon: FileText,
      gradient: "from-gray-500 to-slate-500",
    },
  ];

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

  const generateCalendarDays = () => {
    const days = [];
    const weeks = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    return weeks;
  };

  const previousMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );

  const selectMonth = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setShowMonthPicker(false);
    // Clear selection when changing month
    setSelectedDate(null);
  };

  const selectYear = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearPicker(false);
    // Clear selection when changing year
    setSelectedDate(null);
  };

  // Updated toggleDate function to select only one date
  const selectDate = (day) => {
    if (selectedDate === day) {
      // If clicking the same date, deselect it
      setSelectedDate(null);
    } else {
      // Select the new date (only one date can be selected)
      setSelectedDate(day);
    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 50; i <= currentYear + 50; i++) years.push(i);
    return years;
  };

  const handleCategoryClick = (label, path) => navigate(path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className=" relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar Section */}
          <div className="w-full lg:w-96 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 transform hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 relative">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-[#2F3A63] to-blue-600 rounded-full"></div>
              Event Calendar
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {selectedDate ? "1 selected" : "0 selected"}
              </span>
            </h2>

            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-6 px-2 relative">
              <button
                onClick={previousMonth}
                className="p-2 text-gray-500 hover:text-[#2F3A63] rounded-lg transition-colors duration-200 hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowMonthPicker(!showMonthPicker);
                    setShowYearPicker(false);
                  }}
                  className="px-3 py-1 text-base font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {monthNames[currentDate.getMonth()]}
                </button>
                <button
                  onClick={() => {
                    setShowYearPicker(!showYearPicker);
                    setShowMonthPicker(false);
                  }}
                  className="px-3 py-1 text-base font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {currentDate.getFullYear()}
                </button>
              </div>
              <button
                onClick={nextMonth}
                className="p-2 text-gray-500 hover:text-[#2F3A63] rounded-lg transition-colors duration-200 hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Month Picker */}
            {showMonthPicker && (
              <div className="absolute top-20 left-4 right-4 z-40 bg-white rounded-xl shadow-2xl p-4 mt-2 border border-gray-100 grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {monthNames.map((month, index) => (
                  <button
                    key={index}
                    onClick={() => selectMonth(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentDate.getMonth() === index
                        ? "bg-gradient-to-r from-[#2F3A63] to-[#1e2a4a] text-white shadow-md"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {month.substring(0, 3)}
                  </button>
                ))}
              </div>
            )}

            {/* Year Picker */}
            {showYearPicker && (
              <div className="absolute top-20 left-4 right-4 z-40 bg-white rounded-xl shadow-2xl p-4 mt-2 border border-gray-100 grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {generateYears().map((year) => (
                  <button
                    key={year}
                    onClick={() => selectYear(year)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentDate.getFullYear() === year
                        ? "bg-gradient-to-r from-[#2F3A63] to-[#1e2a4a] text-white shadow-md"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}

            {/* Calendar Grid */}
            <div className="space-y-1">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div
                    key={i}
                    className="text-center text-xs font-semibold text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>
              {generateCalendarDays().map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) =>
                    day === null ? (
                      <div key={dayIndex} className="aspect-square" />
                    ) : (
                      <button
                        key={dayIndex}
                        onClick={() => selectDate(day)}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedDate === day
                            ? "bg-gradient-to-br from-[#2F3A63] to-[#1e2a4a] text-white shadow-lg transform scale-105"
                            : "text-gray-500 hover:bg-gray-100 hover:shadow-sm"
                        }`}
                      >
                        {day}
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>

            {/* Calendar Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[#2F3A63]/5 to-blue-500/5 rounded-xl border border-[#2F3A63]/10">
              <p className="text-sm text-gray-600 text-center">
                {selectedDate ? (
                  <>
                    📅{" "}
                    <strong>
                      Date selected: {monthNames[currentDate.getMonth()]}{" "}
                      {selectedDate}
                    </strong>{" "}
                    • View events for this date
                  </>
                ) : (
                  <>
                    📅 <strong>Click on a date to select it</strong> • View
                    events for specific dates
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Categories Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Browse Categories
                </h2>
                <p className="text-gray-600 mt-2">
                  Explore{" "}
                  {categories
                    .reduce((sum, cat) => sum + cat.stats.active, 0)
                    .toLocaleString()}
                  + verified listings across your community
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, idx) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={idx}
                    className="group bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl  border border-gray-200/50"
                    onClick={() =>
                      handleCategoryClick(category.label, category.path)
                    }
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.imageUrl}
                        alt={category.label}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent`}
                      />

                      {/* Category Icon */}
                      <div className="absolute top-4 right-4">
                        <div
                          className={`p-2 rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-lg`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Category Info */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1">
                          {category.label}
                        </h3>
                        <p className="text-sm opacity-90 mb-2">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
