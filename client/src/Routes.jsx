import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MapComponent from "./pages-admin/MapComponent";
import AdminLuggageTracking from "./pages-admin/LuggageTracking";
import ADashBoard from "./pages-admin/DashBoard";
import UserManagement from "./pages-admin/user-management";
import ReportsAnalyticsPage from "./pages-admin/ReportsAnalyticsPage";
import AdminAssocLuggage from "./pages-admin/AssocLuggage";
import AdminProfile from "./pages-admin/Profile";
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
    <Routes>
      <Route path="/" element={<ADashBoard />} />
      <Route path="/luggage" element={<AdminAssocLuggage />} />
      <Route path="/tracking" element={<AdminLuggageTracking />} />
      <Route path="/user-management" element={<UserManagement />} />
      <Route path="/reports-analytics" element={<ReportsAnalyticsPage />} />
      <Route path="/profile" element={<AdminProfile />} />
    </Routes>
  );
};

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserDashboard />} />
      <Route path="/tracking" element={<LuggageTracking />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/luggage" element={<AssocLuggage />} />
    </Routes>
  );
};

export default AppRoutes;
