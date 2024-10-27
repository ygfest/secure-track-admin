import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MapComponent from "./pages-admin/MapComponent";
import AdminLuggageTracking from "./pages-admin/LuggageTracking";
import ADashBoard from "./pages-admin/DashBoard";
import UserManagement from "./pages-admin/user-management";
import ReportsAnalyticsPage from "./pages-admin/ReportsAnalyticsPage";
import AdminAssocLuggage from "./pages-admin/AssocLuggage";
import AdminProfile from "./pages-admin/Profile";
import AdminReports from "./pages-admin/Reports";

import UserDashboard from "./pages-user/DashBoard";
import LuggageTracking from "./pages-user/LuggageTracking";
import Profile from "./pages-user/Profile";
import AssocLuggage from "./pages-user/AssocLuggage";
import SignInForm from "./components/SignIn";
import SignUpForm from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Home from "./home/home";
import AuthCallback from "./pages-user/AuthCallBack";
import EditProfile from "./pages-user/EditProfile";
import AdminLayout from "./pages-admin/AdminLayout";
import UserLayout from "./pages-user/UserLayout";

import { AdminNavBarProvider } from "./context/AdminNavBarContext";
import { UserNotifProvider } from "./context/UserNotifContext";
import { UserLocationProvider } from "./context/UserLocationContext";
const AppRoutes = ({ loadingBarRef }) => {
  const location = useLocation();

  useEffect(() => {
    // Start the loading bar when the route changes
    loadingBarRef.current.continuousStart();

    // Complete the loading bar after the route has changed
    loadingBarRef.current.complete();
  }, [location, loadingBarRef]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/sign-in" element={<SignInForm />} />
      <Route path="/sign-up" element={<SignUpForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
};

const AdminRoutes = () => {
  return (
    <AdminNavBarProvider>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<ADashBoard />} />
          <Route path="/luggage" element={<AdminAssocLuggage />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/reports-analytics" element={<ReportsAnalyticsPage />} />
          <Route path="/reports" element={<AdminReports />} />
          <Route path="/profile" element={<AdminProfile />} />
        </Route>
        <Route path="/tracking" element={<AdminLuggageTracking />} />
      </Routes>
    </AdminNavBarProvider>
  );
};

const UserRoutes = () => {
  return (
    <UserNotifProvider>
      <UserLocationProvider>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/luggage" element={<AssocLuggage />} />
          </Route>
          <Route path="/tracking" element={<LuggageTracking />} />
        </Routes>
      </UserLocationProvider>
    </UserNotifProvider>
  );
};

export default AppRoutes;
