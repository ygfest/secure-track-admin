import React from "react";
import NavigationBar from "./NavigationBar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
      <NavigationBar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
