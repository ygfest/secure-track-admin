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
import { parse, format } from "date-fns";

const formatDate = (dateObj) => {
  return format(dateObj, "MM/dd/yyyy, HH:mm:ss");
};

const NavigationBar = ({
  luggageInfo,
  tempData,
  tamperData,
  fallDetectData,
  userFirstName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [profileDp, setProfileDp] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [isSeenNotifications, setIsSeenNotifications] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const navigate = useNavigate();

  const toggleSideBar = () => setIsOpen(!isOpen);
  const toggleProfile = () => {
    setIsOpenProfile(!isOpenProfile);
    setOpenNotif(false);
  };

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/auth/verify`, {
          withCredentials: true,
        });

        console.log("Verify token response:", response.data);

        if (!response.data.status) {
          navigate("/sign-in");
        } else {
          setProfileDp(response.data.user.profile_dp);
          setProfileName(response.data.user.firstname);
          setProfileLastName(response.data.user.lastname);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        navigate("/sign-in");
      }
    };

    verifyToken();
  }, [navigate]);

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

  const updateAlerts = () => {
    const newAlerts = [];

    // Default empty arrays if props are undefined
    const tempArray = tempData || [];
    const tamperArray = tamperData || [];
    const fallArray = fallDetectData || [];

    tempArray.forEach((temp) => {
      if (temp.temperature > 30) {
        newAlerts.push({
          type: "High Temperature",
          criticality: "Critical",
          description: `High temperature detected: ${temp.temperature}°C in ${temp.luggage_custom_name}`,
          timestamp: new Date(temp.timestamp),
        });
      } else if (temp.temperature < 10) {
        newAlerts.push({
          type: "Low Temperature",
          criticality: "Warning",
          description: `Low temperature detected: ${temp.temperature}°C in ${temp.luggage_custom_name}`,
          timestamp: new Date(temp.timestamp),
        });
      }
    });

    tamperArray.forEach((tamper) => {
      newAlerts.push({
        type: "Tamper Detected",
        criticality: "Critical",
        description: `Tamper detected in ${tamper.luggage_custom_name}`,
        timestamp: new Date(tamper.timestamp),
      });
    });

    fallArray.forEach((fall) => {
      newAlerts.push({
        type: "Fall Detected",
        criticality: "Info",
        description: `Fall detected in ${fall.luggage_custom_name}`,
        timestamp: new Date(fall.fall_time),
      });
    });

    return newAlerts;
  };

  useEffect(() => {
    const newAlerts = updateAlerts();

    // Check if there are new alerts
    if (newAlerts.length > alerts.length) {
      setAlerts(newAlerts);
      //setOpenNotif(true); // Open notifications panel when new alerts arrive
      setIsSeenNotifications(false);
    } else {
      setAlerts(newAlerts); // Just update alerts
    }
  }, [tempData, tamperData, fallDetectData]); // Runs when tempData, tamperData, or fallDetectData change

  const renderNotifications = () => {
    return alerts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by timestamp descending
      .map((alert, index) => (
        <div key={index} className="card w-full bg-[#f2f5f8] shadow-xl mb-2">
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
                {formatDate(alert.timestamp)}
              </p>
            </div>
          </div>
        </div>
      ));
  };

  const handleNotifClick = () => {
    setOpenNotif(!openNotif);
    setIsSeenNotifications(true); // Mark notifications as seen
  };

  return (
    <>
      <div className="navbar-container bg-base-100 h-16 z-10 shadow-sm relative bordered">
        <div className="navbar bg-base-100 h-16 fixed">
          <div className="flex-none">
            <button
              className="btn btn-square btn-ghost"
              onClick={toggleSideBar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost text-md text-black">
              <img src={Logo} alt="AirAsia Logo" className="h-9 w-auto" />
            </a>
          </div>
          <div className="flex-none gap-2">
            <button
              className="btn btn-ghost btn-circle"
              onClick={handleNotifClick}
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {!isSeenNotifications && (
                  <span className="badge badge-xs badge-primary indicator-item"></span>
                )}
              </div>
            </button>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                onClick={toggleProfile}
              >
                {profileDp ? (
                  <div className="w-10 rounded-full">
                    <img alt="Profile" src={profileDp} />
                  </div>
                ) : (
                  <div className="w-14 pt-1 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl border-4 border-white">
                    {profileName && profileName.charAt(0).toUpperCase()}
                    {profileLastName && profileLastName.charAt(0)}
                  </div>
                )}
              </div>
              {isOpenProfile && (
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link to="/user/profile">
                      <a className="justify-between">
                        Profile
                        <span className="badge">New</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/profile/edit">Settings</Link>
                  </li>
                  <li>
                    <a onClick={() => setShowLogoutConfirmation(true)}>
                      Logout
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
        <div
          className={`sidebar bg-white h-screen w-64 fixed left-0 top-0 shadow-lg ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <ul className="mt-6">
            <li>
              <Link
                to="/user/"
                className="block p-4 text-[#3B3F3F] hover:bg-[#5CC90C] hover:text-white"
                onClick={toggleSideBar}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/user/tracking"
                className="block p-4 text-[#3B3F3F] hover:bg-[#5CC90C] hover:text-white"
                onClick={toggleSideBar}
              >
                Live Tracking
              </Link>
            </li>
            <li>
              <Link
                to="/user/luggage"
                className="block p-4 text-[#3B3F3F] hover:bg-[#5CC90C] hover:text-white"
                onClick={toggleSideBar}
              >
                My Luggage
              </Link>
            </li>
            <li>
              <Link
                to="/user/profile"
                className="block p-4 text-[#3B3F3F] hover:bg-[#5CC90C] hover:text-white"
                onClick={toggleSideBar}
              >
                Profile
              </Link>
            </li>
            <li
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-200 rounded-full"
              onClick={toggleSideBar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </li>
          </ul>
        </div>
      </div>
      {openNotif && (
        <div className="fixed top-16 right-0 w-96 bg-white shadow-lg rounded-lg z-10 p-4 border border-gray-300">
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            Notifications
          </h3>
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "400px", overflowX: "hidden" }}
          >
            {renderNotifications()}
          </div>
        </div>
      )}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white md:w-[30%] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Log out?</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-action">
              <button
                className="btn btn-danger bg-red-500 text-white rounded-lg"
                onClick={handleLogout}
              >
                Log out
              </button>
              <button
                className="btn"
                onClick={() => setShowLogoutConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;
