import React from "react";
import NavigationBar from "../pages/user/components/NavigationBar";
import { Outlet } from "react-router-dom";
import useAuth from "../hook/useAuth";

const UserLayout = () => {
  const user = useAuth("user");

  if (!user) return;
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
