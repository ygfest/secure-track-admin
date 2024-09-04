import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes";
import "./App.css";
import { AuthContextProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationContext";

function App() {
  return (
    <>
      <AuthContextProvider>
        <LocationProvider>
          <Router>
            <AppRoutes />
          </Router>
        </LocationProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
