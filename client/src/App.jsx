import React, { useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes";
import "./App.css";
import { AuthContextProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";
import { UserNotifProvider } from "./context/UserNotifContext";
import LoadingBar from "react-top-loading-bar";
import { AdminNavBarProvider } from "./context/AdminNavBarContext";

function App() {
  const loadingBarRef = useRef(null);

  return (
    <AuthContextProvider>
      <LocationProvider>
        <AdminNavBarProvider>
          <UserNotifProvider>
            <Router>
              <LoadingBar
                color="#5CC90C"
                ref={loadingBarRef}
                height={4}
                shadow={true}
              />
              <AppRoutes loadingBarRef={loadingBarRef} />
            </Router>
          </UserNotifProvider>
        </AdminNavBarProvider>
      </LocationProvider>
    </AuthContextProvider>
  );
}

export default App;
