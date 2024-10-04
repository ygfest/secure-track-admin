import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import NavigationBar from "./NavigationBar";
import { toast, Toaster } from "sonner";

const Profile = () => {
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
      if (!response.data.status) {
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
        toast.success("Report submitted successfully");
        setReport({ type: "device-anomaly", title: "", description: "" });
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Error submitting report");
    }
  };

  const getSocialUsername = (url) =>
    new URL(url).pathname.split("").slice(1).join("");

  return (
    <>
      <NavigationBar />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000, // Set duration for how long each toast stays
          style: {
            margin: "5px 0", // Space between toasts
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
              {userProfile.firstname} {userProfile.lastname}
            </h2>
            <p className="text-sm text-start">
              {userProfile.email} • Joined{" "}
              {new Date(userProfile.createdAt).toLocaleDateString()}
            </p>
            {userProfile.bio && (
              <p className="text-center">{userProfile.bio}</p>
            )}
            <div className="flex justify-end mt-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-primary text-white px-4 py-2 rounded-md mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-secondary text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-primary text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          <hr className="border-t-2 border-primary my-6" />
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <h3 className="text-xl font-bold">Report an Issue</h3>
            <select
              id="type"
              name="type"
              value={report.type}
              onChange={(e) => setReport({ ...report, type: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="device-anomaly">Device Anomaly</option>
              <option value="software-anomaly">Software Anomaly</option>
            </select>

            <input
              type="text"
              placeholder="Title"
              value={report.title}
              onChange={(e) => setReport({ ...report, title: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
            <textarea
              placeholder="Describe the issue"
              value={report.description}
              onChange={(e) =>
                setReport({ ...report, description: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              rows="4"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 rounded-md"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
