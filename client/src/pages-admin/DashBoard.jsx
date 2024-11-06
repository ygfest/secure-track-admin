import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import {
  FaMapMarkerAlt,
  FaThermometerHalf,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { BsLuggage } from "react-icons/bs";
import { TbDeviceSpeakerOff } from "react-icons/tb";
import { TbDevicesX } from "react-icons/tb";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const DashBoard = () => {
  const [userData, setUserData] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [luggageInfo, setLuggageInfo] = useState([]);

  useEffect(() => {
    // Fetch users data
    const fetchUsersData = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.get(`${apiUrl}/auth/users`);
      setUserData(res.data);
    };
    fetchUsersData();

    // Fetch reports data
    const fetchReportsData = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.get(`${apiUrl}/auth/reports`);
      setReportsData(res.data);
    };
    fetchReportsData();

    // Fetch luggage info (if needed)
    const fetchLuggageInfo = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.get(`${apiUrl}/luggage-router/luggage-admin`);
      setLuggageInfo(res.data);
    };
    fetchLuggageInfo();
  }, []);

  // Sample Data Aggregation
  const numOfUsers = userData.length;
  const numOfLuggage = luggageInfo.length;
  const deviceReports = reportsData.filter(
    (report) => report.type === "device-anomaly"
  ).length;
  const softwareReports = reportsData.filter(
    (report) => report.type === "software-anomaly"
  ).length;

  // User Activity Bar Chart
  const activeUsers = userData.filter(
    (user) => user.status === "Active"
  ).length;
  const inactiveUsers = userData.filter(
    (user) => user.status === "Inactive"
  ).length;
  const offlineUsers = userData.filter(
    (user) => user.status === "Offline"
  ).length;

  const userActChartData = {
    labels: ["Active", "Inactive", "Offline"],
    datasets: [
      {
        label: "User Activity",
        data: [activeUsers, inactiveUsers, offlineUsers],
        backgroundColor: [
          "#5CC90C", // Primary color for Active
          "#3B3F3F", // Secondary color for Inactive
          "#A9D18B", // Accent color for Offline
        ],
      },
    ],
  };

  const userActChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Users' Activity",
      },
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.raw} users`;
          },
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        left: 5,
        right: 5,
        bottom: 10,
      },
    },
  };

  // Issues and Reports Pie Chart
  const deviceAnomalies = reportsData.filter(
    (report) => report.type === "device-anomaly"
  ).length;
  const softwareAnomalies = reportsData.filter(
    (report) => report.type === "software-anomaly"
  ).length;

  const geofenceStatusData = {
    labels: ["Device Anomalies", "Software Anomalies"],
    datasets: [
      {
        data: [deviceAnomalies, softwareAnomalies],
        backgroundColor: ["#5CC90C", "#3B3F3F"], // Using primary and accent colors
      },
    ],
  };

  const geofenceStatusOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Issues and Reports",
      },
    },
  };

  // Device Anomalies Pie Chart
  const resolvedDeviceAnomalies = reportsData.filter(
    (report) => report.type === "device-anomaly" && report.status === "Resolved"
  ).length;
  const inProgressDeviceAnomalies = reportsData.filter(
    (report) =>
      report.type === "device-anomaly" && report.status === "In Progress"
  ).length;
  const pendingDeviceAnomalies = reportsData.filter(
    (report) => report.type === "device-anomaly" && report.status === "Pending"
  ).length;

  const intrusionChartData = {
    labels: ["Resolved", "In Progress", "Pending"],
    datasets: [
      {
        data: [
          resolvedDeviceAnomalies,
          inProgressDeviceAnomalies,
          pendingDeviceAnomalies,
        ],
        backgroundColor: ["#5CC90C", "#A9D18B", "#3B3F3F"], // Matching app theme colors
      },
    ],
  };

  const intrusionChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Device Anomalies Status",
      },
    },
  };

  // Software Anomalies Pie Chart
  const resolvedSoftwareAnomalies = reportsData.filter(
    (report) =>
      report.type === "software-anomaly" && report.status === "Resolved"
  ).length;
  const inProgressSoftwareAnomalies = reportsData.filter(
    (report) =>
      report.type === "software-anomaly" && report.status === "In Progress"
  ).length;
  const pendingSoftwareAnomalies = reportsData.filter(
    (report) =>
      report.type === "software-anomaly" && report.status === "Pending"
  ).length;

  const fallChartData = {
    labels: ["Resolved", "In Progress", "Pending"],
    datasets: [
      {
        data: [
          resolvedSoftwareAnomalies,
          inProgressSoftwareAnomalies,
          pendingSoftwareAnomalies,
        ],
        backgroundColor: ["#5CC90C", "#3B3F3F", "#A9D18B"], // Matching app theme colors
      },
    ],
  };

  const fallChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Software Anomalies Status",
      },
    },
  };

  return (
    <>
      <div className="p-6 h-full bg-gray-100">
        <div className="flex flex-row justify-between items-center text-center mb-4">
          <h3 className="text-2xl font-medium">Overview</h3>
          <div className="md:w-1/5 w-1/2 "></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <LuUsers className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              <h2 className="text-3xl font-bold">{numOfUsers}</h2>
              <p className="text-gray-600">Registered Users</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <BsLuggage className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              <h2 className="text-3xl font-bold">{numOfLuggage}</h2>
              <p className="text-gray-600">Luggage Registered</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <TbDeviceSpeakerOff className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              <h2 className="text-3xl font-bold">{deviceReports}</h2>
              <p className="text-gray-600">Device Anomalies</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <TbDevicesX className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              <h2 className="text-3xl font-bold">{softwareReports}</h2>
              <p className="text-gray-600">Software Reports</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* User Activity Bar Chart */}
          <div className="card bg-white shadow-md p-4 rounded-lg h-96">
            <div className="card-body h-full">
              <h2 className="text-xl font-bold">Users Activity</h2>
              <div className="relative h-full w-full">
                <Bar data={userActChartData} options={userActChartOptions} />
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-md p-4 rounded-lg h-96">
            <div className="card-body h-full">
              <h2 className="text-xl font-bold">Issues and Reports</h2>
              <div className="h-full flex justify-center items-center">
                <Doughnut
                  options={geofenceStatusOptions}
                  data={geofenceStatusData}
                />
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-md p-4 rounded-lg h-96">
            <div className="card-body h-full">
              <h2 className="text-xl font-bold">Device Anomalies Status</h2>
              <div className="h-full flex justify-center items-center">
                <Doughnut
                  options={intrusionChartOptions}
                  data={intrusionChartData}
                />
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-md p-4 rounded-lg h-96">
            <div className="card-body h-full">
              <h2 className="text-xl font-bold">Software Anomalies Status</h2>
              <div className="h-full flex justify-center items-center">
                <Doughnut options={fallChartOptions} data={fallChartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
