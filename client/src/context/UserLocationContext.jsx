import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserLocationContext = createContext();

export const useLocation = () => useContext(UserLocationContext);

export const UserLocationProvider = ({ children }) => {
  const [isLocationOn, setIsLocationOn] = useState(false);
  const [currentUserLat, setCurrentUserLat] = useState(null);
  const [currentUserLong, setCurrentUserLong] = useState(null);
  const [locationUpdatedAt, setLocationUpdatedAt] = useState(null);

  const [currentLuggageLat, setCurrentLuggageLat] = useState(null);
  const [currentLuggageLong, setCurrentLuggageLong] = useState(null);

  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
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
        setLocationUpdatedAt(response.data.user.locationUpdatedAt);
        setUserRole(response.data.user.role);
        setUserId(response.data.user.userID);
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

  // to update location periodically in the database
  const updateLocation = async (locationStatus) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            if (userRole === "user") {
              await axios.put(`${apiUrl}/auth/update-location`, {
                latitude,
                longitude,
                isLocationOn: locationStatus,
                locationUpdatedAt: Date.now(),
              });
              setCurrentUserLat(latitude);
              setCurrentUserLong(longitude);
              setLocationUpdatedAt(Date.now());
              //console.log("Location updated for USER:", latitude, longitude);
            } else if (
              userRole === "admin" &&
              userId === "66f7dedffe3d65c0c8ce7b4a"
            ) {
              await axios.put(`${apiUrl}/luggage-router/update-location`, {
                latitude,
                longitude,
                locationUpdatedAt: Date.now(),
              });
              setCurrentLuggageLat(latitude);
              setCurrentLuggageLong(longitude);
              setLocationUpdatedAt(Date.now());
              //console.log("Location updated for LUGGAGE:", latitude, longitude);
            }
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

  // This is to update the users location by every 10 seconds
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
      value={{
        isLocationOn,
        toggleLocation,
        currentUserLat,
        currentUserLong,
        locationUpdatedAt,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
};
