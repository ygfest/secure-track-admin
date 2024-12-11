import axios from "axios";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [isLocationOn, setIsLocationOn] = useState(false);
  const [currentLuggageLat, setCurrentLuggageLat] = useState(null);
  const [currentLuggageLong, setCurrentLuggageLong] = useState(null);
  const [locationUpdatedAt, setLocationUpdatedAt] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const updateLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            await axios.put(`${apiUrl}/luggage-router/update-location`, {
              latitude,
              longitude,
              locationUpdatedAt: Date.now(),
            });

            setCurrentLuggageLat(latitude);
            setCurrentLuggageLong(longitude);
            setLocationUpdatedAt(Date.now());
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
      updateLocation(); // Initial location update
      locationInterval = setInterval(() => updateLocation(), 10000); // Update every 10 seconds
    }
    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, [isLocationOn]); // Run the effect whenever isLocationOn changes

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
      <div className="text-center mb-6">
        <p className="text-gray-700">
          {currentLuggageLat && currentLuggageLong
            ? `Current Luggage Location: Lat: ${currentLuggageLat}, Long: ${currentLuggageLong}`
            : "Waiting for location..."}
        </p>
        <p className="text-gray-500">
          Last Updated:{" "}
          {locationUpdatedAt
            ? new Date(locationUpdatedAt).toLocaleString()
            : "Not yet updated"}
        </p>
      </div>

      <div className="flex justify-center items-center">
        <button
          className={`px-6 py-3 rounded-full text-white font-medium transition-colors duration-300 ${
            isLocationOn
              ? "bg-red-500 hover:bg-red-400"
              : "bg-green-500 hover:bg-green-400"
          }`}
          onClick={() => setIsLocationOn(!isLocationOn)}
        >
          {isLocationOn ? "Stop Tracking" : "Start Tracking"}
        </button>
      </div>
    </div>
  );
}
