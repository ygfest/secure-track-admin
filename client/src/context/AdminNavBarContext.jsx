import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminNavBarContext = createContext();

export const useAdminNavBarContext = () => useContext(AdminNavBarContext);

export const AdminNavBarProvider = ({ children }) => {
  const [isSeenNotifications, setIsSeenNotifications] = useState(true);
  const [currentLink, setCurrentLink] = useState("/admin/");
  const [notifications, setNotifications] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  const addNotification = (message) => {
    setNotifications((prev) => [
      ...prev,
      { message, timestamp: new Date().toISOString() },
    ]);
  };

  useEffect(() => {
    const fetchNewRegUsers = async () => {
      try {
        // Fetch from standard signup endpoint
        const responseSignup = await axios.get(`${apiUrl}/auth/signup`);
        const newUsersSignup = responseSignup.data;

        // Fetch from Google signup endpoint
        const responseGoogleSignup = await axios.get(
          `${apiUrl}/auth/save-google-user`
        );
        const newUsersGoogleSignup = responseGoogleSignup.data;

        // Combine all users
        const allNewUsers = [...newUsersSignup, ...newUsersGoogleSignup];

        allNewUsers.forEach((user) => {
          const fullName = `${user.firstname} ${user.lastname}`;
          const createdAt = new Date(user.createdAt).toLocaleString();
          addNotification(`New account created: ${fullName} on ${createdAt}`);
        });
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchNewRegUsers();
  }, []);

  return (
    <AdminNavBarContext.Provider
      value={{
        isSeenNotifications,
        setIsSeenNotifications,
        currentLink,
        setCurrentLink,
        notifications,
      }}
    >
      {children}
    </AdminNavBarContext.Provider>
  );
};
