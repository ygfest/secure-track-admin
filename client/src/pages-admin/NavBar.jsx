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
import { IoNotificationsOutline } from "react-icons/io5";
import { useLocation } from "../context/UserLocationContext";
import { useAdminNavBarContext } from "../context/AdminNavBarContext";

const NavBar = ({ tempData, tamperData, fallDetectData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropProfile, setIsDropProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const { isLocationOn, toggleLocation } = useLocation();
  const [adminProfileDp, setAdminProfileDp] = useState("");
  const [adminProfile, setAdminProfile] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [alerts, setAlerts] = useState([]);

  const {
    isSeenNotifications,
    setIsSeenNotifications,
    currentLink,
    setCurrentLink,
  } = useAdminNavBarContext();

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
          setAdminLastName(response.data.user.lastname);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    };
    verifyToken();
  }, [navigate]);

  const apiUrl = import.meta.env.VITE_API_URL;

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
                    } text-xs ml-2`}
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

  return (
    <>
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
                    className={`link no-underline ${
                      currentLink === "/admin" ? "text-primary" : ""
                    }`}
                    onClick={() => {
                      toggleSideBar();
                      setCurrentLink("/admin/");
                    }}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/tracking"
                    className={`link no-underline ${
                      currentLink === "/admin/tracking" ? "text-primary" : ""
                    }`}
                    onClick={() => {
                      toggleSideBar();
                      setCurrentLink("/admin/tracking");
                    }}
                  >
                    Map
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/luggage"
                    className="link no-underline"
                    onClick={() => {
                      toggleSideBar();
                      setCurrentLink("/admin/luggage");
                    }}
                  >
                    Luggage Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/user-management"
                    className="link no-underline"
                    onClick={() => {
                      toggleSideBar();
                      setCurrentLink("/admin/user-management");
                    }}
                  >
                    Users Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/reports"
                    className="link no-underline"
                    onClick={() => {
                      toggleSideBar();
                      setCurrentLink("/admin/reports");
                    }}
                  >
                    Reports
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/profile"
                    className="link no-underline"
                    onClick={() => {
                      toggleSideBar();
                      setCurrentLink("/admin/profile");
                    }}
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="navbar-start md:navbar-center flex items-center md:justify-center">
          <Link
            to="/user/"
            className="link btn btn-ghost text-sm md:text-xl no-underline flex items-center p-0"
          >
            <span className="hidden md:inline text-sm">Powered by </span>
            <img src={Logo} alt="Secure Track" className="h-8" />
          </Link>
        </div>
        <div className="navbar-end flex items-center space-x-0">
          <label
            className="flex items-center cursor-pointer"
            title="Update Location"
          >
            <span className="hidden md:inline text-xs md:text-sm">
              Location:
            </span>
            <input
              type="checkbox"
              className="toggle toggle-primary ml-1"
              checked={isLocationOn}
              onChange={toggleLocation}
            />
          </label>

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
          {openNotif && (
            <div className="absolute top-16 right-2 w-[75%] md:w-[25%] p-3 rounded-lg shadow-md bg-zinc-950 w-80">
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
              onClick={handleDropProfile}
            >
              {adminProfileDp ? (
                <div className="w-10 rounded-full">
                  <img src={adminProfileDp} alt="Profile" />
                </div>
              ) : (
                <div className="w-[38px] pt-1 rounded-full flex justify-center items-center bg-zinc-500 font-light text-white text-lg ring-zinc-600 ring-offset-black ring ring-offset-2">
                  {adminProfile && adminProfile.charAt(0).toUpperCase()}
                  {adminLastName && adminLastName.charAt(0)}
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
    </>
  );
};

export default NavBar;
