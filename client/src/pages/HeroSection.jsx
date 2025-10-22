import React, { useState } from "react";
import Select from "react-select";
import { Globe } from "../../src/components/ui/globe";

const HeroSection = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Sample list of countries (in production, load from JSON or API)
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
    // Add more countries... In production, use full list from API like restcountries.com
  ];

  // Sample city map (in production, fetch dynamically based on country)
  const cityMap = {
    usa: [
      { value: "new-york", label: "New York" },
      { value: "los-angeles", label: "Los Angeles" },
      { value: "chicago", label: "Chicago" },
      { value: "houston", label: "Houston" },
      { value: "phoenix", label: "Phoenix" },
    ],
    canada: [
      { value: "toronto", label: "Toronto" },
      { value: "vancouver", label: "Vancouver" },
      { value: "montreal", label: "Montreal" },
      { value: "calgary", label: "Calgary" },
      { value: "ottawa", label: "Ottawa" },
    ],
    uk: [
      { value: "london", label: "London" },
      { value: "manchester", label: "Manchester" },
      { value: "birmingham", label: "Birmingham" },
      { value: "glasgow", label: "Glasgow" },
      { value: "edinburgh", label: "Edinburgh" },
    ],
    australia: [
      { value: "sydney", label: "Sydney" },
      { value: "melbourne", label: "Melbourne" },
      { value: "brisbane", label: "Brisbane" },
      { value: "perth", label: "Perth" },
      { value: "adelaide", label: "Adelaide" },
    ],
    germany: [
      { value: "berlin", label: "Berlin" },
      { value: "hamburg", label: "Hamburg" },
      { value: "munich", label: "Munich" },
      { value: "cologne", label: "Cologne" },
      { value: "frankfurt", label: "Frankfurt" },
    ],
    france: [
      { value: "paris", label: "Paris" },
      { value: "marseille", label: "Marseille" },
      { value: "lyon", label: "Lyon" },
      { value: "toulouse", label: "Toulouse" },
      { value: "nice", label: "Nice" },
    ],
    india: [
      { value: "mumbai", label: "Mumbai" },
      { value: "delhi", label: "Delhi" },
      { value: "bangalore", label: "Bangalore" },
      { value: "hyderabad", label: "Hyderabad" },
      { value: "ahmedabad", label: "Ahmedabad" },
    ],
    japan: [
      { value: "tokyo", label: "Tokyo" },
      { value: "osaka", label: "Osaka" },
      { value: "kyoto", label: "Kyoto" },
      { value: "yokohama", label: "Yokohama" },
      { value: "nagoya", label: "Nagoya" },
    ],
    brazil: [
      { value: "sao-paulo", label: "São Paulo" },
      { value: "rio-de-janeiro", label: "Rio de Janeiro" },
      { value: "brasilia", label: "Brasília" },
      { value: "salvador", label: "Salvador" },
      { value: "fortaleza", label: "Fortaleza" },
    ],
    mexico: [
      { value: "mexico-city", label: "Mexico City" },
      { value: "guadalajara", label: "Guadalajara" },
      { value: "monterrey", label: "Monterrey" },
      { value: "puebla", label: "Puebla" },
      { value: "tijuana", label: "Tijuana" },
    ],
    // Add more for other countries...
  };

  const handleSearch = () => {
    if (selectedCountry && selectedCity) {
      console.log("Searching in", selectedCountry.label, selectedCity.label);
      // Add navigation or search logic here
    }
  };

  const countryOptions = countries;
  const cityOptions = selectedCountry
    ? cityMap[selectedCountry.value] || []
    : [];

  return (
    <>
      <div className="bg-transparent relative flex w-full flex-col lg:flex-row items-center justify-center overflow-hidden  px-4 sm:px-6 lg:px-10 pt-16  lg:pb-16 lg:h-[600px] z-10 max-w-7xl mx-auto">
        {/* Text Section - Left Side */}
        <div className="flex-1 w-full lg:w-1/2 order-2 lg:order-1 mb-8 lg:mb-0 px-4 lg:px-0">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#2F3A63] sm:mb-6 md:mb-8 drop-shadow-2xl">
            Discover Local Buy Global
          </h1>

          {/* Subtext */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Find the best deals, services, and products right in your
              neighborhood. Connect with trusted local vendors and experience
              your community like never before.
            </p>
          </div>

          {/* Search Functionality - Searchable Autocomplete for Country and City */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 shadow-lg rounded-lg p-4 bg-white relative z-50">
            {/* Country Searchable Select */}
            <Select
              placeholder="Search for Country..."
              options={countryOptions}
              value={selectedCountry}
              onChange={setSelectedCountry}
              isSearchable={true}
              className="flex-1"
              classNamePrefix="react-select"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#2F3A63",
                  primary25: "#2F3A63/5",
                },
              })}
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: "48px",
                  borderColor: "#e5e7eb",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#2F3A63",
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
                menuPortal: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
              }}
              menuPortalTarget={document.body}
            />

            {/* City Searchable Select */}
            <Select
              placeholder="Search for City..."
              options={cityOptions}
              value={selectedCity}
              onChange={setSelectedCity}
              isSearchable={true}
              isDisabled={!selectedCountry}
              className="flex-1"
              classNamePrefix="react-select"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#2F3A63",
                  primary25: "#2F3A63/5",
                },
              })}
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: "48px",
                  borderColor: "#e5e7eb",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#2F3A63",
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
                menuPortal: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
              }}
              menuPortalTarget={document.body}
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={!selectedCountry || !selectedCity}
              className="px-6 py-3 bg-[#2F3A63] text-white rounded-lg font-semibold hover:bg-[#1e2a4a] transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-[0_10px_25px_rgba(0,0,0,0.15),0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]"
            >
              Search
            </button>
          </div>
        </div>

        {/* Globe Section - Right Side */}
        <div className="hidden lg:block w-full lg:w-1/2 order-1 lg:order-2 flex justify-center items-center h-64 lg:h-full relative">
          <Globe className="w-full h-full max-w-md lg:max-w-lg" />
        </div>

        <div className="pointer-events-none absolute inset-0 h-full" />
      </div>
    </>
  );
};

export default HeroSection;
