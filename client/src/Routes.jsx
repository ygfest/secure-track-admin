import { Route, Routes } from "react-router-dom";
import MapComponent from "./pages-admin/MapComponent";
import AdminLuggageTracking from "./pages-admin/LuggageTracking";
import ADashBoard from "./pages-admin/DashBoard";
import UserManagement from "./pages-admin/user-management";
import ReportsAnalyticsPage from "./pages-admin/ReportsAnalyticsPage";
import AdminAssocLuggage from "./pages-admin/AssocLuggage";

import UserDashboard from "./pages-user/DashBoard"; // Assuming you have a UserDashboard component
import LuggageTracking from "./pages-user/LuggageTracking";
import Profile from "./pages-user/Profile"; // Assuming you have a UserProfile component
import AssocLuggage from "./pages-user/AssocLuggage";
import SignInForm from "./components/SignIn";
import SignUpForm from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Home from "./home/home";
import { Link } from "react-router-dom";
import AuthCallback from "./pages-user/AuthCallBack";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ADashBoard />} />

      <Route path="/luggage" element={<AdminAssocLuggage />} />
      <Route path="/tracking" element={<AdminLuggageTracking />} />
      <Route path="/user-management" element={<UserManagement />} />
      <Route path="/reports-analytics" element={<ReportsAnalyticsPage />} />
    </Routes>
  );
};

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserDashboard />} />
      <Route path="/tracking" element={<LuggageTracking />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/luggage" element={<AssocLuggage />} />
      {/* Add other user-side routes as needed */}
    </Routes>
  );
};
const AppRoutes = () => {
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

export default AppRoutes;
