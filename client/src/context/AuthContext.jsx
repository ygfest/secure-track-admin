import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "SIGNIN":
      return { user: action.payload };
    case "SIGNOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "SIGNIN", payload: user });
    }
  }, []);

  const verifyToken = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      return false;
    }
    try {
      const response = await axios.get("http://localhost:3000/auth/verify", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data.status;
    } catch (error) {
      console.error("Error verifying token:", error);
      dispatch({ type: "SIGNOUT" });
      localStorage.removeItem("user");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, dispatch, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};
