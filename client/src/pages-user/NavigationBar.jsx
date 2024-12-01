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
import {
  AiOutlineHome,
  AiOutlineCompass,
  AiOutlineFolder,
  AiOutlineUser,
} from "react-icons/ai";
import { GoAlert } from "react-icons/go";
import { GoShield } from "react-icons/go";
import { TbLocationExclamation } from "react-icons/tb";
import { parse, format } from "date-fns";
import { useUserNotif } from "../context/UserNotifContext";
import { IoNotificationsOutline } from "react-icons/io5";

const formatDate = (dateObj) => {
  return format(dateObj, "MM/dd, hh:mm aa");
};

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [hasNewAlerts, setHasNewAlerts] = useState(false);
  const [profileDp, setProfileDp] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const prevStatusesRef = useRef([]);

  const {
    tamperData,
    tempData,
    fallDetectData,
    isSeenNotifications,
    setIsSeenNotifications,
    currentLink,
    setCurrentLink,
    luggageInfo,
    userReports,
    statuses,
  } = useUserNotif();
  const navigate = useNavigate();

  const toggleSideBar = () => setIsOpen(!isOpen);
  const toggleProfile = () => {
    setIsOpenProfile(!isOpenProfile);
    setOpenNotif(false);
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/auth/verify`, {
          method: "GET",
          credentials: "include", // Equivalent to axios withCredentials: true
        });

        const data = await response.json();
        console.log("Verify token response:", data);

        if (!data.status) {
          navigate("/sign-in");
        } else {
          setProfileDp(data.user.profile_dp);
          setProfileName(data.user.firstname);
          setProfileLastName(data.user.lastname);
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

  const updateAlerts = () => {
    const newAlerts = [];

    // Default empty arrays if props are undefined
    const tempArray = tempData || [];
    const tamperArray = tamperData || [];
    const fallArray = fallDetectData || [];
    const geofenceArray = luggageInfo || [];
    const userReportsStatus = userReports || [];

    userReportsStatus.forEach((report) => {
      if (report.status === "In Progress") {
        newAlerts.push({
          type: "Report Update",
          criticality: "In Progress",
          description: `Your report regarding ${report.title} has been received by Developers`,
          timestamp: new Date(report.updatedAt),
        });
      } else if (report.status === "Resolved") {
        newAlerts.push({
          type: "Report Update",
          criticality: "Resolved",
          description: `Your report regarding ${report.title} has been Resolved`,
          timestamp: new Date(report.updatedAt),
        });
      }
    });

    geofenceArray.forEach((luggage) => {
      if (luggage.status === "Out of Range") {
        newAlerts.push({
          type: "Out of Range",
          criticality: "Critical",
          description: `${luggage.luggage_custom_name} is outside the Geofence range `,
          timestamp: new Date(luggage.updatedAt),
        });
      }
    });

    tempArray.forEach((temp) => {
      if (temp.temperature > 30) {
        newAlerts.push({
          type: "High Temperature",
          criticality: "Critical",
          description: `High temperature detected: ${temp.temperature}°C in ${temp.luggage_custom_name}`,
          timestamp: new Date(temp.timeStamp),
        });
      } else if (temp.temperature < 10) {
        newAlerts.push({
          type: "Low Temperature",
          criticality: "Warning",
          description: `Low temperature detected: ${temp.temperature}°C in ${temp.luggage_custom_name}`,
          timestamp: new Date(temp.timeStamp),
        });
      }
    });

    tamperArray.forEach((tamper) => {
      newAlerts.push({
        type: "Tamper Detected",
        criticality: "Critical",
        description: `Tamper detected in ${tamper.luggage_custom_name}`,
        timestamp: new Date(tamper.tamperTime),
      });
    });

    fallArray.forEach((fall) => {
      newAlerts.push({
        type: "Fall Detected",
        criticality: "Warning",
        description: `Fall detected in ${fall.luggage_custom_name}`,
        timestamp: new Date(fall.fall_time),
      });
    });

    return newAlerts;
  };

  useEffect(() => {
    const newAlerts = updateAlerts();

    // Check if there are new alerts or if statuses have changed
    const statusesChanged =
      JSON.stringify(prevStatusesRef.current) !== JSON.stringify(statuses);

    if (newAlerts.length > alerts.length || statusesChanged) {
      setAlerts(newAlerts);
      setHasNewAlerts(true); // Set to true when there are new alerts or statuses change
      setIsSeenNotifications(false);
    } else {
      setAlerts(newAlerts); // Just update alerts
      setHasNewAlerts(false); // No new alerts
    }

    // Update the ref with current statuses
    prevStatusesRef.current = statuses;
  }, [tempData, tamperData, fallDetectData, statuses]);

  const renderNotifications = () =>
    alerts.length > 0 ? (
      alerts
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by timestamp descending
        .map((alert, index) => (
          <div key={index} className="card w-full bg-[#f2f5f8] shadow-xl mb-2">
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
      <div className="card w-full bg-white mb-2 py-16">
        <div className="card-body flex flex-col items-center text-center">
          <IoNotificationsOutline className="text-6xl text-gray-500 mb-4" />
          <p className="text-2xl md:text-2xl mb-2 whitespace-nowrap">
            No notifications.
          </p>
          <p className="text-gray-400 text-sm whitespace-nowrap">
            Don't worry, we'll let you know.
          </p>
        </div>
      </div>
    );

  const handleNotifClick = () => {
    setOpenNotif(!openNotif);
    setIsSeenNotifications(true); // Mark notifications as seen
  };

  return (
    <>
      <div className="navbar-container bg-base-100 h-16 z-30 shadow-sm relative">
        <div className="navbar bg-base-100 h-16 fixed border-b">
          <div className="flex-none">
            <button
              className="hidden md:btn md:btn-square md:btn-ghost"
              onClick={() => {
                toggleSideBar();
                setOpenNotif(false);
              }}
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
            <Link to="/" className="btn btn-ghost text-md text-black">
              <img src={Logo} alt="ST Logo" className="h-9 w-auto" />
            </Link>
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
                  fill={openNotif ? "#5CC90C" : "none"}
                  viewBox="0 0 24 24"
                  stroke={openNotif ? "#5CC90C" : "currentColor"}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {(!isSeenNotifications || hasNewAlerts) && (
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
                  <div className="w-[38px] pt-1 rounded-full flex justify-center items-center bg-gray-300 text-zinc-500 text-xl ring-zinc-300 ring-offset-base-100 ring ring-offset-2">
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
                    <Link
                      to="/user/profile"
                      onClick={() => {
                        setCurrentLink("/user/profile");
                        setIsOpenProfile(false);
                      }}
                    >
                      <a className="justify-between">
                        Profile
                        <span className="badge">New</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/user/profile/edit"
                      onClick={() => {
                        setCurrentLink("/user/profile");
                        setIsOpenProfile(false);
                      }}
                    >
                      Settings
                    </Link>
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
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white shadow-lg md:hidden">
          <ul className="flex justify-around p-2">
            <li className="relative">
              <Link
                to="/user/"
                className={`flex flex-col items-center text-secondary transition-colors duration-300 ${
                  currentLink === "/user/" ? "text-[#5CC90C]" : "text-[#3B3F3F]"
                }`}
                onClick={() => {
                  setCurrentLink("/user/");
                  setOpenNotif(false);
                }}
              >
                <AiOutlineHome className="w-6 h-6" />
                <span
                  className={`mt-1 ${
                    currentLink === "/user/"
                      ? "block h-1 w-full bg-[#5CC90C]"
                      : "hidden"
                  }`}
                />
                <span className="text-xs">Dashboard</span>
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/user/tracking"
                className={`flex flex-col items-center text-secondary transition-colors duration-300 ${
                  currentLink === "/user/tracking"
                    ? "text-[#5CC90C]"
                    : "text-[#3B3F3F]"
                }`}
                onClick={() => {
                  setCurrentLink("/user/tracking");
                  setOpenNotif(false);
                }}
              >
                <AiOutlineCompass className="w-6 h-6" />
                <span
                  className={`mt-1 ${
                    currentLink === "/user/tracking"
                      ? "block h-1 w-full bg-[#5CC90C]"
                      : "hidden"
                  }`}
                />
                <span className="text-xs">Live Tracking</span>
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/user/luggage"
                className={`flex flex-col items-center text-secondary transition-colors duration-300 ${
                  currentLink === "/user/luggage"
                    ? "text-[#5CC90C]"
                    : "text-[#3B3F3F]"
                }`}
                onClick={() => {
                  setCurrentLink("/user/luggage");
                  setOpenNotif(false);
                }}
              >
                <AiOutlineFolder className="w-6 h-6" />
                <span
                  className={`mt-1 ${
                    currentLink === "/user/luggage"
                      ? "block h-1 w-full bg-[#5CC90C]"
                      : "hidden"
                  }`}
                />
                <span className="text-xs">My Luggage</span>
              </Link>
            </li>
            <li className="relative">
              <Link
                to="/user/profile"
                className={`flex flex-col items-center text-secondary transition-colors duration-300 ${
                  currentLink === "/user/profile"
                    ? "text-[#5CC90C]"
                    : "text-[#3B3F3F]"
                }`}
                onClick={() => {
                  setCurrentLink("/user/profile");
                  setOpenNotif(false);
                }}
              >
                <AiOutlineUser className="w-6 h-6" />
                <span
                  className={`mt-1 ${
                    currentLink === "/user/profile"
                      ? "block h-1 w-full bg-[#5CC90C]"
                      : "hidden"
                  }`}
                />
                <span className="text-xs">Profile</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Sidebar for Medium Screens and Up */}
        <div
          className={`sidebar bg-white h-screen w-64 fixed top-0 left-0 shadow-lg ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:block transition-transform duration-300 ease-in-out`}
        >
          <ul className="mt-6">
            <li>
              <Link
                to="/user/"
                className={`block p-4 text-[#3B3F3F] hover:bg-[#5CC90C] hover:text-white ${
                  currentLink === "/user/" ? "text-[#5CC90C]" : ""
                }`}
                onClick={() => {
                  toggleSideBar();
                  setCurrentLink("/user/");
                }}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/user/tracking"
                className={`block p-4 text-[#3B3F3F] hover:bg-[#5CC90C] hover:text-white ${
                  currentLink === "/user/tracking" ? "text-[#5CC90C]" : ""
                }`}
                onClick={() => {
                  toggleSideBar();
                  setCurrentLink("/user/tracking");
                }}
              >
                Live Tracking
              </Link>
            </li>
            <li>
              <Link
                to="/user/luggage"
                className={`block p-4 text-[#3B3F3F] hover:bg-[#5CC90C] hover:text-white ${
                  currentLink === "/user/luggage" ? "text-[#5CC90C]" : ""
                }`}
                onClick={() => {
                  toggleSideBar();
                  setCurrentLink("/user/luggage");
                }}
              >
                My Luggage
              </Link>
            </li>
            <li>
              <Link
                to="/user/profile"
                className={`block p-4 text-[#3B3F3F] hover:bg-[#5CC90C] hover:text-white ${
                  currentLink === "/user/profile" ? "text-[#5CC90C]" : ""
                }`}
                onClick={() => {
                  toggleSideBar();
                  setCurrentLink("/user/profile");
                }}
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
        <div className="fixed top-16 right-2 w-[85%] sm:w-96 bg-white shadow-lg rounded-lg z-[25] p-4 border border-gray-300">
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
