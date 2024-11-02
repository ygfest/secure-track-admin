import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserLocationContext = createContext();

export const useLocation = () => useContext(UserLocationContext);

export const UserLocationProvider = ({ children }) => {
  const [isLocationOn, setIsLocationOn] = useState(false);
  const [currentUserLat, setCurrentUserLat] = useState(null);
  const [currentUserLong, setCurrentUserLong] = useState(null);
  const [updatedLat, setUpdatedLat] = useState(null);
  const [updatedLong, setUpdatedLong] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLocationStatus = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/verify`, {
          withCredentials: true,
        });
        setIsLocationOn(response.data.user.isLocationOn);
        setCurrentUserLat(Number(response.data.user.latitude));
        setCurrentUserLong(Number(response.data.user.longitude));
        console.log(response.data.user.isLocationOn);
      } catch (error) {
        console.error("Error fetching location status:", error);
      }
    };
    fetchLocationStatus();
  }, [currentUserLat, currentUserLong]);

  const updateLocation = async (locationStatus) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUpdatedLat(latitude);
          setUpdatedLong(longitude);

          try {
            await axios.put(`${apiUrl}/auth/update-location`, {
              latitude,
              longitude,
              isLocationOn: locationStatus,
            });
            console.log(
              "Location updated successfully, isLocationOn:",
              locationStatus
            );
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

  useEffect(() => {
    let locationInterval = null;
    if (isLocationOn) {
      updateLocation(isLocationOn); // Initial location update
      locationInterval = setInterval(() => updateLocation(isLocationOn), 10000); // Update every minute
    }
    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, [isLocationOn]);

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
