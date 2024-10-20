import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminNavBarContext = createContext();

export const useAdminNavBarContext = () => useContext(AdminNavBarContext);

export const AdminNavBarProvider = ({ children }) => {
  const [isSeenNotifications, setIsSeenNotifications] = useState(true);
  const [currentLink, setCurrentLink] = useState("/admin/");

  return (
    <AdminNavBarContext.Provider
      value={{
        isSeenNotifications,
        setIsSeenNotifications,
        currentLink,
        setCurrentLink,
      }}
    >
      {children}
    </AdminNavBarContext.Provider>
  );
};
