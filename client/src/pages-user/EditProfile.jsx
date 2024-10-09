import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import { toast, Toaster } from "sonner";
import { CiCamera } from "react-icons/ci";
import { FiSettings } from "react-icons/fi";

const EditProfile = ({ userProfile }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    createdAt: "",
    bio: "",
    profile_dp: "",
    backgroundImage: "",
    userID: "",
    phone: "",
  });
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [resetPassMode, setResetPassMode] = useState(false);

  useEffect(() => {
    Axios.defaults.withCredentials = true;
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.get(`${apiUrl}/auth/verify`);
      if (!response.data.status || response.data.user.role !== "user") {
        navigate("/sign-in");
      } else {
        setProfileData(response.data.user);
      }
    } catch (err) {
      console.log("Error verifying token:", err);
      navigate("/sign-in");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const editedProfileData = {
      userId: profileData.userID,
      firstname: profileData.firstname,
      lastname: profileData.lastname,
      phone: profileData.phone,
      ...(newProfilePhoto && { profile_dp: newProfilePhoto }),
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await Axios.put(`${apiUrl}/auth/edit-profile`, editedProfileData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Profile updated successfully");
      navigate("/user/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  const handlePhotoChange = (e) => {
    setNewProfilePhoto(e.target.files[0]);
  };

  return (
    <>
      <NavigationBar />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            margin: "5px 0",
          },
        }}
      />
      <div className="min-h-screen flex flex-col items-center py-8 mx-8 bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
          <form className="space-y-4" onSubmit={handleSave}>
            <h3 className="text-xl font-bold">Edit Profile</h3>
            <div className="mx-auto mb-4 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-3xl text-gray-600 font-bold text-xl border-2 border-gray-600 relative">
                <CiCamera className="h-240" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <input
              type="text"
              value={profileData.firstname}
              onChange={(e) =>
                setProfileData({ ...profileData, firstname: e.target.value })
              }
              placeholder="First Name"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={profileData.lastname}
              onChange={(e) =>
                setProfileData({ ...profileData, lastname: e.target.value })
              }
              placeholder="Last Name"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData({ ...profileData, phone: e.target.value })
              }
              placeholder="Phone number"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 rounded-md hover:bg-secondary-dark transition-all"
            >
              Save Changes
            </button>
          </form>
        </div>

        <br />

        {resetPassMode ? (
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <form className="space-y-4" onSubmit={handleSave}>
              <h3 className="text-xl font-bold">Reset Password</h3>
              <input
                type="password"
                name="currentPassword"
                value={profileData.currentPassword || ""}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="Current Password"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                name="newPassword"
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="New Password"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                name="confirmPassword"
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Re-enter Password"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-all"
              >
                Reset Password
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg flex items-center justify-center">
            <button
              type="button"
              onClick={() => setResetPassMode((prevState) => !prevState)}
              className="flex items-center gap-2 text-primary bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-200 transition-all"
            >
              <FiSettings className="text-xl" />
              <span>Reset Password</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EditProfile;
