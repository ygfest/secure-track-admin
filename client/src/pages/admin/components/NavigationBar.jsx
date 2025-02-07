import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/st_logo.svg";

import {
  MdDashboard,
  MdTrackChanges,
  MdLuggage,
  MdGroup,
  MdReport,
  MdAccountCircle,
  MdClose,
} from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { format } from "date-fns";
import { useAdminDataContext } from "../../../context/AdminDataContext";
import { useUserData } from "../../../context/UserContext";
import axiosInstance from "../../../utils/axiosInstance";

const formatDate = (dateObj) => {
  return format(dateObj, "MM/dd/yyyy, HH:mm:ss");
};

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  //const [adminProfileDp, setAdminProfileDp] = useState("");
  //const [adminProfileFirstName, setAdminProfileFirstName] = useState("");
  //const [adminProfileLastName, setAdminProfileLastName] = useState("");
  const [showLogoutConfirmation, setIsShowLogoutConfirmation] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  const { profileDp, profileFirstName, profileLastName } = useUserData();

  const {
    isSeenNotifications,
    setIsSeenNotifications,
    currentLink,
    setCurrentLink,
  } = useAdminDataContext();

  const toggleSideBar = () => setIsOpen(!isOpen);
  const toggleProfile = () => {
    setIsOpenProfile(!isOpenProfile);
    setOpenNotif(false);
  };

  const handleLogout = () => {
    axiosInstance
      .get("/auth/logout")
      .then((res) => {
        if (res.data.status) {
          navigate("/sign-in");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
    setIsSeenNotifications(true);
  };
  return (
    <>
      <div className="navbar-container bg-base-100 h-16 z-10 shadow-sm relative">
        <div className="navbar bg-base-100 h-16 fixed border-b">
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
                  <div className="w-[38px] pt-1 rounded-full flex justify-center items-center bg-zinc-300 font-light text-zinc-500 text-xl ring-zinc-300 ring-offset-base-100 ring ring-offset-2">
                    {profileFirstName &&
                      profileLastName &&
                      `${profileFirstName
                        .charAt(0)
                        .toUpperCase()}${profileLastName
                        .charAt(0)
                        .toUpperCase()}`}
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
                      to="/admin/profile"
                      onClick={() => {
                        setIsOpen(false);
                        setCurrentLink("/admin/profile");
                      }}
                    >
                      <a className="justify-between">
                        Profile
                        <span className="badge">New</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <a onClick={() => setIsShowLogoutConfirmation(true)}>
                      Logout
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
        <div
          className={`sidebar bg-secondary h-screen w-72 px-4 fixed left-0 top-0 shadow-lg ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <ul className="mt-8 flex flex-col justify-start space-y-4 h-full">
            <li className="absolute top-4 right-4 flex justify-center items-center">
              <button
                className="text-gray-500 hover:text-gray-200 cursor-pointer"
                onClick={toggleSideBar}
              >
                <MdClose className="text-3xl" />
              </button>
            </li>

            <li>
              <Link
                to="/admin/"
                className={`flex items-center p-3 text-white rounded-lg transition-colors duration-200 hover:bg-zinc-900 ${
                  currentLink === "/admin/" ? "bg-zinc-800" : ""
                }`}
                onClick={() => {
                  toggleSideBar();
                  setCurrentLink("/admin/");
                }}
              >
                <div
                  className={`p-2 rounded-lg ${
                    currentLink === "/admin/" ? "bg-secondary" : ""
                  }`}
                >
                  <MdDashboard className="text-2xl" />
                </div>
                <span className="ml-3 font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/tracking"
                className={`flex items-center p-3 text-white rounded-lg transition-colors duration-200 hover:bg-zinc-900 ${
                  currentLink === "/admin/tracking" ? "bg-zinc-800" : ""
                }`}
                onClick={() => {
                  toggleSideBar();
                  setCurrentLink("/admin/tracking");
                }}
              >
                <div
                  className={`p-2 rounded-lg ${
                    currentLink === "/admin/tracking" ? "bg-secondary" : ""
                  }`}
                >
                  <MdTrackChanges className="text-2xl" />
                </div>
                <span className="ml-3 font-medium">Live Tracking</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/luggage"
                className={`flex items-center p-3 text-white rounded-lg transition-colors duration-200 hover:bg-zinc-900 ${
                  currentLink === "/admin/luggage" ? "bg-zinc-800" : ""
                }`}
                onClick={() => {
                  toggleSideBar();
                  setCurrentLink("/admin/luggage");
                }}
              >
                <div
                  className={`p-2 rounded-lg ${
                    currentLink === "/admin/luggage" ? "bg-secondary" : ""
                  }`}
                >
                  <MdLuggage className="text-2xl" />
                </div>
                <span className="ml-3 font-medium">Luggage Management</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/user-management"
                className={`flex items-center p-3 text-white rounded-lg transition-colors duration-200 hover:bg-zinc-900 ${
                  currentLink === "/admin/user-management" ? "bg-zinc-800" : ""
                }`}
                onClick={() => {
                  toggleSideBar();
                  setCurrentLink("/admin/user-management");
                }}
              >
                <div
                  className={`p-2 rounded-lg ${
                    currentLink === "/admin/user-management"
                      ? "bg-secondary"
                      : ""
                  }`}
                >
                  <MdGroup className="text-2xl" />
                </div>
                <span className="ml-3 font-medium">User Accounts</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reports"
                className={`flex items-center p-3 text-white rounded-lg transition-colors duration-200 hover:bg-zinc-900 ${
                  currentLink === "/admin/reports" ? "bg-zinc-800" : ""
                }`}
                onClick={() => {
                  toggleSideBar();
                  setCurrentLink("/admin/reports");
                }}
              >
                <div
                  className={`p-2 rounded-lg ${
                    currentLink === "/admin/reports" ? "bg-secondary" : ""
                  }`}
                >
                  <MdReport className="text-2xl" />
                </div>
                <span className="ml-3 font-medium">Reports</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/profile"
                className={`flex items-center p-3 text-white rounded-lg transition-colors duration-200 hover:bg-zinc-900 ${
                  currentLink === "/admin/profile" ? "bg-zinc-800" : ""
                }`}
                onClick={() => {
                  toggleSideBar();
                  setCurrentLink("/admin/profile");
                }}
              >
                <div
                  className={`p-2 rounded-lg ${
                    currentLink === "/admin/profile" ? "bg-secondary" : ""
                  }`}
                >
                  <MdAccountCircle className="text-2xl" />
                </div>
                <span className="ml-3 font-medium">Profile</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {openNotif && (
        <div className="fixed top-16 right-0 w-[85%] sm:w-96 bg-white shadow-lg rounded-lg z-10 p-4 border border-gray-300">
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
          <div className="bg-white p-6 md:w-[30%] rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Log out?</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-action">
              {" "}
              <button
                className="btn btn-danger bg-red-500 text-white"
                onClick={handleLogout}
              >
                Log out
              </button>
              <button
                className="btn"
                onClick={() => setIsShowLogoutConfirmation(false)}
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
