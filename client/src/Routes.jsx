import { Route, Routes } from "react-router-dom";
import MapComponent from "./components/MapComponent";
import DashboardPage from "./components/DashboardPage";
import CargoManagement from "./components/CargoManagement";
import ResourceMgmtPage from "./components/ResourceMgmtPage";
import UserManagement from "./components/UserManagement";
import SettingsPage from "./components/SettingsPage";
import AlertsNotificationsPage from "./components/AlertsNotificationsPage";
import ReportsAnalyticsPage from "./components/ReportsAnalyticsPage";
import HelpSupportPage from "./components/HelpSupportPage";
import UserSide from "./components/UserSide";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/tracking" element={<MapComponent />} />
      <Route path="/cargo-management" element={<CargoManagement />} />
      <Route path="/resource-management" element={<ResourceMgmtPage />} />
      <Route path="/user-management" element={<UserManagement />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route
        path="/alerts-notifications"
        element={<AlertsNotificationsPage />}
      />
      <Route path="/reports-analytics" element={<ReportsAnalyticsPage />} />
      <Route path="/help-support" element={<HelpSupportPage />} />
      <Route path="/user-side" element={<UserSide />} />
    </Routes>
  );
};

export default AppRoutes;
