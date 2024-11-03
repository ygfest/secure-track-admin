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

      axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then(async (response) => {
          console.log("User Info:", response.data);

          try {
            const apiUrl = import.meta.env.VITE_API_URL;

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
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
              }
            );

            // Only proceed if save was successful
            if (saveResponse.status === 200) {
              const userRoleResponse = await axios.get(
                `${apiUrl}/auth/verify`,
                {
                  withCredentials: true,
                }
              );

              const userRole = userRoleResponse.data.user.role;
              console.log(userRole);

              // Navigate based on user role
              if (userRole === "admin") {
                navigate("/admin");
              } else {
                navigate("/user");
              }
            } else {
              setError("Failed to save user information.");
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
      setError("No access token found.");
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return null;
}
