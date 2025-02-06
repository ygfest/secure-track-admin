import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const AdminDataContext = createContext();

export const useAdminDataContext = () => useContext(AdminDataContext);

export const AdminDataProvider = ({ children }) => {
  const [usersData, setUsersData] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [luggageData, setLuggageData] = useState([]);
  const [isSeenNotifications, setIsSeenNotifications] = useState(true);
  const location = useLocation();
  const [currentLink, setCurrentLink] = useState(location.pathname);

  useEffect(() => {
    // Fetch users data
    const fetchUsersData = async () => {
      const res = await axiosInstance("/auth/users");
      setUsersData(res.data);
    };
    fetchUsersData();

    // Fetch reports data
    const fetchReportsData = async () => {
      const res = await axiosInstance("/auth/reports");
      setReportsData(res.data);
    };
    fetchReportsData();

    // Fetch luggage info (if needed)
    const fetchLuggageInfo = async () => {
      const res = await axiosInstance("/luggage-router/luggage-admin");
      setLuggageData(res.data);
    };
    fetchLuggageInfo();
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        usersData,
        reportsData,
        luggageData,
        setLuggageData,
        isSeenNotifications,
        setIsSeenNotifications,
        currentLink,
        setCurrentLink,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};
