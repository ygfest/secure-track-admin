import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";

const UserNotifContext = createContext();

export const useUserNotif = () => useContext(UserNotifContext);

export const UserNotifProvider = ({ children }) => {
  const [luggageInfo, setLuggageInfo] = useState([]);
  const [fallDetectData, setFallDetectData] = useState([]);
  const [tamperData, setTamperData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [isSeenNotifications, setIsSeenNotifications] = useState(true);
  const [hasNewAlerts, setHasNewAlerts] = useState(false);
  const [currentLink, setCurrentLink] = useState("/user/");
  const [openNotif, setOpenNotif] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [geoStatusUpdateCount, setGeoStatusUpdateCount] = useState(null);

  // useRef to hold the previous statuses to detect changes
  const previousStatuses = useRef([]);

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

  const fetchUserReports = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/auth/user-reports`);
      setUserReports(response.data);

      // Extract statuses from each report
      const updatedStatuses = response.data.map((report) => report.status);

      // Only update statuses if they actually differ from the previous ones
      if (
        JSON.stringify(updatedStatuses) !==
        JSON.stringify(previousStatuses.current)
      ) {
        setStatuses(updatedStatuses);
        previousStatuses.current = updatedStatuses; // Update the ref to the latest statuses
      }

      console.log("Fetched user reports:", response.data);
    } catch (error) {
      console.error("Error fetching user reports:", error);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchUserReports();
  }, []);

  useEffect(() => {
    // Refetch user reports if there's a change in the statuses array
    if (JSON.stringify(statuses) !== JSON.stringify(previousStatuses.current)) {
      fetchUserReports();
      console.log("I AM BEING REFETCHED!");
    }
  }, [statuses]);

  console.log("COUNTER:", geoStatusUpdateCount);

  const handleNotifClick = () => {
    setOpenNotif(!openNotif);
    setIsSeenNotifications(true);
    setHasNewAlerts(false);
  };

  return (
    <UserNotifContext.Provider
      value={{
        luggageInfo,
        fallDetectData,
        tamperData,
        tempData,
        userReports,
        statuses,
        setStatuses,
        isSeenNotifications,
        setIsSeenNotifications,
        hasNewAlerts,
        setHasNewAlerts,
        currentLink,
        setCurrentLink,
        openNotif,
        setOpenNotif,
        fetchUserReports,
        handleNotifClick,
        geoStatusUpdateCount,
        setGeoStatusUpdateCount,
      }}
    >
      {children}
    </UserNotifContext.Provider>
  );
};
