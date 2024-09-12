import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/st_logo.svg";
import Profile from "../assets/sample_profile.jpg";
import {
  FaThermometerHalf,
  FaLock,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useLocation } from "../context/LocationContext";

const NavBar = ({ tempData, tamperData, fallDetectData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropProfile, setIsDropProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const { isLocationOn, toggleLocation } = useLocation();
  const navigate = useNavigate();

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case "High Temperature":
      case "Low Temperature":
        return <FaThermometerHalf className="text-primary text-2xl mr-2" />;
      case "Fall Detected":
        return <FaExclamationTriangle className="text-primary text-2xl mr-2" />;
      case "Tamper Detected":
        return <FaShieldAlt className="text-primary text-2xl mr-2" />;
      default:
        return <FaLock className="text-primary text-2xl mr-2" />;
    }
  };

  const getAlertColor = (alertType) => {
    switch (alertType) {
      case "High Temperature":
        return "badge-danger";
      case "Low Temperature":
        return "badge-warning";
      case "Fall Detected":
        return "badge-info";
      case "Tamper Detected":
        return "badge-danger";
      default:
        return "badge-primary";
    }
  };

  const renderNotifications = () => {
    const alerts = [];

    tempData?.forEach((temp) => {
      if (temp.temperature > 30) {
        alerts.push({
          type: "High Temperature",
          criticality: "Critical",
          description: `High temperature detected: ${temp.temperature}°C in ${temp.luggage_custom_name}`,
          timestamp: temp.timestamp,
        });
      } else if (temp.temperature < 10) {
        alerts.push({
          type: "Low Temperature",
          criticality: "Warning",
          description: `Low temperature detected: ${temp.temperature}°C in ${temp.luggage_custom_name}`,
          timestamp: temp.timestamp,
        });
      }
    });

    tamperData?.forEach((tamper) => {
      alerts.push({
        type: "Tamper Detected",
        criticality: "Critical",
        description: `Tamper detected in ${tamper.luggage_custom_name}`,
        timestamp: tamper.timestamp,
      });
    });

    fallDetectData?.forEach((fall) => {
      alerts.push({
        type: "Fall Detected",
        criticality: "Info",
        description: `Fall detected in ${fall.luggage_custom_name}`,
        timestamp: fall.timestamp,
      });
    });

    return alerts.map((alert, index) => (
      <div key={index} className="card w-full bg-base-100 shadow-xl mb-2">
        <div className="card-body flex items-start">
          <div className="mr-4">{getAlertIcon(alert.type)}</div>
          <div className="flex-1">
            <h4 className="card-title text-base flex items-center">
              {alert.type}
              <div
                className={`badge ${getAlertColor(alert.type)} text-xs ml-2`}
              >
                {alert.criticality}
              </div>
            </h4>
            <p className="text-xs">{alert.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogout = () => {
    axios
      .get(`${apiUrl}/auth/logout`)
      .then((res) => {
        if (res.data.status) {
          navigate("/sign-in");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleSideBar = () => setIsOpen(!isOpen);

  const handleDropProfile = () => setIsDropProfile(!isDropProfile);

  const handleLocationToggle = () => {
    // Invert the state using the toggleLocation function from context
    toggleLocation();

    if (navigator.geolocation) {
      if (!isLocationOn) {
        // If location is off, get the current position and save it
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // Update the user's location in the backend
            axios
              .post(`${apiUrl}/auth/update-location`, { latitude, longitude })
              .then((res) => {
                console.log("Location updated successfully:", res.data);
              })
              .catch((err) => {
                console.error("Error updating location:", err);
                // Revert the state if there's an error
                toggleLocation(); // This will revert the location state in context
              });
          },
          (error) => {
            console.error("Error getting location:", error);
            // Revert the state if there's an error
            toggleLocation(); // This will revert the location state in context
          }
        );
      } else {
        // If location is on, delete the location data
        axios
          .delete(`${apiUrl}/auth/delete-location`)
          .then((res) => {
            console.log("Location deleted successfully:", res.data);
          })
          .catch((err) => {
            console.error("Error deleting location:", err);
            toggleLocation(); // Revert the state if there's an error
          });
      }
    } else {
      console.error("Geolocation is not supported by this browser.");
      toggleLocation(); // Revert the state in context if Geolocation is not supported
    }
  };

  return (
    <>
      <div
        className="navbar fixed top-2 left-0 right-0 pr-3 pl-3 flex justify-evenly rounded-lg z-10 p-0 mx-auto shadow-md bg-[#020202a0] backdrop-blur-xl text-white"
        style={{ width: "98.90%" }}
      >
        <div className="sidebar fixed left-3 z-10 rounded-lg">
          <div className="navbar-start dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              onClick={toggleSideBar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            {isOpen && (
              <ul className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow rounded-lg w-52 bg-[#020202a0]">
                <li>
                  <Link
                    to="/user/"
                    className="link no-underline"
                    onClick={toggleSideBar}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/tracking"
                    className="link no-underline"
                    onClick={toggleSideBar}
                  >
                    Map
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/luggage"
                    className="link no-underline"
                    onClick={toggleSideBar}
                  >
                    My Luggage
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/profile"
                    className="link no-underline"
                    onClick={toggleSideBar}
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="navbar-center flex-1 justify-center">
          <div className="mr-0">
            <Link
              to="/user/"
              className="link btn btn-ghost text-sm md:text-xl no-underline flex items-center p-0"
            >
              <span>Luggage Live Tracking</span>
            </Link>
          </div>
          <div className="flex items-center ml-0">
            <span className="mx-1 text-xs">Powered by</span>
            <img src={Logo} alt="Secure Track" className="h-6" />
          </div>
        </div>

        <div className="">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setOpenNotif((prevState) => !prevState)}
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-2.486-1.176-4.675-3-6.32V4a3 3 0 10-6 0v.68C7.176 6.325 6 8.514 6 11v3.159c0 .538-.214 1.055-.595 1.437L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item">
                8
              </span>
            </div>
          </button>
          {openNotif && (
            <div className="fixed right-0 top-0 mt-16 mr-3 z-50 w-80 bg-[#202020e6] p-3 rounded-lg shadow-lg">
              {renderNotifications()}
            </div>
          )}
        </div>

        <div className="flex items-center">
          <label
            className="mr-2 md:mr-4 flex items-center cursor-pointer"
            title="Update Location"
          >
            <span className="mr-1 text-xs md:text-sm">Location:</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isLocationOn}
              onChange={handleLocationToggle}
            />
          </label>

          <div className="relative">
            <img
              src={Profile}
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={handleDropProfile}
            />
            {isDropProfile && (
              <div className="absolute right-0 mt-2 w-40 bg-[#202020e6] p-2 rounded-lg shadow-lg z-50">
                <ul className="menu menu-compact">
                  <li>
                    <Link
                      to="/user/profile"
                      className="link no-underline"
                      onClick={handleDropProfile}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="link no-underline"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
