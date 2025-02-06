import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { toast } from "sonner";
import { ImSpinner2 } from "react-icons/im";
import { useUserData } from "../context/UserContext";
import { useUserNotif } from "../context/UserNotifContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    bio: "",
    backgroundImage: "",
  });

  const [report, setReport] = useState({
    type: "device-anomaly",
    title: "",
    description: "",
    luggageId: "",
  });

  const {
    userId,
    profileEmail,
    profileFirstName,
    profileLastName,
    profileDp,
    userRole,
    profileCreatedAt,
  } = useUserData();
  const { luggageInfo } = useUserNotif();
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReport(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const reportData = { ...report, userId: userId };
      const response = await Axios.post(
        `${apiUrl}/auth/user-report`,
        reportData
      );
      if (response.status !== 201) {
        toast.error("Error submitting report");
      } else {
        toast.success("Report submitted successfully");
        setReport({
          type: "device-anomaly",
          title: "",
          description: "",
          luggageId: "",
        });
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Error submitting report");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center mx-4 py-6 pb-24 md:pb-8 bg-gray-100">
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
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-2xl border-4 border-white">
                {profileFirstName?.charAt(0).toUpperCase() +
                  "" +
                  profileLastName?.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-2xl font-bold text-start">
            {profileFirstName} {profileLastName}
          </h2>
          <p className="text-sm text-start">
            {profileEmail} • Joined{" "}
            {new Date(profileCreatedAt).toLocaleDateString()}
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => navigate("/user/profile/edit")}
              className="rounded-full p-2 bg-gray-300"
            >
              <FiSettings className="text-lg" />
            </button>
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
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          {report.type === "device-anomaly" && (
            <select
              id="luggageId"
              name="luggageId"
              value={report.luggageId || ""}
              onChange={(e) =>
                setReport({ ...report, luggageId: e.target.value })
              }
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="" disabled>
                Select Luggage
              </option>
              {luggageInfo.map((luggage) => (
                <option key={luggage._id} value={luggage._id}>
                  {luggage.luggage_tag_number}
                </option>
              ))}
            </select>
          )}

          <textarea
            placeholder="Describe the issue"
            value={report.description}
            onChange={(e) =>
              setReport({ ...report, description: e.target.value })
            }
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            rows="4"
            required
          ></textarea>

          <button
            type="submit"
            disabled={isSubmittingReport}
            className="w-full bg-secondary text-white py-2 rounded-md flex items-center justify-center"
          >
            {isSubmittingReport ? (
              <ImSpinner2 className="animate-spin text-2xl text-white" />
            ) : (
              "Submit Report"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
