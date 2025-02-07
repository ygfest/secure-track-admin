import React from "react";
import NavigationBar from "../pages/admin/components/NavigationBar";
import { Outlet } from "react-router-dom";
import useAuth from "../hook/useAuth";

const AdminLayout = () => {
  const admin = useAuth("admin");

  if (!admin) return;
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
