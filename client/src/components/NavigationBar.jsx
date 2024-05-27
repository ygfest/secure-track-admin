import React, { useState } from "react";

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  const toggleSideBar = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsOpenProfile(!isOpenProfile);

  return (
    <div className="navbar-container bg-base-100 h-16 z-10 shadow-sm relative bordered">
      <div className="navbar bg-base-100 h-16 fixed">
        <div className="flex-none">
          <button className="btn btn-square btn-ghost" onClick={toggleSideBar}>
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
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/f5/AirAsia_New_Logo.svg"
              alt="AirAsia Logo"
              className="h-9 w-auto"
            />
            <span>by SecureTrack</span>
          </a>
        </div>
        <div className="flex-none gap-2">
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
          <div className="dropdown dropdown-end" onClick={toggleProfile}>
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            {isOpenProfile && (
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
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
      </div>
      <div
        className={`sidebar bg-red-500 h-screen w-64 fixed left-0 top-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <ul className="mt-6">
          <li>
            <a
              href="/admin/"
              className="block p-4 text-white hover:bg-red-400"
              onClick={toggleSideBar}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/admin/tracking"
              className="block p-4 text-white hover:bg-red-400"
              onClick={toggleSideBar}
            >
              Live Tracking
            </a>
          </li>
          <li>
            <a
              href="/admin/cargo-management"
              className="block p-4 text-white hover:bg-red-400"
              onClick={toggleSideBar}
            >
              Cargo Management
            </a>
          </li>
          <li>
            <a
              href="/admin/user-management"
              className="block p-4 text-white hover:bg-red-400"
              onClick={toggleSideBar}
            >
              User Management
            </a>
          </li>
          <li>
            <a
              href="/admin/reports-analytics"
              className="block p-4 text-white hover:bg-red-400"
              onClick={toggleSideBar}
            >
              Reports and Analytics
            </a>
          </li>
        </ul>
        <div
          tabIndex={0}
          role="button"
          className="absolute top-0 right-0 m-2 p-2 btn btn-ghost btn-circle"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
