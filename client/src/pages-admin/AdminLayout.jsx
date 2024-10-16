import React from "react";
import NavigationBar from "./NavigationBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <NavigationBar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
