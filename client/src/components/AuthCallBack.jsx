import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
      // Store the token (e.g., in local storage)
      localStorage.setItem("accessToken", accessToken);

      // Fetch user info (pseudo-code, replace with actual API call)
      fetchUserInfo(accessToken)
        .then((userInfo) => {
          if (userInfo.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/user");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user info", error);
          // Handle error (e.g., navigate to an error page or retry)
        });
    } else {
      console.error("Authentication failed");
      // Handle authentication failure (e.g., navigate to a login page)
    }
  }, [navigate]);

  return (
    <div>
      <h2>Loading...</h2>
    </div>
  );
};

// Dummy function to simulate fetching user info
async function fetchUserInfo(token) {
  // Simulate an API call to fetch user info
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ role: "user" }); // Change to "admin" for testing admin redirection
    }, 1000);
  });
}

export default AuthCallback;
