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
  const prevStatusesRef = useRef([]);
  const [luggageInfo, setLuggageInfo] = useState([]);
  const [fallDetectData, setFallDetectData] = useState([]);
  const [tamperData, setTamperData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [hasNewNotifs, setHasNewNotifs] = useState(false);
  const [hasNewAlerts, setHasNewAlerts] = useState(false);
  const [alerts, setAlerts] = useState(() => {
    return localStorage.getItem("alerts");
  });
  const [currentLink, setCurrentLink] = useState(() => {
    return localStorage.getItem("currentLink") || "/user/";
  });
  const [openNotif, setOpenNotif] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [statuses, setStatuses] = useState(null);

  useEffect(() => {
    localStorage.setItem("alerts", alerts);
  }, [alerts]);

  useEffect(() => {
    // Update localStorage whenever currentLink changes
    localStorage.setItem("currentLink", currentLink);
  }, [currentLink]);

  {
    /*
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
  }, [fallDetectData]);

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
  }, [tamperData]);

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
  }, [tempData]);

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
  }, [luggageInfo]);*/
  }

  useEffect(() => {
    // Create the EventSource connection with credentials
    const eventSource = new EventSource(
      "http://localhost:3000/luggage-router/notifications",
      {
        withCredentials: true, // Send cookies with the request
      }
    );

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);

      // Update the state with the real-time data from SSE
      setTempData(data.tempLogs);
      setTamperData(data.tamperLogs);
      setFallDetectData(data.fallLogs);
      setLuggageInfo(data.luggageData);
    };

    eventSource.onerror = function (error) {
      console.error("SSE error: ", error); // Handle any SSE errors
    };

    // Cleanup the EventSource when the component is unmounted
    return () => {
      eventSource.close(); // Close the EventSource connection
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  useEffect(() => {
    async function fetchUserReports() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/auth/user-reports`);
        setUserReports(response.data);

        // Extract statuses from each report
        const newStatuses = response.data.map((report) => report.status);
        setStatuses(newStatuses); // Update statuses array

        //console.log("Fetched user reports:", response.data);
      } catch (error) {
        console.error("Error fetching user reports:", error);
      }
    }

    fetchUserReports();
  }, [statuses]);

  const updateAlerts = () => {
    const newAlerts = [];

    // Default empty arrays if props are undefined
    const tempArray = tempData || [];
    const tamperArray = tamperData || [];
    const fallArray = fallDetectData || [];
    const geofenceArray = luggageInfo || [];
    const userReportsStatus = userReports || [];

    userReportsStatus.forEach((report) => {
      if (report.status === "In Progress") {
        newAlerts.push({
          type: "Report Update",
          criticality: "In Progress",
          description: `Your report regarding ${report.title} has been received by Developers`,
          timestamp: new Date(report.updatedAt),
        });
      } else if (report.status === "Resolved") {
        newAlerts.push({
          type: "Report Update",
          criticality: "Resolved",
          description: `Your report regarding ${report.title} has been Resolved`,
          timestamp: new Date(report.updatedAt),
        });
      }
    });

    geofenceArray.forEach((luggage) => {
      if (luggage.status === "Out of Range") {
        newAlerts.push({
          type: "Out of Range",
          criticality: "Critical",
          description: `${luggage.luggage_custom_name} is outside the Geofence range `,
          timestamp: new Date(luggage.updatedAt),
        });
      } else if (luggage.status === "Out of Coverage") {
        newAlerts.push({
          type: "Out of Coverage",
          criticality: "Critical",
          description: `${luggage.luggage_custom_name} is Out of Coverage `,
          timestamp: new Date(luggage.updatedAt),
        });
      }
    });

    tempArray.forEach((temp) => {
      if (temp.temperature > 30) {
        newAlerts.push({
          type: "High Temperature",
          criticality: "Critical",
          description: `High temperature detected: ${temp.temperature}°C in ${temp.luggage_custom_name}`,
          timestamp: new Date(temp.timeStamp),
        });
      } else if (temp.temperature < 10) {
        newAlerts.push({
          type: "Low Temperature",
          criticality: "Warning",
          description: `Low temperature detected: ${temp.temperature}°C in ${temp.luggage_custom_name}`,
          timestamp: new Date(temp.timeStamp),
        });
      }
    });

    tamperArray.forEach((tamper) => {
      newAlerts.push({
        type: "Tamper Detected",
        criticality: "Critical",
        description: `Tamper detected in ${tamper.luggage_custom_name}`,
        timestamp: new Date(tamper.tamperTime),
      });
    });

    fallArray.forEach((fall) => {
      newAlerts.push({
        type: "Fall Detected",
        criticality: "Warning",
        description: `Fall detected in ${fall.luggage_custom_name}`,
        timestamp: new Date(fall.fall_time),
      });
    });

    return newAlerts;
  };

  useEffect(() => {
    const newAlerts = updateAlerts();

    // Check if there are new alerts or if statuses have changed
    const statusesChanged =
      JSON.stringify(prevStatusesRef.current) !== JSON.stringify(statuses);

    if (newAlerts.length > alerts.length || statusesChanged) {
      setAlerts(newAlerts);
      setHasNewAlerts(true); // Set to true when there are new alerts or statuses change
    } else {
      //setAlerts(newAlerts); // Just update alerts
      //setHasNewAlerts(false); // No new alerts
    }

    // Update the ref with current statuses
    prevStatusesRef.current = statuses;
  }, [tempData, tamperData, fallDetectData, statuses]);

  return (
    <UserNotifContext.Provider
      value={{
        luggageInfo,
        fallDetectData,
        tamperData,
        tempData,
        userReports,
        statuses,
        alerts,
        setAlerts,
        hasNewNotifs,
        setHasNewNotifs,
        hasNewAlerts,
        setHasNewAlerts,
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
