import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import { toast, Toaster } from "sonner";
import { CiCamera } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { FiSettings } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

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
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [resetPassMode, setResetPassMode] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

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

  const handleUpdateProfile = async (e) => {
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

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (profileData.newPassword !== profileData.confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    // If user has a googleId, skip current password requirement
    if (!profileData.googleId && !profileData.currentPassword) {
      toast.error("Current password is required.");
      return;
    }

    // Handle password reset logic
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await Axios.post(`${apiUrl}/auth/reset-password-edit`, {
        userId: profileData.userID,
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword,
      });
      toast.success("Password reset successfully");
      setResetPassMode(false); // Optionally close the reset password form
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Error resetting password");
    }
  };

  const handlePhotoChange = (e) => {
    setNewProfilePhoto(e.target.files[0]);
  };

  const handleRemovePhoto = () => {
    setNewProfilePhoto(null);
  };

  const handleDeleteAccount = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      await Axios.delete(`${apiUrl}/auth/deleteuser/${profileData.userID}`, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Account deleted successfully");
      navigate("/sign-in");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Error deleting account");
    }
  };

  // Upload image using Axios
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await Axios.post(
          `${apiUrl}/api/uploadthing/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setNewProfilePhoto(response.data.url); // Update state with the new profile photo URL
        toast.success("Profile photo uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            margin: "5px 0",
          },
        }}
      />
      <div className="min-h-screen flex flex-col items-center py-6 mx-4 pb-24 bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
          <form className="space-y-4" onSubmit={handleUpdateProfile}>
            <h3 className="text-xl font-bold">Edit Profile</h3>
            <div className="mx-auto mb-4 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white flex z-50 items-center justify-center text-3xl text-gray-600 font-bold text-xl border-2 border-gray-600 relative hover:bg-zinc-100 transition-all">
                {newProfilePhoto && (
                  <>
                    <img
                      src={newProfilePhoto}
                      alt="Profile Preview"
                      className="w-full h-full rounded-full"
                    />
                    <button
                      className="btn-ghost absolute rounded-full bg-zinc-50 p-1 -right-3 top-0 z-20 text-[1.3rem]"
                      onClick={handleRemovePhoto}
                    >
                      <IoClose />
                    </button>
                  </>
                )}
                <CiCamera className="absolute inset-0 m-auto text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
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
              placeholder="Add your phone number"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
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
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <h3 className="text-xl font-bold">Reset Password</h3>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Current Password"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {isPasswordVisible ? (
                  <EyeOutlined
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setIsPasswordVisible(false)}
                  />
                ) : (
                  <EyeInvisibleOutlined
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setIsPasswordVisible(true)}
                  />
                )}
              </div>
              <div className="relative">
                <input
                  type={isNewPasswordVisible ? "text" : "password"}
                  name="newPassword"
                  value={profileData.newPassword}
                  required
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="New Password"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {isNewPasswordVisible ? (
                  <EyeOutlined
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setIsNewPasswordVisible(false)}
                  />
                ) : (
                  <EyeInvisibleOutlined
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setIsNewPasswordVisible(true)}
                  />
                )}
              </div>
              <div className="relative">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  required
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Re-enter Password"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {isConfirmPasswordVisible ? (
                  <EyeOutlined
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setIsConfirmPasswordVisible(false)}
                  />
                ) : (
                  <EyeInvisibleOutlined
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setIsConfirmPasswordVisible(true)}
                  />
                )}
              </div>

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
              <FiSettings className="text-lg" />
              <span>Reset Password</span>
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg flex items-center justify-center mt-6">
          <button
            type="button"
            onClick={() => setShowDeleteConfirmation(true)}
            className="flex items-center gap-2 text-red-500 bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-200 transition-all"
          >
            <MdOutlineDeleteOutline className="text-lg" />
            <span>Delete Account</span>
          </button>
        </div>

        {showDeleteConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 w-[80%] md:w-[30%] rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <p>Are you sure you want to delete your account?</p>
              <div className="modal-action">
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EditProfile;
