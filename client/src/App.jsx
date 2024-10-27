import React, { useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes";
import "./App.css";
import { AuthContextProvider } from "./context/AuthContext";

import LoadingBar from "react-top-loading-bar";

function App() {
  const loadingBarRef = useRef(null);

  return (
    <AuthContextProvider>
      <Router>
        <LoadingBar
          color="#5CC90C"
          ref={loadingBarRef}
          height={4}
          shadow={true}
        />
        <AppRoutes loadingBarRef={loadingBarRef} />
      </Router>
    </AuthContextProvider>
  );
}

export default App;
