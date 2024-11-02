import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserLocationContext = createContext();

export const useLocation = () => useContext(UserLocationContext);

export const UserLocationProvider = ({ children }) => {
  const [isLocationOn, setIsLocationOn] = useState(false);
  const [currentUserLat, setCurrentUserLat] = useState(null);
  const [currentUserLong, setCurrentUserLong] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch initial location status on component mount
  useEffect(() => {
    const fetchLocationStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/verify`, {
          withCredentials: true,
        });
        setIsLocationOn(response.data.user.isLocationOn);
        setCurrentUserLat(Number(response.data.user.latitude));
        setCurrentUserLong(Number(response.data.user.longitude));
        console.log(
          "Initial Location Status:",
          response.data.user.isLocationOn
        );
      } catch (error) {
        console.error("Error fetching location status:", error);
      }
    };
    fetchLocationStatus();
  }, []); // Empty dependency array ensures it runs once on mount

  // Function to update location periodically
  const updateLocation = async (locationStatus) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            await axios.put(`${apiUrl}/auth/update-location`, {
              latitude,
              longitude,
              isLocationOn: locationStatus,
            });
            setCurrentUserLat(latitude);
            setCurrentUserLong(longitude);
            console.log("Location updated:", latitude, longitude);
          } catch (err) {
            console.error("Error updating location:", err);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Set an interval to update the location if isLocationOn is true
  useEffect(() => {
    let locationInterval = null;
    if (isLocationOn) {
      updateLocation(isLocationOn); // Initial location update
      locationInterval = setInterval(() => updateLocation(isLocationOn), 10000); // Update every 10 seconds
    }
    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, [isLocationOn]); // Run the effect whenever isLocationOn changes

  const toggleLocation = async () => {
    const newLocationStatus = !isLocationOn;
    setIsLocationOn(newLocationStatus); // Update local state optimistically

    try {
      await updateLocation(newLocationStatus); // Pass newLocationStatus to updateLocation
    } catch (error) {
      console.error("Error updating location status:", error);
    }
  };

  return (
    <UserLocationContext.Provider
      value={{ isLocationOn, toggleLocation, currentUserLat, currentUserLong }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};
