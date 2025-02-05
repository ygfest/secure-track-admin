import React from "react";
import NavigationBar from "./components/NavigationBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout h-screen bg-ingerit">
      <NavigationBar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
