import axios from "axios";
import React, { useState, useEffect } from "react";
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
  const [adminProfileDp, setAdminProfileDp] = useState("");
  const [adminProfile, setAdminProfile] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/auth/verify`, {
          withCredentials: true,
        });
        if (!response.data.status) {
          navigate("/sign-in");
        } else {
          setAdminProfile(response.data.user.firstname);
          setAdminProfileDp(response.data.user.profile_dp);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    };
    verifyToken();
  }, [navigate]);

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

  // Manage location update interval
  useEffect(() => {
    let locationInterval = null;

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            axios
              .post(`${apiUrl}/auth/update-location`, { latitude, longitude })
              .then((res) => {
                console.log("Location updated successfully:", res.data);
              })
              .catch((err) => {
                console.error("Error updating location:", err);
              });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    if (isLocationOn) {
      updateLocation(); // Initial location update
      locationInterval = setInterval(updateLocation, 60000); // Update every minute
    } else if (locationInterval) {
      clearInterval(locationInterval);
      locationInterval = null;
    }

    return () => {
      if (locationInterval) {
        clearInterval(locationInterval);
      }
    };
  }, [isLocationOn]);

  const handleLocationToggle = () => {
    toggleLocation();
  };

  return (
    <div
      className="navbar fixed top-2 left-0 right-0 px-3 flex justify-between rounded-lg z-10 p-0 mx-auto shadow-md bg-[#020202a0] backdrop-blur-xl text-white"
      style={{ width: "98.90%" }}
    >
      {/* Left: Burger Menu */}
      <div className="navbar-start">
        <div className="dropdown">
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
            <ul className="menu dropdown-content mt-3 p-2 shadow rounded-lg w-52 bg-[#020202a0]">
              <li>
                <Link
                  to="/admin/"
                  className="link no-underline"
                  onClick={toggleSideBar}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/tracking"
                  className="link no-underline"
                  onClick={toggleSideBar}
                >
                  Map
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/luggage"
                  className="link no-underline"
                  onClick={toggleSideBar}
                >
                  Luggage Management
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/user-management"
                  className="link no-underline"
                  onClick={toggleSideBar}
                >
                  Users Management
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/profile"
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

      {/* Center: Logo */}
      <div className="navbar-center flex items-center justify-center">
        <Link
          to="/user/"
          className="link btn btn-ghost text-sm md:text-xl no-underline flex items-center p-0"
        >
          <span className="text-sm">Powered by </span>
          <img src={Logo} alt="Secure Track" className="h-8" />
        </Link>
      </div>

      {/* Right: Location, Notification, Profile */}
      <div className="navbar-end flex items-center space-x-4">
        <label
          className="flex items-center cursor-pointer"
          title="Update Location"
        >
          <span className="text-xs md:text-sm">Location:</span>
          <input
            type="checkbox"
            className="toggle toggle-primary ml-1"
            checked={isLocationOn}
            onChange={handleLocationToggle}
          />
        </label>

        {/* Notification Icon */}
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => setOpenNotif(!openNotif)}
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-2.486-1.176-4.675-3-6.32V4a3 3 0 00-6 0v.68C7.176 6.325 6 8.514 6 11v3.159c0 .538-.214 1.055-.595 1.437L4 17h5m0 0v1a3 3 0 006 0v-1m-6 0h6"
              />
            </svg>
            {(tempData?.length ||
              tamperData?.length ||
              fallDetectData?.length) && (
              <span className="badge badge-xs badge-primary indicator-item"></span>
            )}
          </div>
        </button>
        {/* Notifications Popup */}
        {openNotif && (
          <div className="absolute top-16 right-3 p-3 rounded-md shadow-md bg-[#020202a0] w-80">
            <h3 className="font-bold text-lg mb-3">Notifications</h3>
            {renderNotifications()}
          </div>
        )}

        {/* Profile Icon */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
            onClick={handleDropProfile}
          >
            {adminProfileDp ? (
              <div className="w-10 rounded-full">
                <img src={adminProfileDp} alt="Profile" />
              </div>
            ) : (
              <div className="w-12 rounded-full bg-zinc-400 text-white text-large">
                {adminProfile && adminProfile.charAt(0).toUpperCase()}
              </div>
            )}
          </label>
          {isDropProfile && (
            <ul className="menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-[#020202a0]">
              <li>
                <Link
                  to="/admin/profile"
                  className="justify-between"
                  onClick={handleDropProfile}
                >
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
