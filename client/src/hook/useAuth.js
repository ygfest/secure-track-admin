import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const useAuth = (role) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/verify");

        console.log("Verify token response:", data);

        if (!data.status || data.user.role !== role) {
          navigate("/sign-in");
        } else {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        navigate("/sign-in");
      }
    };

    verifyToken();
  }, [navigate, role]);

  return user; // Returns user data if authenticated
};

export default useAuth;
