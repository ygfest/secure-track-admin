import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("googleAccessToken", accessToken);

      // Fetch user info from Google
      axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (response) => {
          console.log("User Info:", response.data);

          // Send user info to backend for storage
          try {
            const apiUrl = import.meta.env.VITE_API_URL;

            // Set custom headers and enable credentials
            const headers = {
              "Content-Type": "application/json", // Ensure the Content-Type is set
              "Custom-Header": "YourHeaderValue", // Add your custom headers here if needed
            };

            // Traditional request to save user info in backend
            const saveResponse = await axios.post(
              `${apiUrl}/auth/save-google-user`,
              {
                googleId: response.data.sub,
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                picture: response.data.picture,
              },
              {
                withCredentials: true, // This is necessary for sending cookies with the request
                headers: headers, // Custom headers
              }
            );

            const userRoleResponse = await axios.get(`${apiUrl}/auth/verify`, {
              withCredentials: true,
            });

            const userRole = userRoleResponse.data.user.role;
            console.log(userRole);

            // Redirect to home or dashboard
            if (userRole === "admin") {
              navigate("/admin");
            } else {
              navigate("/user");
            }
          } catch (err) {
            console.error("Error saving user info:", err);
            setError("Failed to save user information.");
          }

          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user info:", err);
          setError("Failed to fetch user information.");
          setLoading(false);
        });
    } else {
      console.error("Access token not found");
      setError("No access token found.");
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
}
