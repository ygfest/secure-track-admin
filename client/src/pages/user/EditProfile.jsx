import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CiCamera } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { FiSettings } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdOutlineShareLocation } from "react-icons/md";
import { useUserData } from "../../context/UserContext";

const EditProfile = ({ userProfile }) => {
  const navigate = useNavigate();

  const {
    userId,
    profileEmail,
    profileFirstName,
    setProfileFirstName,
    profileLastName,
    setProfileLastName,
    profileDp,
    setProfileDp,
    profilePhone,
    setProfilePhone,
    userRole,
    profileCreatedAt,
    isLocationOn,
    radius,
    setRadius,
  } = useUserData();
  const [profileData, setProfileData] = useState({
    bio: "",
    backgroundImage: "",
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
  const [currentRadius, setCurrentRadius] = useState(
    profileData.geofenceRadius
  );

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const editedProfileData = {
      userId: userId,
      firstname: profileFirstName,
      lastname: profileLastName,
      phone: profilePhone,
      profile_dp: newProfilePhoto || profileDp || "",
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await Axios.put(`${apiUrl}/auth/edit-profile`, editedProfileData, {
        headers: { "Content-Type": "application/json" },
      });
      setProfileDp(newProfilePhoto || profileDp || "");
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
        userId: userId,
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
    setProfileDp("");
    setNewProfilePhoto(null);
  };

  const handleDeleteAccount = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      await Axios.delete(`${apiUrl}/auth/deleteuser/${userId}`, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Account deleted successfully");
      navigate("/sign-in");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Error deleting account");
    }
  };

  const handleSelectRadius = async (event) => {
    event.preventDefault();

    const apiUrl = import.meta.env.VITE_API_URL;
    const selectedRadius = event.target.elements.geofenceRadius.value; // Get selected radius

    try {
      await Axios.put(
        `${apiUrl}/auth/select-radius/${userId}`,
        { radius: selectedRadius }, // Send radius in request body
        { headers: { "Content-Type": "application/json" } }
      );
      setRadius(selectedRadius);
      toast.success("Updated the geofence range successfully");
    } catch (error) {
      console.error("Error changing geofence range:", error);
      toast.error("Error changing geofence range");
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
        setNewProfilePhoto(response.data.url);
        toast.success("Profile photo uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 mx-4 pb-24 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <form className="space-y-4" onSubmit={handleUpdateProfile}>
          <h3 className="text-xl font-bold">Edit Profile</h3>
          <div className="mx-auto mb-4 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-white flex z-[20] items-center justify-center text-3xl text-gray-600 font-bold border-2 border-gray-600 relative hover:bg-zinc-100 transition-all">
              {profileDp || newProfilePhoto ? (
                <>
                  <img
                    src={newProfilePhoto || profileDp}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full"
                  />
                  <button
                    className="btn-ghost absolute rounded-full bg-zinc-50 p-1 -right-3 top-0 z-20 text-[1.3rem]"
                    onClick={handleRemovePhoto}
                  >
                    <IoClose />
                  </button>
                </>
              ) : (
                <CiCamera className="text-gray-600" />
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
            value={profileFirstName}
            onChange={(e) => setProfileFirstName(e.target.value)}
            placeholder="First Name"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={profileLastName}
            onChange={(e) => setProfileLastName(e.target.value)}
            placeholder="Last Name"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={profilePhone}
            onChange={(e) => setProfilePhone(e.target.value)}
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
        <form onSubmit={handleSelectRadius}>
          <label className="text-lg mb-4 block">
            Change Radius of the Geofence
          </label>
          <select
            name="geofenceRadius"
            className="mb-4 p-2 border rounded-md w-full"
            required
            defaultValue={radius} // Initially selected value
          >
            <option value={radius} disabled>
              {`${radius} meters (Currently selected)`}
            </option>
            {[
              {
                value: 20,
                label: "20 meters (Baggage carousel or security checkpoint)",
              },
              {
                value: 50,
                label: "50 meters (Terminal gate area or lounge)",
              },
              { value: 100, label: "100 meters (Airport terminal zone)" },
              {
                value: 300,
                label: "300 meters (Parking area or drop-off zone)",
              },
              {
                value: 500,
                label: "500 meters (Entire airport terminal coverage)",
              },
              {
                value: 1000,
                label: "1000 meters (Large airport area or transport hubs)",
              },
            ]
              .filter((option) => option.value !== radius)
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>

          <div className="flex justify-center">
            <button
              type="submit"
              className="flex items-center gap-2 text-primary bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-200 transition-all"
            >
              <MdOutlineShareLocation />
              Select this Range
            </button>
          </div>
        </form>
      </div>

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
  );
};

export default EditProfile;
