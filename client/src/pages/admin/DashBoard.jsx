import { Link } from "react-router-dom";
import { Doughnut, Bar } from "react-chartjs-2";
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
import { LuUsers } from "react-icons/lu";
import { BsLuggage } from "react-icons/bs";
import { TbDeviceSpeakerOff } from "react-icons/tb";
import { TbDevicesX } from "react-icons/tb";
import { useAdminDataContext } from "../../context/AdminDataContext";

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
  const { usersData, reportsData, luggageData, setCurrentLink } =
    useAdminDataContext();

  //default or empty data
  const numOfUsers = usersData.length === 0 ? "-" : usersData.length;
  const numOfLuggage = luggageData.length === 0 ? "-" : luggageData.length;
  const deviceReports =
    reportsData.filter((report) => report.type === "device-anomaly").length ===
    0
      ? "-"
      : reportsData.filter((report) => report.type === "device-anomaly").length;
  const softwareReports =
    reportsData.filter((report) => report.type === "software-anomaly")
      .length === 0
      ? "-"
      : reportsData.filter((report) => report.type === "software-anomaly")
          .length;

  //Bar Chart for User status/activity
  const activeUsers = usersData.filter(
    (user) => user.status === "Active"
  ).length;
  const inactiveUsers = usersData.filter(
    (user) => user.status === "Inactive"
  ).length;
  const offlineUsers = usersData.filter(
    (user) => user.status === "Offline"
  ).length;

  const userActChartData = {
    labels: ["Active", "Inactive", "Offline"],
    datasets: [
      {
        label: "User Activity",
        data: [activeUsers, inactiveUsers, offlineUsers],
        backgroundColor: [
          "#5CC90C", // Active
          "#3B3F3F", // Inactive
          "#A9D18B", // Offline
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
        backgroundColor: ["#5CC90C", "#3B3F3F"],
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
    <div className="p-6 h-full bg-gray-100">
      <div className="flex flex-row justify-between items-center text-center mb-4">
        <h3 className="text-2xl font-medium">Overview</h3>
        <div className="md:w-1/5 w-1/2 "></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/user-management "
          onClick={() => setCurrentLink("/admin/user-management")}
        >
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <LuUsers className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              <h2 className="text-3xl font-bold">{numOfUsers}</h2>
              <p className="text-gray-600">Registered Users</p>
            </div>
          </div>
        </Link>
        <Link
          to="/admin/luggage"
          onClick={() => setCurrentLink("/admin/luggage")}
        >
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <BsLuggage className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              <h2 className="text-3xl font-bold">{numOfLuggage}</h2>
              <p className="text-gray-600">Luggage Registered</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/reports"
          onClick={() => setCurrentLink("/admin/reports")}
        >
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <TbDeviceSpeakerOff className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              <h2 className="text-3xl font-bold">{deviceReports}</h2>
              <p className="text-gray-600">Device Anomalies</p>
            </div>
          </div>
        </Link>
        <Link
          to="/admin/reports"
          onClick={() => setCurrentLink("/admin/reports")}
        >
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <TbDevicesX className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              <h2 className="text-3xl font-bold">{softwareReports}</h2>
              <p className="text-gray-600">Software Reports</p>
            </div>
          </div>
        </Link>
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
  );
};

export default DashBoard;
