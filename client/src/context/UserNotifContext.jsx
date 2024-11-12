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
  const [lastUpdate, setLastUpdate] = useState(null); // Track the last update time
  const [geoStatusUpdateCount, setGeoStatusUpdateCount] = useState(null);

  // useRef to hold the previous statuses to detect changes
  const previousStatusesRef = useRef([]);
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
      const newUserReports = response.data;
      setUserReports(newUserReports);

      // Extract the statuses from the new reports
      const newStatuses = newUserReports.map((report) => report.status);

      // Check if the statuses have changed (deep comparison)
      if (
        JSON.stringify(newStatuses) !==
        JSON.stringify(previousStatusesRef.current)
      ) {
        console.log("Statuses have changed, updating...");
        setStatuses(newStatuses);
        previousStatusesRef.current = newStatuses; // Save the current statuses to ref
      }
    } catch (error) {
      console.error("Error fetching user reports:", error);
    }
  };

  // Fetch user reports initially
  useEffect(() => {
    fetchUserReports();
  }, []);

  // Refetch user reports if there is a change in the status array
  useEffect(() => {
    // Check if any status changed compared to the previous statuses
    const statusesHaveChanged = userReports.some((report, index) => {
      return report.status !== previousStatusesRef.current[index];
    });

    if (statusesHaveChanged) {
      console.log("Refetching due to status change...");
      fetchUserReports();
    }
  }, [userReports]);

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
