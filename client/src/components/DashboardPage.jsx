import React, { useState, useEffect } from "react";
import "../App.css";
import data from "../Data";
import NavigationBar from "./NavigationBar";

const DashboardPage = () => {
  const [cargoItems, setCargoItems] = useState([]);
  const h1Style = {
    fontSize: "24px",
    lineHeight: "1.5",
    padding: "100px",
  };

  useEffect(() => {
    async function fetchCargoInfo() {
      try {
        const response = await fetch("http://localhost:3000/strack");
        const dataJson = await response.json();
        setCargoItems(dataJson);
      } catch (error) {
        console.log("error fetching cargo info");
      }
    }

    fetchCargoInfo();
  }, []); // Empty dependency array means it will run only once when the component mounts

  const cargoNum = cargoItems.length;
  const activeShips = cargoItems.filter(
    (item) =>
      item.shipment_status === "In Transit" ||
      item.shipment_status === "Scheduled"
  ).length;

  const completedShips = cargoItems.filter(
    (item) => item.shipment_status === "Delivered"
  ).length;

  return (
    <>
      <NavigationBar />

      <div className="pt-3 pl-5 pr-5">
        <h3 className="text-lg font-medium pb-3">Overview</h3>
        <div className="flex justify-between">
          <div
            className="card  bg-base-100 shadow-xs bordered text-black text-lg rounded-lg"
            style={{ width: "23%", height: "30%" }}
          >
            <div className="card-body">
              <h2 className="card-title">{cargoNum}</h2>
              <p>Total Cargo Items</p>
              <div className="card-actions justify-end"></div>
            </div>
          </div>

          <div
            className="card  bg-base-100 shadow-xs bordered text-black text-lg rounded-lg"
            style={{ width: "23%", maxHeight: "30%" }}
          >
            <div className="card-body">
              <h2 className="card-title">{activeShips}</h2>
              <p>Active Shipments</p>
              <div className="card-actions justify-end"></div>
            </div>
          </div>
          <div
            className="card  bg-base-100 shadow-xs bordered text-black text-lg rounded-lg"
            style={{ width: "23%", maxHeight: "30%" }}
          >
            <div className="card-body">
              <h2 className="card-title">{completedShips}</h2>
              <p>Completed Shipments</p>
              <div className="card-actions justify-end"></div>
            </div>
          </div>
          <div
            className="card  bg-base-100 shadow-xs bordered text-black text-lg rounded-lg"
            style={{ width: "23%", maxHeight: "30%" }}
          >
            <div className="card-body">
              <h2 className="card-title">{3}</h2>
              <p>Reports</p>
              <div className="card-actions justify-end"></div>
            </div>
          </div>
        </div>

        <div
          className="card bg-base-100 shadow-xs rounded-lg text-black text-lg mt-4 bordered"
          style={{ height: "400px" }}
        >
          <div className="card-body">
            <h2 className="card-title">Cargo Volume Over Time</h2>
          </div>
        </div>
        <div
          className="card bg-base-100 shadow-xs rounded-lg text-black text-lg mt-4 bordered"
          style={{ height: "400px" }}
        >
          <div className="card-body">
            <h2 className="card-title">Destination Distribution</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
