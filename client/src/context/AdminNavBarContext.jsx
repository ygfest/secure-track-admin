import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminNavBarContext = createContext();

export const useAdminNavBarContext = () => useContext(AdminNavBarContext);

export const AdminNavBarProvider = ({ children }) => {
  const [isSeenNotifications, setIsSeenNotifications] = useState(true);
  const [currentLink, setCurrentLink] = useState("/admin/");
  const [usersData, setUsersData] = useState([]);
  const [notifications, setNotifications] = useState([]); // State for notifications

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/users`);
        const newUsersData = response.data;

        // Check if a new user has been added
        if (usersData.length < newUsersData.length) {
          // Get the last user (assumes the API returns users in order of creation)
          const newUser = newUsersData[newUsersData.length - 1];
          addNotification(newUser); // Call addNotification with the new user
        }

        setUsersData(newUsersData);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchUsersData();
  }, [usersData.length]); // Dependency array with usersData.length

  // Function to create notifications
  const addNotification = (newUser) => {
    const { firstname, lastname, role, createdAt } = newUser; // Get createdAt here if needed
    setNotifications((prev) => [
      ...prev,
      {
        message: `${firstname} ${lastname} has registered as ${role}`,
        timestamp: new Date(createdAt), // Use createdAt timestamp
      },
    ]);
  };

  return (
    <AdminNavBarContext.Provider
      value={{
        isSeenNotifications,
        setIsSeenNotifications,
        currentLink,
        setCurrentLink,
        usersData,
        setUsersData,
        notifications, // Add notifications to the context
        addNotification, // Provide the function to add notifications
      }}
    >
      {children}
    </AdminNavBarContext.Provider>
  );
};
