import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { toast, Toaster } from "sonner";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    createdAt: "",
    bio: "",
    profile_dp: "",
    backgroundImage: "",
    userID: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [report, setReport] = useState({
    type: "device-anomaly",
    title: "",
    description: "",
  });

  useEffect(() => {
    Axios.defaults.withCredentials = true;
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.get(`${apiUrl}/auth/verify`);
      if (!response.data.status || response.data.user.role !== "admin") {
        navigate("/sign-in");
      } else {
        setUserProfile(response.data.user);
      }
    } catch (err) {
      console.log("Error verifying token:", err);
      navigate("/sign-in");
    }
  };

  const handlePhotoChange = (e) => {
    setNewProfilePhoto(e.target.files[0]);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("firstname", userProfile.firstname);
    formData.append("lastname", userProfile.lastname);
    formData.append("password", newPassword);
    if (newProfilePhoto) {
      formData.append("profile_dp", newProfilePhoto);
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await Axios.put(`${apiUrl}/user/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditMode(false);
      verifyToken();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const reportData = {
        ...report,
        userId: userProfile.userID,
      };
      const response = await Axios.post(
        `${apiUrl}/auth/user-report`,
        reportData
      );

      if (response.status !== 201) {
        toast.error("Error submitting report");
      } else {
        toast.success("Successfully submitted");
        setReport({ type: "device-anomaly", title: "", description: "" });
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Error submitting report");
    }
  };

  console.log("User ID:", userProfile.userID);

  const getSocialUsername = (url) =>
    new URL(url).pathname.split("").slice(1).join("");

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
      <div className="min-h-screen flex flex-col items-center py-12 bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
          <div className="relative">
            {userProfile.backgroundImage && (
              <img
                src={userProfile.backgroundImage}
                alt="Cover"
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
            <div className="relative z-9 -mt-12 flex items-center justify-between px-4">
              {userProfile.profile_dp ? (
                <img
                  src={userProfile.profile_dp}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xl border-4 border-white">
                  {userProfile.firstname.charAt(0).toUpperCase()}
                </div>
              )}
              {editMode && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mb-4"
                />
              )}
              {editMode && (
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="rounded-full p-2 bg-gray-300"
                >
                  <FiSettings className="text-lg" />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <h2 className="text-2xl font-bold text-start">
              {userProfile.firstname} {userProfile.lastname} (Admin/Developer)
            </h2>
            <p className="text-sm text-start">
              {userProfile.email} • Joined{" "}
              {new Date(userProfile.createdAt).toLocaleDateString()}
            </p>
          </div>
          <hr className="border-t-2 border-primary my-6" />
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
