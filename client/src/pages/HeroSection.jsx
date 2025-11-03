import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Globe } from "../../src/components/ui/globe";

const HeroSection = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const countries = [
    { value: "usa", label: "United States" },
    { value: "canada", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "australia", label: "Australia" },
    { value: "germany", label: "Germany" },
    { value: "france", label: "France" },
    { value: "india", label: "India" },
    { value: "japan", label: "Japan" },
    { value: "brazil", label: "Brazil" },
    { value: "mexico", label: "Mexico" },
  ];

  const cityMap = {
    usa: [
      { value: "new-york", label: "New York" },
      { value: "los-angeles", label: "Los Angeles" },
      { value: "chicago", label: "Chicago" },
    ],
    india: [
      { value: "mumbai", label: "Mumbai" },
      { value: "delhi", label: "Delhi" },
      { value: "bangalore", label: "Bangalore" },
      { value: "hyderabad", label: "Hyderabad" },
    ],
    canada: [
      { value: "toronto", label: "Toronto" },
      { value: "vancouver", label: "Vancouver" },
      { value: "montreal", label: "Montreal" },
    ],
    uk: [
      { value: "london", label: "London" },
      { value: "manchester", label: "Manchester" },
      { value: "birmingham", label: "Birmingham" },
    ],
    australia: [
      { value: "sydney", label: "Sydney" },
      { value: "melbourne", label: "Melbourne" },
      { value: "brisbane", label: "Brisbane" },
    ],
    germany: [
      { value: "berlin", label: "Berlin" },
      { value: "munich", label: "Munich" },
      { value: "hamburg", label: "Hamburg" },
    ],
    france: [
      { value: "paris", label: "Paris" },
      { value: "marseille", label: "Marseille" },
      { value: "lyon", label: "Lyon" },
    ],
    japan: [
      { value: "tokyo", label: "Tokyo" },
      { value: "osaka", label: "Osaka" },
      { value: "kyoto", label: "Kyoto" },
    ],
    brazil: [
      { value: "sao-paulo", label: "São Paulo" },
      { value: "rio-de-janeiro", label: "Rio de Janeiro" },
      { value: "brasilia", label: "Brasília" },
    ],
    mexico: [
      { value: "mexico-city", label: "Mexico City" },
      { value: "guadalajara", label: "Guadalajara" },
      { value: "monterrey", label: "Monterrey" },
    ],
  };

  const handleSearch = () => {
    // Check if either field is empty
    if (!selectedCountry || !selectedCity) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);
    console.log("Searching in", selectedCountry.label, selectedCity.label);
    // Here you would typically navigate to search results or make an API call
  };

  const countryOptions = countries;
  const cityOptions = selectedCountry
    ? cityMap[selectedCountry.value] || []
    : [];

  const handleCountryChange = (option) => {
    setSelectedCountry(option);
    setSelectedCity(null); // Reset city when country changes
    setShowErrors(false);
  };

  const handleCityChange = (option) => {
    setSelectedCity(option);
    setShowErrors(false);
  };

  // Custom styles for react-select with error states
  const customSelectStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    control: (provided, state) => ({
      ...provided,
      borderColor:
        showErrors && !state.selectProps.value
          ? "#EF4444"
          : state.isFocused
          ? "#2F3A63"
          : state.selectProps.value
          ? "#2F3A63"
          : "#D1D5DB",
      boxShadow:
        showErrors && !state.selectProps.value
          ? "0 0 0 1px #EF4444"
          : state.isFocused
          ? "0 0 0 1px #2F3A63"
          : "none",
      "&:hover": {
        borderColor:
          showErrors && !state.selectProps.value
            ? "#EF4444"
            : state.selectProps.value
            ? "#2F3A63"
            : "#9CA3AF",
      },
      transition: "all 0.3s ease",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#2F3A63"
        : state.isFocused
        ? "#F9FAFB"
        : "white",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: "#F9FAFB",
        transform: "translateX(4px)",
        transition: "all 0.2s ease",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#2F3A63",
      fontWeight: "bold",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: showErrors ? "#EF4444" : "#9CA3AF",
    }),
  };

  const entranceAnimation = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
    transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
  });

  return (
    <section className="relative w-full bg-transparent flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 lg:pt-16 pb-12 lg:pb-20 lg:min-h-[680px] z-10">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 text-center lg:text-left lg:mt-0 z-20 flex flex-col justify-center">
        <h1
          className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#2F3A63] leading-tight drop-shadow-2xl"
          style={entranceAnimation(0)}
        >
          Connect. Discover. Buy More.
        </h1>

        <p
          className="mt-6 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow-md"
          style={entranceAnimation(0.3)}
        >
          Find the best deals, services, and products right in your
          neighborhood. Connect with trusted local vendors and experience your
          community like never before.
        </p>

        {/* SEARCH BAR SECTION */}
        <div
          className="mt-8 w-full max-w-4xl mx-auto lg:mx-0"
          style={entranceAnimation(0.6)}
        >
          {/* Search Bar Label */}
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-gray-600 transition-transform hover:scale-110 duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-gray-600 font-medium">
              Find local businesses and services
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white shadow-md rounded-xl p-4 w-full transition-all duration-500 hover:shadow-xl">
            {/* Country Select */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-gray-500 transition-transform hover:scale-110 duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-gray-600 font-medium">
                  Country
                </span>
              </div>
              <Select
                placeholder="Select Country"
                options={countryOptions}
                value={selectedCountry}
                onChange={handleCountryChange}
                isSearchable
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                styles={customSelectStyles}
              />
              {/* {showErrors && !selectedCountry && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  Please select a country
                </p>
              )} */}
            </div>

            {/* City Select */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-gray-500 transition-transform hover:scale-110 duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm text-gray-600 font-medium">City</span>
              </div>
              <Select
                placeholder="Select City"
                options={cityOptions}
                value={selectedCity}
                onChange={handleCityChange}
                isSearchable
                isDisabled={!selectedCountry}
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
                styles={customSelectStyles}
              />
              {/* {showErrors && !selectedCity && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  Please select a city
                </p>
              )} */}
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-[#2F3A63] text-white rounded-lg cursor-pointer font-semibold hover:bg-[#1e2a4a] transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 w-full sm:w-auto h-[42px] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - GLOBE */}
      <div
        className="
          w-full lg:w-1/2 
          flex justify-center lg:justify-end 
          items-center 
          z-10
        "
      >
        <Globe
          className="
            w-[300px] sm:w-[380px] 
            md:w-[380px] 
            lg:w-[460px] 
            xl:w-[520px] 
            max-w-full 
            h-auto 
            object-contain
            lg:mr-20 
            lg:mt-20
          "
        />
      </div>
    </section>
  );
};

export default HeroSection;