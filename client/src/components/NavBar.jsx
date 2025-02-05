import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropProfile, setIsDropProfile] = useState(false);

  const toggleSideBar = () => setIsOpen(!isOpen);

  const handleDropProfile = () => setIsDropProfile(!isDropProfile);

  return (
    <div
      className="navbar bg-base-100 fixed top-2 left-0 right-0 pr-3 pl-3 flex justify-between rounded-lg z-10 p-0 mx-auto shadow-md"
      style={{ width: "98.90%" }}
    >
      <div className="sidebar fixed left-3 z-10 rounded-lg">
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
            <ul className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-base-100 rounded-lg w-52">
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
                  to="/admin/cargo-management"
                  className="link no-underline"
                  onClick={toggleSideBar}
                >
                  Cargo Management
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/user-management"
                  className="link no-underline"
                  onClick={toggleSideBar}
                >
                  User Management
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/reports-analytics"
                  className="link no-underline"
                  onClick={toggleSideBar}
                >
                  Reports & Analytics
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="navbar-center flex-1 justify-center">
        <Link
          to="/admin/"
          className="link btn btn-ghost text-xl no-underline text-red-500"
        >
          Cargo Live Tracking
        </Link>
      </div>
      <button className="btn btn-ghost btn-circle">
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
          <span className="badge badge-xs badge-primary indicator-item"></span>
        </div>
      </button>
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
          onClick={handleDropProfile}
        >
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            />
          </div>
        </div>
        {isDropProfile && (
          <ul
            tabIndex={0}
            className="mt-3 z-20 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default NavBar;
