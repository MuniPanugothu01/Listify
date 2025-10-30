import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Load location from localStorage on component mount
  useEffect(() => {
    const savedCountry = localStorage.getItem("selectedCountry");
    const savedCity = localStorage.getItem("selectedCity");

    if (savedCountry) {
      setSelectedCountry(JSON.parse(savedCountry));
    }
    if (savedCity) {
      setSelectedCity(JSON.parse(savedCity));
    }
  }, []);

  const updateLocation = (country, city) => {
    setSelectedCountry(country);
    setSelectedCity(city);

    // Save to localStorage
    localStorage.setItem("selectedCountry", JSON.stringify(country));
    localStorage.setItem("selectedCity", JSON.stringify(city));
  };

  const clearLocation = () => {
    setSelectedCountry(null);
    setSelectedCity(null);
    localStorage.removeItem("selectedCountry");
    localStorage.removeItem("selectedCity");
  };

  const value = {
    selectedCountry,
    selectedCity,
    updateLocation,
    clearLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
