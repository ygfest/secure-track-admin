import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserComboBox from "../components/ComboBox";

const DashBoard = () => {
  const navigate = useNavigate();
  const [luggageInfo, setLuggageInfo] = useState([]);
  const [fallDetectData, setFallDetectData] = useState([]);
  const [tamperData, setTamperData] = useState([]);
  const [selectedLuggage, setSelectedLuggage] = useState("All");
  const [tokenExpired, setTokenExpired] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/verify");
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
        const response = await fetch(
          "http://localhost:3000/luggage-router/fall-logs"
        );
        const dataJson = await response.json();
        setFallDetectData(dataJson);
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
          (fall) => fall.luggage_tag_number === selectedLuggage
        ).length;

  useEffect(() => {
    async function fetchTamperLogs() {
      try {
        const response = await fetch(
          "http://localhost:3000/luggage-router/tamper-logs"
        );
        const responseJson = await response.json();
        setTamperData(responseJson);
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
          (tamper) => tamper.luggage_tag_number === selectedLuggage
        ).length;

  useEffect(() => {
    async function fetchLuggageInfo() {
      try {
        const response = await fetch(
          "http://localhost:3000/luggage-router/luggage"
        );
        const responseJson = await response.json();
        setLuggageInfo([
          { luggage_tag_number: "All", luggage_name: "All" },
          ...responseJson,
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
          (luggage) => luggage.luggage_tag_number === selectedLuggage
        )?.status || "-";

  return (
    <>
      <NavigationBar />
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
          <div className="card bg-white shadow-md p-4 rounded-lg">
            <div className="card-body">
              <h2 className="text-3xl font-bold">{displayStat}</h2>
              <p className="text-gray-600">Luggage Status</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg">
            <div className="card-body">
              <h2 className="text-3xl font-bold">{0}</h2>
              <p className="text-gray-600">Meters from You</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg">
            <div className="card-body">
              <h2 className="text-3xl font-bold">{totalTamper}</h2>
              <p className="text-gray-600">Possible Intrusions Detected</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg">
            <div className="card-body">
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
