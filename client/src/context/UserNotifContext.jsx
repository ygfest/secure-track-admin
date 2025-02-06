import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const UserNotifContext = createContext();

export const useUserNotif = () => useContext(UserNotifContext);

const createAlert = (type, criticality, description, timestamp) => ({
  type,
  criticality,
  description,
  timestamp: new Date(timestamp),
});

export const UserNotifProvider = ({ children }) => {
  const prevStatusesRef = useRef([]);
  const [luggageInfo, setLuggageInfo] = useState([]);
  const [fallDetectData, setFallDetectData] = useState([]);
  const [tamperData, setTamperData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [hasNewNotifs, setHasNewNotifs] = useState(false);
  const [hasNewAlerts, setHasNewAlerts] = useState(false);
  const [alerts, setAlerts] = useState(localStorage.getItem("alerts"));
  const [currentLink, setCurrentLink] = useState(
    localStorage.getItem("currentLink") || "/user/"
  );
  const [openNotif, setOpenNotif] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [statuses, setStatuses] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    localStorage.setItem("alerts", alerts);
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem("currentLink", currentLink);
  }, [currentLink]);

  useEffect(() => {
    const eventSource = new EventSource(
      `${apiUrl}/luggage-router/notifications`,
      {
        withCredentials: true,
      }
    );

    const reportsSource = new EventSource(`${apiUrl}/auth/user-reports`, {
      withCredentials: true,
    });

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      setTempData(data.tempLogs ?? []);
      setTamperData(data.tamperLogs ?? []);
      setFallDetectData(data.fallLogs ?? []);
      setLuggageInfo(data.luggageData ?? []);
    };

    reportsSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      setUserReports(data.reports);
      const newStatuses = data.reports.map((report) => report.status);
      setStatuses(newStatuses);
    };

    eventSource.onerror = reportsSource.onerror = function (error) {
      console.error("SSE error:", error);
    };

    return () => {
      eventSource.close();
      reportsSource.close();
    };
  }, []);

  const updateAlerts = () => {
    const newAlerts = [];

    tempData?.forEach((temp) => {
      if (temp.temperature > 30) {
        newAlerts.push(
          createAlert(
            "High Temperature",
            "Critical",
            `High temperature detected: ${temp.temperature}°C in ${temp.luggage_custom_name}`,
            temp.timeStamp
          )
        );
      } else if (temp.temperature < 10) {
        newAlerts.push(
          createAlert(
            "Low Temperature",
            "Warning",
            `Low temperature detected: ${temp.temperature}°C in ${temp.luggage_custom_name}`,
            temp.timeStamp
          )
        );
      }
    });

    tamperData?.forEach((tamper) => {
      newAlerts.push(
        createAlert(
          "Tamper Detected",
          "Critical",
          `Tamper detected in ${tamper.luggage_custom_name}`,
          tamper.tamperTime
        )
      );
    });

    fallDetectData?.forEach((fall) => {
      newAlerts.push(
        createAlert(
          "Fall Detected",
          "Warning",
          `Fall detected in ${fall.luggage_custom_name}`,
          fall.fall_time
        )
      );
    });

    luggageInfo?.forEach((luggage) => {
      if (luggage.status === "Out of Range") {
        newAlerts.push(
          createAlert(
            "Out of Range",
            "Critical",
            `${luggage.luggage_custom_name} is outside the Geofence range`,
            luggage.updatedAt
          )
        );
      } else if (luggage.status === "Out of Coverage") {
        newAlerts.push(
          createAlert(
            "Out of Coverage",
            "Critical",
            `${luggage.luggage_custom_name} is Out of Coverage`,
            luggage.updatedAt
          )
        );
      }
    });

    userReports?.forEach((report) => {
      if (report.status === "In Progress") {
        newAlerts.push(
          createAlert(
            "Report Update",
            "In Progress",
            `Your report regarding ${report.title} has been received by Developers`,
            report.updatedAt
          )
        );
      } else if (report.status === "Resolved") {
        newAlerts.push(
          createAlert(
            "Report Update",
            "Resolved",
            `Your report regarding ${report.title} has been Resolved`,
            report.updatedAt
          )
        );
      }
    });

    return newAlerts;
  };

  useEffect(() => {
    const newAlerts = updateAlerts();

    const statusesChanged =
      JSON.stringify(prevStatusesRef.current) !== JSON.stringify(statuses);

    if (newAlerts.length > alerts.length || statusesChanged) {
      setAlerts(newAlerts);
      setHasNewAlerts(true);
    }

    prevStatusesRef.current = statuses;
  }, [tempData, tamperData, fallDetectData, statuses]);

  return (
    <UserNotifContext.Provider
      value={{
        luggageInfo,
        setLuggageInfo,
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
