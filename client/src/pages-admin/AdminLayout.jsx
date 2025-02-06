import React from "react";
import NavigationBar from "./components/NavigationBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="h-screen bg-inherit">
      <NavigationBar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
