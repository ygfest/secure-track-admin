import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserNotifContext = createContext();

export const useUserNotif = () => useContext(UserNotifContext);

export const UserNotifProvider = ({ children }) => {
  const [luggageInfo, setLuggageInfo] = useState([]);
  const [fallDetectData, setFallDetectData] = useState([]);
  const [tamperData, setTamperData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [isSeenNotifications, setIsSeenNotifications] = useState(true);
  const [currentLink, setCurrentLink] = useState("/user/");
  const [openNotif, setOpenNotif] = useState(false);

  useEffect(() => {
    async function fetchFallData() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/luggage-router/fall-logs2`);
        setFallDetectData(response.data);
      } catch (error) {
        console.log("Error fetching fall data", error);
      }
    }

    fetchFallData();
  }, []);

  useEffect(() => {
    async function fetchTamperLogs() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(
          `${apiUrl}/luggage-router/tamper-logs2`
        );
        setTamperData(response.data);
      } catch (error) {
        console.log("Error fetching tamper logs", error);
      }
    }
    fetchTamperLogs();
  }, []);

  useEffect(() => {
    async function fetchTempLogs() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/luggage-router/temp-logs`);
        setTempData(response.data);
      } catch (error) {
        console.log("Error fetching temp logs", error);
      }
    }
    fetchTempLogs();
  }, []);

  useEffect(() => {
    async function fetchLuggageInfo() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/luggage-router/luggage`);
        setLuggageInfo(response.data);
      } catch (error) {
        console.log("Error fetching luggage info", error);
      }
    }
    fetchLuggageInfo();
  }, []);

  return (
    <UserNotifContext.Provider
      value={{
        luggageInfo,
        fallDetectData,
        tamperData,
        tempData,
        isSeenNotifications,
        setIsSeenNotifications,
        currentLink,
        setCurrentLink,
        openNotif,
        setOpenNotif,
      }}
    >
      {children}
    </UserNotifContext.Provider>
  );
};
