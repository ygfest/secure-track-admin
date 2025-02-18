import React from "react";
import NavigationBar from "../pages/admin/components/NavigationBar";
import { Outlet } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { BarLoader } from "react-spinners";

const AdminLayout = () => {
  const admin = useAuth("admin");

  if (!admin)
    return (
      <div className="bg-white h-[100vh] w-[100vw] flex flex-col items-center justify-center">
        <img src="/ST-without-name.svg" className="h-24 mb-8" />
        <BarLoader color="#272829" size={40} data-testid="loader" />
      </div>
    );
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
