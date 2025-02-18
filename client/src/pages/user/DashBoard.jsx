import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
  FaThermometerHalf,
  FaShieldAlt,
  FaExclamationTriangle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import UserComboBox from "../../components/ComboBox";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ArcElement,
} from "chart.js";
import "chartjs-adapter-moment";
import { useUserNotif } from "../../context/UserNotifContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ArcElement
);

const DashBoard = () => {
  const [selectedLuggage, setSelectedLuggage] = useState("All");
  const { luggageInfo, tamperData, tempData, fallDetectData } = useUserNotif();

  // Makes the luggageInfo into array always
  const modifiedLuggageInfo = [
    { luggage_custom_name: "All", luggage_name: "All" },
    ...(Array.isArray(luggageInfo) ? luggageInfo : []),
  ];

  const totalFall =
    selectedLuggage === "All"
      ? fallDetectData.length === 0
        ? "-"
        : fallDetectData.length
      : fallDetectData.filter(
          (fall) => fall.luggage_custom_name === selectedLuggage
        ).length === 0
      ? "-"
      : fallDetectData.filter(
          (fall) => fall.luggage_custom_name === selectedLuggage
        ).length;

  const totalTamper =
    selectedLuggage === "All"
      ? tamperData.length === 0
        ? "-"
        : tamperData.length
      : tamperData.filter(
          (tamper) => tamper.luggage_custom_name === selectedLuggage
        ).length === 0
      ? "-"
      : tamperData.filter(
          (tamper) => tamper.luggage_custom_name === selectedLuggage
        ).length;

  const sumTemp = tempData.reduce((sum, data) => sum + data.temperature, 0);
  const avgTemp =
    tempData.length > 0 ? (sumTemp / tempData.length).toFixed(1) : "-";

  const filteredLogs =
    selectedLuggage === "All"
      ? []
      : tempData.filter((log) => log.luggage_custom_name === selectedLuggage);

  const latestTempLog =
    filteredLogs.length > 0
      ? filteredLogs.reduce((latest, log) => {
          return moment(log.timeStamp).isAfter(moment(latest.timeStamp))
            ? log
            : latest;
        })
      : null;

  const displayTemp =
    selectedLuggage === "All"
      ? avgTemp
      : latestTempLog && latestTempLog.temperature !== undefined
      ? latestTempLog.temperature
      : "-";

  const displayTempTime =
    selectedLuggage === "All"
      ? ""
      : latestTempLog
      ? latestTempLog.timeStamp
      : "";

  const displayStat =
    selectedLuggage === "All"
      ? "-"
      : luggageInfo?.find(
          (luggage) => luggage.luggage_custom_name === selectedLuggage
        )?.status || "-";

  const tempTitle =
    selectedLuggage === "All" ? "Average Temperature" : "Temperature";

  // Calculate average temperature per 10-minute interval for all luggage
  const calculateAverageTempPerTimestamp = (data) => {
    const tempMap = {};
    data.forEach((log) => {
      const timestamp = moment(log.timeStamp)
        .startOf("minute")
        .minute(Math.floor(moment(log.timeStamp).minute() / 10) * 10);
      const intervalLabel = timestamp.format("MMM DD, YYYY HH:mm");

      if (!tempMap[intervalLabel]) {
        tempMap[intervalLabel] = { sum: 0, count: 0 };
      }
      tempMap[intervalLabel].sum += log.temperature;
      tempMap[intervalLabel].count += 1;
    });

    return Object.keys(tempMap).map((timestamp) => ({
      timeStamp: timestamp,
      temperature: tempMap[timestamp].sum / tempMap[timestamp].count,
    }));
  };

  const filteredTempData =
    selectedLuggage === "All"
      ? calculateAverageTempPerTimestamp(tempData)
      : calculateAverageTempPerTimestamp(
          tempData.filter((log) => log.luggage_custom_name === selectedLuggage)
        );

  const labels = filteredTempData.map((log) => log.timeStamp);

  const tempChartData = {
    labels,
    datasets: [
      {
        label: "Temperature",
        data: filteredTempData.map((log) => log.temperature),
        fill: false,
        backgroundColor: "#5CC90C",
        borderColor: "#5CC90C",
      },
    ],
  };

  const tempChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Temperature Over Time",
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
          stepSize: 10,
          displayFormats: {
            minute: "hh:mm A",
          },
        },
        title: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
    },
  };

  // Doughnut chart for the Geofence Status
  const statusCounts = luggageInfo?.reduce((counts, luggage) => {
    if (luggage.luggage_custom_name !== "All") {
      counts[luggage.status] = (counts[luggage.status] || 0) + 1;
    }
    return counts;
  }, {});

  const geofenceStatusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#5CC90C", "#3B3F3F", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const geofenceStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Luggage Status Distribution",
      },
    },
  };

  const intrusionCounts = tamperData.reduce((counts, log) => {
    // Round down to the nearest 10 mins
    const tenMinuteInterval = moment(log.tamperTime)
      .startOf("minute")
      .minute(Math.floor(moment(log.tamperTime).minute() / 10) * 10);

    const intervalLabel = tenMinuteInterval.format("YYYY-MM-DD HH:mm");

    // ro separate the stacking every 10 mins
    counts[intervalLabel] = (counts[intervalLabel] || 0) + 1;

    return counts;
  }, {});

  const intrusionChartData = {
    labels: Object.keys(intrusionCounts).map((timeLabel) => moment(timeLabel)),
    datasets: [
      {
        label: "Intrusions",
        data: Object.values(intrusionCounts),
        backgroundColor: "#5CC90C",
      },
    ],
  };

  const intrusionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Intrusion Detection Timeline (10-Minute Intervals)",
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute", // Set to minute
          stepSize: 10, // Set step to 10 minutes
          displayFormats: {
            minute: "hh:mm A", // Format for 10-minute intervals
          },
        },
        title: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Intrusions",
        },
      },
    },
  };

  // Stack the fall data by counting occurrences within the same day
  const fallCounts = fallDetectData.reduce((counts, log) => {
    // Round down to the nearest 10 minutes
    const tenMinuteInterval = moment(log.fall_time)
      .startOf("minute")
      .minute(Math.floor(moment(log.fall_time).minute() / 10) * 10);
    const intervalLabel = tenMinuteInterval.format("MMM DD, YYYY HH:mm");

    counts[intervalLabel] = (counts[intervalLabel] || 0) + 1;
    return counts;
  }, {});

  const fallChartData = {
    labels: Object.keys(fallCounts),
    datasets: [
      {
        label: "Falls",
        data: Object.values(fallCounts),
        backgroundColor: "#5CC90C",
      },
    ],
  };

  const fallChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Fall History or Timeline (10-Minute Intervals)",
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute", // Set to minute
          stepSize: 10, // Set step to 10 minutes
          displayFormats: {
            minute: "hh:mm A", // Format for 10-minute intervals
          },
        },
        title: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Falls",
        },
      },
    },
  };

  return (
    <>
      <div className="p-6 h-full bg-gray-100 pb-24 md:pb-8">
        <div className="flex flex-row justify-between items-center text-center mb-4 ">
          <h3 className="text-2xl font-medium">Overview</h3>
          <div className="md:w-1/5 w-1/2 ">
            <UserComboBox
              options={modifiedLuggageInfo}
              value={selectedLuggage}
              onChange={setSelectedLuggage}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <FaMapMarkerAlt className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              <h2 className=" text-xl md:text-3xl font-bold">{displayStat}</h2>
              <p className="text-gray-600">Geofence Status</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <FaThermometerHalf className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              {/*<h2 className="text-3xl font-bold">{`-`}</h2>*/}
              <h2 className="text-3xl font-bold">{`${displayTemp}°C`}</h2>
              <p className="text-gray-600">{tempTitle}</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <FaShieldAlt className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              <h2 className="text-3xl font-bold">{totalTamper}</h2>
              <p className="text-gray-600">Possible Intrusions Detected</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <FaExclamationTriangle className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              <h2 className="text-3xl font-bold">{totalFall}</h2>
              <p className="text-gray-600">Falls Detected</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="card bg-white shadow-md p-4 rounded-lg h-96">
            <div className="card-body h-full">
              <h2 className="text-xl font-bold">Temperature over Time</h2>
              <div className="h-full">
                <Line
                  options={tempChartOptions}
                  data={tempChartData}
                  className="h-full"
                />
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg h-96">
            <div className="card-body h-full">
              <h2 className="text-xl font-bold">Luggage Geofence Status</h2>
              <div className="h-full">
                <Doughnut
                  options={geofenceStatusOptions}
                  data={geofenceStatusData}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="card bg-white shadow-md p-4 rounded-lg h-96">
            <div className="card-body">
              <h2 className="text-xl font-bold">
                Intrusion Detection Timeline
              </h2>
              <div className="h-full">
                <Bar
                  options={intrusionChartOptions}
                  data={intrusionChartData}
                />
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg h-96">
            <div className="card-body">
              <h2 className="text-xl font-bold">Fall History</h2>
              <div className="h-full">
                <Bar options={fallChartOptions} data={fallChartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
