import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

//Admin Components
import AdminDashBoard from "./pages/admin/DashBoard";
import AdminLuggageTracking from "./pages/admin/LuggageTracking";
import UserManagement from "./pages/admin/UserManagement";
import AdminAssocLuggage from "./pages/admin/AssocLuggage";
import AdminProfile from "./pages/admin/Profile";
import AdminReports from "./pages/admin/Reports";

//User Components
import UserDashboard from "./pages/user/DashBoard";
import LuggageTracking from "./pages/user/LuggageTracking";
import Profile from "./pages/user/Profile";
import AssocLuggage from "./pages/user/AssocLuggage";
import EditProfile from "./pages/user/EditProfile";

//Global Components
import SignInForm from "./components/SignIn";
import SignUpForm from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AuthCallback from "./auth/AuthCallBack";
import Home from "./home/home-page";

//Layouts for both user and admin side
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

//Providers
import { AdminDataProvider } from "./context/AdminDataContext";
import { UserNotifProvider } from "./context/UserNotifContext";
import { UserProvider } from "./context/UserContext";

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
    <AdminDataProvider>
      <UserProvider>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<AdminDashBoard />} />
            <Route path="/luggage" element={<AdminAssocLuggage />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/profile" element={<AdminProfile />} />
          </Route>
          <Route path="/tracking" element={<AdminLuggageTracking />} />
        </Routes>
      </UserProvider>
    </AdminDataProvider>
  );
};

const UserRoutes = () => {
  return (
    <UserNotifProvider>
      <UserProvider>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/luggage" element={<AssocLuggage />} />
          </Route>
          <Route path="/tracking" element={<LuggageTracking />} />
        </Routes>
      </UserProvider>
    </UserNotifProvider>
  );
};

export default AppRoutes;
