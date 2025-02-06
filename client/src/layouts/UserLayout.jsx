import React from "react";
import NavigationBar from "../pages/user/components/NavigationBar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-inherit">
      <NavigationBar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
