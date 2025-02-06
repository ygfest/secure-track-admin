import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUserData = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  //user props
  const [userId, setUserId] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profileDp, setProfileDp] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCreatedAt, setProfileCreatedAt] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLocationOn, setIsLocationOn] = useState(false);
  const [radius, setRadius] = useState(null);
  const [currentUserLat, setCurrentUserLat] = useState(null);
  const [currentUserLong, setCurrentUserLong] = useState(null);
  const [locationUpdatedAt, setLocationUpdatedAt] = useState(null);

  //luggage props
  const [currentLuggageLat, setCurrentLuggageLat] = useState(null);
  const [currentLuggageLong, setCurrentLuggageLong] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch initial location status on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/verify`, {
          withCredentials: true,
        });
        setUserId(response.data.user.userID);
        setProfileDp(response.data.user.profile_dp);
        setProfileEmail(response.data.user.email);
        setProfileFirstName(response.data.user.firstname);
        setProfileLastName(response.data.user.lastname);
        setProfilePhone(response.data.user.phone);
        setProfileCreatedAt(response.data.user.createdAt);
        setRadius(response.data.user.geofenceRadius);
        setIsLocationOn(response.data.user.isLocationOn);
        setCurrentUserLat(Number(response.data.user.latitude));
        setCurrentUserLong(Number(response.data.user.longitude));
        setLocationUpdatedAt(response.data.user.locationUpdatedAt);
        setUserRole(response.data.user.role);
        console.log(
          "Initial Location Status:",
          response.data.user.isLocationOn
        );
      } catch (error) {
        console.error("Error fetching location status:", error);
      }
    };
    fetchUserData();
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
    <UserContext.Provider
      value={{
        userId,
        profileEmail,
        profileFirstName,
        setProfileFirstName,
        profileLastName,
        setProfileLastName,
        profileDp,
        setProfileDp,
        profilePhone,
        setProfilePhone,
        userRole,
        profileCreatedAt,
        isLocationOn,
        radius,
        toggleLocation,
        currentUserLat,
        currentUserLong,
        locationUpdatedAt,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
