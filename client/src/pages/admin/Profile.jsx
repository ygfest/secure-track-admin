import { useState } from "react";
import { useUserData } from "../../context/UserContext";

const AdminProfile = () => {
  const [userProfile, setUserProfile] = useState({
    bio: "",
    backgroundImage: "",
  });

  const {
    profileDp,
    profileFirstName,
    profileLastName,
    profileEmail,
    profileCreatedAt,
  } = useUserData();

  const getSocialUsername = (url) =>
    new URL(url).pathname.split("").slice(1).join("");

  return (
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
            {profileDp ? (
              <img
                src={profileDp}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xl border-4 border-white">
                {profileFirstName.charAt(0).toUpperCase()}
                {profileLastName.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-2xl font-bold text-start">
            {profileFirstName} {profileLastName} (Admin/Developer)
          </h2>
          <p className="text-sm text-start">
            {profileEmail} • Joined{" "}
            {new Date(profileCreatedAt).toLocaleDateString()}
          </p>
        </div>
        <hr className="border-t-2 border-primary my-6" />
      </div>
    </div>
  );
};

export default AdminProfile;
