import React, { useState } from "react";
import Select from "react-select";
import { Globe } from "../../src/components/ui/globe";

const HeroSection = () => {
  const [selectedCountry, setSelectedCountry] = useState({ value: "india", label: "India" });
  const [selectedCity, setSelectedCity] = useState({ value: "hyderabad", label: "Hyderabad" });

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
  };

  const handleSearch = () => {
    if (selectedCountry && selectedCity) {
      console.log("Searching in", selectedCountry.label, selectedCity.label);
    }
  };

  const countryOptions = countries;
  const cityOptions = selectedCountry
    ? cityMap[selectedCountry.value] || []
    : [];

  const handleCountryChange = (option) => {
    setSelectedCountry(option);
    setSelectedCity(null);
  };

  // Custom styles to fix z-index for portaled menu and use theme colors
  const customSelectStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#2F3A63' : (state.selectProps.value ? '#2F3A63' : '#D1D5DB'),
      boxShadow: state.isFocused ? '0 0 0 1px #2F3A63' : 'none',
      '&:hover': {
        borderColor: state.selectProps.value ? '#2F3A63' : '#9CA3AF',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#2F3A63' 
        : state.isFocused 
          ? '#F9FAFB' 
          : 'white',
      color: state.isSelected ? 'white' : 'black',
      '&:hover': {
        backgroundColor: '#F9FAFB',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#2F3A63',
      fontWeight: 'bold',
    }),
  };

  return (
    <section className="relative w-full bg-transparent flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 lg:pt-16 pb-12 lg:pb-20 lg:min-h-[600px] min-h-[560px] z-10">
      {/* LEFT SIDE */}
      <div className="w-full  lg:w-1/2 text-center lg:text-left  lg:mt-0 z-20 flex flex-col justify-center">
    
         <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#2F3A63] leading-tight drop-shadow-2xl">
          Connect. Discover. Buy More.
        </h1>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow-md">
          Find the best deals, services, and products right in your neighborhood.
          Connect with trusted local vendors and experience your community like
          never before.
        </p>


        {/* SEARCH BAR SECTION */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white shadow-md rounded-xl p-4 w-full max-w-4xl mx-auto lg:mx-0">
          {/* Country Select */}
          <Select
            placeholder="Select Country"
            options={countryOptions}
            value={selectedCountry}
            onChange={handleCountryChange}
            isSearchable
            className="flex-1"
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            styles={customSelectStyles}
          />

          {/* City Select */}
          <Select
            placeholder="Select City"
            options={cityOptions}
            value={selectedCity}
            onChange={setSelectedCity}
            isSearchable
            isDisabled={!selectedCountry}
            className="flex-1"
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            styles={customSelectStyles}
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={!selectedCountry || !selectedCity}
            className="px-6 py-3 bg-[#2F3A63] text-white rounded-lg font-semibold hover:bg-[#1e2a4a] transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            Search
          </button>
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
            w-[300px] md:mt-10
            sm:w-[380px] 
            md:w-[380px] 
            lg:w-[460px] 
            xl:w-[520px] 
            max-w-full 
            h-auto 
            object-contain
            lg:mr-20 
          "
        />
      </div>
    </section>
  );
};

export default HeroSection;