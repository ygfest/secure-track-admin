// LocationContext.js
import React, { createContext, useContext, useState } from "react";

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [isLocationOn, setIsLocationOn] = useState(false);

  const toggleLocation = () => {
    setIsLocationOn((prev) => !prev);
  };

  return (
    <LocationContext.Provider value={{ isLocationOn, toggleLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
