import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/st_logo.svg";
import Profile from "../assets/sample_profile.jpg";
import {
  FaThermometerHalf,
  FaLock,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { GoAlert } from "react-icons/go";
import { GoShield } from "react-icons/go";
import { TbLocationExclamation } from "react-icons/tb";
import { IoNotificationsOutline } from "react-icons/io5";
import { format } from "date-fns";
import { useUserNotif } from "../context/UserNotifContext";
import { useLocation } from "../context/UserLocationContext";

const formatDate = (dateObj) => {
  if (!dateObj || isNaN(new Date(dateObj))) {
    return "Invalid date";
  }
  return format(new Date(dateObj), "MM/dd, hh:mm aa");
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropProfile, setIsDropProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  const [profileDp, setProfileDp] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const { isLocationOn, toggleLocation } = useLocation();

  const prevStatusesRef = useRef([]);

  const {
    tamperData,
    fallDetectData,
    tempData,
    alerts,
    setAlerts,
    hasNewNotifs,
    setHasNewNotifs,
    hasNewAlerts,
    setHasNewAlerts,
    currentLink,
    setCurrentLink,
    luggageInfo,
    userReports,
    statuses,
  } = useUserNotif();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/verify`, {
          withCredentials: true,
        });
        if (!response.data.status) {
          navigate("/sign-in");
        } else {
          setProfileDp(response.data.user.profile_dp);
          setProfileName(response.data.user.firstname);
          setProfileLastName(response.data.user.lastname);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    };

    verifyToken();
  }, [navigate, apiUrl]);

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case "High Temperature":
      case "Low Temperature":
        return <FaThermometerHalf className="text-primary text-2xl mr-2" />;
      case "Fall Detected":
        return <GoAlert className="text-primary text-2xl mr-2" />;
      case "Tamper Detected":
        return <GoShield className="text-primary text-2xl mr-2" />;
      default:
        return <TbLocationExclamation className="text-primary text-2xl mr-2" />;
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
        return "badge-danger bg-red-500 text-white";
      case "Out of Range":
        return "badge-danger bg-red-500 text-white";
      case "In Progress":
        return "badge-accent";
      case "Resolved":
        return "badge-primary text-white";
      default:
        return "badge-primary";
    }
  };

  const renderNotifications = () =>
    alerts.length > 0 ? (
      alerts
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by timestamp descending
        .map((alert, index) => (
          <div
            key={index}
            className="card w-full bg-zinc-800 max-h-64 shadow-xl mb-2"
          >
            <div className="card-body flex items-start">
              <div className="mr-4">{getAlertIcon(alert.type)}</div>
              <div className="flex-1">
                <h4 className="card-title text-base flex items-center">
                  {alert.type}
                  <div
                    className={`badge ${
                      alert.type !== "Report Update"
                        ? getAlertColor(alert.type)
                        : getAlertColor(alert.criticality)
                    } text-xs whitespace-nowrap ml-2`}
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
        ))
    ) : (
      <div className="">
        <div className="card w-full bg-zinc-950 max-h-64 shadow-xl mb-2">
          <div className="card-body flex flex-col items-center py-12 text-center">
            <IoNotificationsOutline className="text-6xl text-gray-500 mb-4" />
            <p className="text-2xl whitespace-nowrap">No notifications.</p>
            <p className="text-gray-400 text-sm whitespace-nowrap">
              Don't worry, we'll let you know.
            </p>
          </div>
        </div>
      </div>
    );

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

  const handleNotifClick = () => {
    setOpenNotif(!openNotif);
    setHasNewAlerts(false);
    setHasNewNotifs(false);
  };

  return (
    <div
      className="navbar fixed top-2 left-0 right-0 px-3 flex justify-between rounded-lg z-10 p-0 mx-auto shadow-md bg-[#020202a0] backdrop-blur-xl text-white"
      style={{ width: "98.90%" }}
    >
      {/* Left: Burger Menu */}
      <div className="md:navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
            onClick={() => {
              toggleSideBar();
              setOpenNotif(false);
            }}
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
            <ul className="menu dropdown-content mt-3 absolute z-30 p-2 shadow rounded-lg w-52 bg-[#020202a0]">
              <li>
                <Link
                  to="/user/"
                  className="link no-underline"
                  onClick={() => {
                    //toggleSideBar();
                    setCurrentLink("/user/");
                  }}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/user/tracking"
                  className={`link no-underline ${
                    currentLink === "/user/tracking"
                      ? "text-primary"
                      : "text-white"
                  }`}
                  onClick={() => {
                    //toggleSideBar();
                    setCurrentLink("/user/tracking");
                  }}
                >
                  Map
                </Link>
              </li>
              <li>
                <Link
                  to="/user/luggage"
                  className="link no-underline"
                  onClick={() => {
                    //toggleSideBar();
                    setCurrentLink("/user/luggage");
                  }}
                >
                  My Luggage
                </Link>
              </li>
              <li>
                <Link
                  to="/user/profile"
                  className="link no-underline"
                  onClick={() => {
                    //toggleSideBar();
                    setCurrentLink("/user/profile");
                  }}
                >
                  Profile
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Center: Logo */}
      <div className="navbar-start md:navbar-center flex items-center md:justify-center">
        <Link
          to="/user/"
          className="link btn btn-ghost text-sm md:text-xl no-underline flex items-center p-0"
        >
          <span className="hidden md:inline  text-sm">Powered by </span>
          <img src={Logo} alt="Secure Track" className="h-8" />
        </Link>
      </div>

      <div className="navbar-end flex items-center md:space-x-4">
        <label
          className="flex items-center cursor-pointer"
          title="Update Location"
        >
          <span className="hidden md:inline text-xs md:text-sm">Location:</span>
          <input
            type="checkbox"
            className="toggle toggle-primary ml-1"
            checked={isLocationOn}
            onChange={() => toggleLocation()}
          />
        </label>

        {/* Notification Icon */}
        <button className="btn btn-ghost btn-circle" onClick={handleNotifClick}>
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill={openNotif ? "#5CC90C" : "none"}
              viewBox="0 0 24 24"
              stroke={openNotif ? "#5CC90C" : "currentColor"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-2.486-1.176-4.675-3-6.32V4a3 3 0 00-6 0v.68C7.176 6.325 6 8.514 6 11v3.159c0 .538-.214 1.055-.595 1.437L4 17h5m0 0v1a3 3 0 006 0v-1m-6 0h6"
              />
            </svg>
            {(hasNewNotifs || hasNewAlerts) && (
              <span className="badge badge-xs badge-primary indicator-item"></span>
            )}
          </div>
        </button>
        {/* Notifications Popup */}
        {openNotif && (
          <div className="absolute top-16 right-2 w-[85%] md:w-[25%] p-3 rounded-lg shadow-md bg-zinc-950 w-80">
            <h3 className="font-bold text-lg mb-3">Notifications</h3>
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "400px", overflowX: "hidden" }}
            >
              {renderNotifications()}
            </div>
          </div>
        )}

        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
            onClick={() => handleDropProfile()}
          >
            {profileDp ? (
              <div className="w-10 rounded-full">
                <img
                  src={profileDp}
                  alt="Profile"
                  className="w-10 rounded-full"
                />
              </div>
            ) : (
              <div className="w-[38px] pt-1 rounded-full flex justify-center items-center bg-zinc-300 text-zinc-500 text-xl font-bold ring-zinc-300 ring-offset-zinc-50 ring ring-offset-2">
                {profileName && profileName.charAt(0).toUpperCase()}
                {profileLastName && profileLastName.charAt(0)}
              </div>
            )}
          </label>
          {isDropProfile && (
            <ul className="menu menu-compact dropdown-content absolute z-30 mt-3 p-2 shadow rounded-box w-52 bg-[#020202a0]">
              <li>
                <Link
                  to="/user/profile"
                  className="justify-between"
                  onClick={() => {
                    handleDropProfile();
                    setCurrentLink("/user/profile");
                  }}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/user/profile/edit"
                  className="justify-between"
                  onClick={() => {
                    handleDropProfile();
                    setCurrentLink("/user/profile");
                  }}
                >
                  Settings
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
