import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1));
  const [selectedDates, setSelectedDates] = useState([5, 17]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

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

  const categories = [
    {
      imageUrl: "/Housing.jpg",
      label: "Housing",
      description: "Local happenings & festivals",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      label: "Sales",
      description: "Great deals on items",
    },
    {
      imageUrl: "/community.jpg",
      label: "Community",
      description: "Connect with neighbors",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      label: "Services",
      description: "Home & repair pros",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop",
      label: "Gigs",
      description: "Music & entertainment",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
      label: "Jobs",
      description: "Career opportunities",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400&h=300&fit=crop",
      label: "Discussion Forums",
      description: "Join community discussions",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400&h=300&fit=crop",
      label: "Resumes",
      description: "Find and share resumes",
    },
  ];

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
  };
  const selectYear = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearPicker(false);
  };
  const toggleDate = (day) =>
    setSelectedDates(
      selectedDates.includes(day)
        ? selectedDates.filter((d) => d !== day)
        : [...selectedDates, day]
    );
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 50; i <= currentYear + 50; i++) years.push(i);
    return years;
  };
  const handleCategoryClick = (label) =>
    console.log(`Category clicked: ${label}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 relative z-0">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left - Calendar */}
        <div className="w-full h-fit lg:w-80 bg-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-200 relative">
          <h2 className="text-lg font-semibold text-[#2F3A63] mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-[#2F3A63] to-[#1e2a4a] rounded-full"></div>
            Event Calendar
          </h2>

          {/* Navigation */}
          <div className="flex items-center justify-between mb-6 px-2 relative">
            <button
              onClick={previousMonth}
              className="p-2 text-gray-500 hover:text-[#2F3A63] rounded-lg transition-colors duration-200"
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
              className="p-2 text-gray-500 hover:text-[#2F3A63] rounded-lg transition-colors duration-200"
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

          {/* Calendar */}
          <div className="space-y-1 h-fit">
            <div className="grid grid-cols-7 gap-1 mb-2 h-fit">
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
                      onClick={() => toggleDate(day)}
                      className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedDates.includes(day)
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
        </div>

        {/* Right - Categories */}
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#2F3A63]">
            Explore Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                onClick={() => handleCategoryClick(category.label)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.imageUrl}
                    alt={category.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{category.label}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
