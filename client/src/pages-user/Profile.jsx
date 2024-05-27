import React, { useEffect } from "react";
import NavigationBar from "./NavigationBar";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await Axios.get("http://localhost:3000/auth/verify");
        if (!response.data.status) {
          navigate("/user/profile");
        }
      } catch (err) {
        console.log("error verifying token");
        navigate("/sign-in");
      }
    };
    verifyToken();
  }, []);

  return (
    <>
      <NavigationBar />
      <div>Profile</div>
    </>
  );
};

export default Profile;
