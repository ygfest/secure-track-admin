import React, { useState, useEffect } from "react";
import "../App.css"; // Assuming you still need some global styles
import NavigationBar from "../components/NavigationBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const navigate = useNavigate();
  const [luggageInfo, setLuggageInfo] = useState([]);
  const [fallDetectData, setFallDetectData] = useState([]);
  const [intrusionData, setIntrusionData] = useState([]);
  const [tempLog, setTempLog] = useState([]);

  useEffect(() => {
    const fetchFallData = async () => {
      try {
        const response = await fetch("http://localhost:3000/luggage-fall");
        const dataJson = await response.json();
        setFallDetectData(dataJson);
      } catch (error) {
        console.error("Error fetching fall data:", error);
      }
    };

    fetchFallData();
  }, []);

  const fallsDetected = () => fallDetectData.length;
  const numFalls = fallsDetected();

  useEffect(() => {
    async function fetchLuggageTemp() {
      try {
        const response = await fetch("http://localhost:3000/luggage-temp");
        const responseJson = await response.json(response);
        setTemplog(responseJson);
      } catch (error) {
        console.log("error fetching temp log");
      }
    }

    fetchLuggageTemp();
  }, []);

  const calculateAverageTemperature = () => {
    const sumOfTemperatures = tempLog.reduce(
      (total, temp) => total + temp.temperature,
      0
    );
    return tempLog.length > 0 ? sumOfTemperatures / tempLog.length : 0;
  };

  const avgTemp = calculateAverageTemperature();

  useEffect(() => {
    async function fetchIntrusionsData() {
      try {
        const response = await fetch("http://localhost:3000/luggage-intrusion");
        const responseJson = await response.json(response);
        setIntrusionData(responseJson);
      } catch (error) {
        console.log("error fetching intrusions data");
      }
    }
    fetchIntrusionsData();
  }, []);

  const countIntrusions = () => intrusionData.length;
  const totalIntrusions = countIntrusions();

  useEffect(() => {
    async function fetchLuggageInfo() {
      try {
        const response = await fetch("http://localhost:3000/luggage");
        const dataJson = await response.json();
        setLuggageInfo(dataJson);
      } catch (error) {
        console.log("error fetching cargo info");
      }
    }

    fetchLuggageInfo();
  }, []);

  {
    /*const activeShips = cargoItems.filter(
    (item) =>
      item.shipment_status === "In Transit" ||
      item.shipment_status === "Scheduled"
  ).length;

  const completedShips = cargoItems.filter(
    (item) => item.shipment_status === "Delivered"
  ).length;
*/
  }

  return (
    <>
      <NavigationBar />
      <div className="p-6">
        <div className="flex flex-row justify-between">
          <h3 className="text-2xl font-medium mb-4">Overview</h3>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label"></div>
              <input
                type="text"
                placeholder="Enter Tracking Number here"
                className="input input-bordered w-full max-w-3xl"
              />
              <div className="label"></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-white shadow-md p-4 rounded-lg">
            <div className="card-body">
              <h2 className="text-3xl font-bold">{0}</h2>
              <p className="text-gray-600">Luggage Status</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg">
            <div className="card-body">
              <h2 className="text-3xl font-bold">{totalIntrusions}</h2>
              <p className="text-gray-600">Intrusion Detections</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg">
            <div className="card-body">
              <h2 className="text-3xl font-bold">{numFalls}</h2>
              <p className="text-gray-600">Falls Detected</p>
            </div>
          </div>
          <div className="card bg-white shadow-md p-4 rounded-lg">
            <div className="card-body">
              <h2 className="text-3xl font-bold">{avgTemp}</h2>
              <p className="text-gray-600">Average Temperature</p>
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
