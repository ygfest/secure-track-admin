import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaThermometerHalf,
  FaLock,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import NavigationBar from "./NavigationBar";
import NavBar from "./NavBar";
import UserComboBox from "../components/ComboBox";

const DashBoard = () => {
  const navigate = useNavigate();
  const [luggageInfo, setLuggageInfo] = useState([]);
  const [fallDetectData, setFallDetectData] = useState([]);
  const [tamperData, setTamperData] = useState([]);
  const [selectedLuggage, setSelectedLuggage] = useState("All");
  const [isNavBarVis, setIsNavBarVis] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");
  const [tempData, setTempData] = useState([]);

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/verify");
        console.log("Verify token response:", response.data);
        if (!response.data.status) {
          navigate("/user/");
        } else {
          setUserFirstName(
            `${response.data.user.firstname} ${response.data.user.lastname} `
          );
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        navigate("/sign-in");
        setTokenExpired(true);
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    async function fetchFallData() {
      try {
        const response = await axios.get(
          "http://localhost:3000/luggage-router/fall-logs2"
        );
        setFallDetectData(response.data);
      } catch (error) {
        console.log("Error fetching fall data");
      }
    }

    fetchFallData();
  }, []);

  const totalFall =
    selectedLuggage === "All"
      ? fallDetectData.length
      : fallDetectData.filter(
          (fall) => fall.luggage_custom_name === selectedLuggage
        ).length;

  useEffect(() => {
    async function fetchTamperLogs() {
      try {
        const response = await axios.get(
          "http://localhost:3000/luggage-router/tamper-logs2"
        );
        setTamperData(response.data);
      } catch (error) {
        console.log("error fetching tamper logs", error);
      }
    }
    fetchTamperLogs();
  }, []);

  const totalTamper =
    selectedLuggage === "All"
      ? tamperData.length
      : tamperData.filter(
          (tamper) => tamper.luggage_custom_name === selectedLuggage
        ).length;

  useEffect(() => {
    async function fetchTempLogs() {
      try {
        const response = await axios.get(
          "http://localhost:3000/luggage-router/temp-logs"
        );
        setTempData(response.data);
      } catch (error) {
        console.log("Error fetching temp logs", error);
      }
    }
    fetchTempLogs();
  }, []);

  const sumTemp = tempData.reduce((sum, data) => sum + data.temperature, 0);
  const avgTemp =
    tempData.length > 0 ? (sumTemp / tempData.length).toFixed(1) : 0;

  const displayTemp =
    selectedLuggage === "All"
      ? avgTemp
      : tempData.find((log) => log.luggage_custom_name === selectedLuggage)
          ?.temperature || 0;
  console.log(tempData.luggage_custom_name);

  useEffect(() => {
    async function fetchLuggageInfo() {
      try {
        const response = await axios.get(
          "http://localhost:3000/luggage-router/luggage"
        );
        setLuggageInfo([
          { luggage_custom_name: "All", luggage_name: "All" },
          ...response.data,
        ]);
      } catch (error) {
        console.log("error fetching luggage info", error);
      }
    }
    fetchLuggageInfo();
  }, []);

  const displayStat =
    selectedLuggage === "All"
      ? "-"
      : luggageInfo.find(
          (luggage) => luggage.luggage_custom_name === selectedLuggage
        )?.status || "-";

  const tempTitle =
    selectedLuggage === "All" ? "Average Temperature" : "Temperature";

  return (
    <>
      <NavigationBar
        luggageInfo={luggageInfo}
        tempData={tempData}
        tamperData={tamperData}
        fallDetectData={fallDetectData}
      />

      <div className="p-6">
        <div className="flex flex-row justify-between items-center text-center mb-4">
          <h3 className="text-2xl font-medium">Welcome {userFirstName}</h3>
          <div className="md:w-1/5 w-1/2 ">
            <UserComboBox
              options={luggageInfo}
              value={selectedLuggage}
              onChange={setSelectedLuggage}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <FaLock className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
              <h2 className="text-3xl font-bold">{displayStat}</h2>
              <p className="text-gray-600">Status</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
            <FaThermometerHalf className="text-primary text-4xl mb-2" />
            <div className="card-body text-center">
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
            <div className="card-body">
              <h2 className="text-xl font-bold">Temperature Line Graph</h2>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg h-96">
            <div className="card-body">
              <h2 className="text-xl font-bold">Luggage Status Pie Chart</h2>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="card bg-white shadow-md p-4 rounded-lg h-96">
            <div className="card-body">
              <h2 className="text-xl font-bold">
                Intrusion Detection Timeline
              </h2>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg h-96">
            <div className="card-body">
              <h2 className="text-xl font-bold">Fall History or Timeline</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
