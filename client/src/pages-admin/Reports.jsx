import React, { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import LuggageIcon from "../assets/green_marker.png";
import { toast, Toaster } from "sonner";

const AdminReports = () => {
  const navigate = useNavigate();
  const [luggageInfo, setLuggageInfo] = useState([]);
  const [luggageInfos, setLuggageInfos] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [reportsData, setReportsData] = useState([]);

  useEffect(() => {
    Axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await Axios.get(`${apiUrl}/auth/verify`, {
          withCredentials: true,
        });

        console.log("Verify token response:", response.data);

        if (!response.data.status || response.data.user.role !== "admin") {
          navigate("/sign-in");
        } else {
          console.log("Authorized");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        navigate("/sign-in");
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    async function fetchUsersData() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const data = await Axios.get(`${apiUrl}/auth/users`);
        setUsersData(data.data);
      } catch (error) {
        console.log("error fetching user data", error);
      }
    }

    fetchUsersData();
  }, []);

  useEffect(() => {
    async function fetchLuggageInfo() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await Axios.get(
          `${apiUrl}/luggage-router/luggage-admin`
        );
        setLuggageInfos(response.data);
      } catch (error) {
        console.log("error fetching luggage info", error);
      }
    }
    fetchLuggageInfo();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await Axios.get(`${apiUrl}/auth/reports`);
        setReportsData(response.data);
        setFilteredData(response.data);
        setTotalItems(response.data.length);
      } catch (error) {
        console.error("Error fetching reorts:", reports);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const fetchCurrentLocations = async () => {
      try {
        const updatedLuggageDeets = await Promise.all(
          luggageInfo.map(async (luggageLoc) => {
            const response = await fetch(
              `https://photon.komoot.io/reverse?lat=${luggageLoc.latitude}&lon=${luggageLoc.longitude}`
            );
            if (response.ok) {
              const data = await response.json();
              if (data.features.length > 0) {
                const properties = data.features[0].properties;
                const locationName = `${properties.name}, ${properties.city} City`;
                return { ...luggageLoc, currentLocation: locationName };
              }
            }
            return { ...luggageLoc, currentLocation: "Unknown Location" };
          })
        );
        setLuggageInfo(updatedLuggageDeets);
        setFilteredData(updatedLuggageDeets);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    if (luggageInfo.length > 0) {
      fetchCurrentLocations();
    }
  }, [luggageInfo]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filtered = reportsData.filter((report) => {
      const user = usersData.find((user) => user._id === report.userId);
      const fullName = user
        ? `${user.firstname.toLowerCase()} ${user.lastname.toLowerCase()}`
        : "";

      return (
        fullName.includes(searchTerm) ||
        (user && user.firstname.toLowerCase().includes(searchTerm)) ||
        (user && user.lastname.toLowerCase().includes(searchTerm)) ||
        report.type.toLowerCase().includes(searchTerm) ||
        report.title.toLowerCase().includes(searchTerm) ||
        report.description.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredData(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1);
  };

  const user = usersData.find((user) => user._id === currentReport?.user_id);
  const userId = user?._id;
  console.log(userId);

  const handleResolve = async (reportId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await Axios.put(`${apiUrl}/auth/resolve-reports/${reportId}`, {
        status: "Resolved",
      });
      const updatedReports = filteredData.map((report) =>
        report._id === reportId ? { ...report, status: "Resolved" } : report
      );
      setFilteredData(updatedReports);
    } catch (error) {
      console.error("Error resolving the report", error);
    }
  };

  const handleUpdateReport = async (reportData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.put(
        `${apiUrl}/auth/update-reports/${reportData._id}`,
        reportData
      );
      setLuggageInfo((prev) =>
        prev.map((item) => (item._id === reportData._id ? response.data : item))
      );
      setFilteredData((prev) =>
        prev.map((item) => (item._id === reportData._id ? response.data : item))
      );
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating luggage", error);
    }
  };

  const handleDeleteReport = async (reportData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.delete(
        `${apiUrl}/auth/delete-report/${reportData._id}`
      );

      // Check if the deletion was successful based on the response
      if (response.status === 200) {
        // Remove the deleted report from the filtered data
        const updatedFilteredData = filteredData.filter(
          (report) => report._id !== reportData._id
        );

        // Update the state with the new filtered data
        setFilteredData(updatedFilteredData);
        setTotalItems(updatedFilteredData.length); // Update total items

        toast.success("Successfully deleted the report");
      } else {
        toast.error("Error deleting report");
      }

      setShowDeleteModal(false); // Close the delete modal
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Error deleting report");
    }
  };

  const paginationButtons = [];
  for (let i = 1; i <= Math.ceil(totalItems / 6); i++) {
    paginationButtons.push(
      <button
        key={i}
        className={`join-item btn ${currentPage === i ? "btn-active" : ""}`}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </button>
    );
  }

  const paginationSection = (
    <div className="flex justify-end pt-2">
      <div className="join">{paginationButtons}</div>
    </div>
  );

  const itemsPerPage = 6;
  const totalItemsCount = filteredData.length;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItemsCount);

  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="h-full">
      <Toaster position="top-right" />
      <div className="mt-5 ml-5 mr-5">
        <div className="flex justify-end mb-5">
          <div className="search-bar relative">
            <input
              type="text"
              placeholder="Search here"
              value={searchTerm}
              onChange={handleSearch}
              className="input input-bordered rounded-3xl pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m4-6a8 8 0 11-16 0 8 8 0 0116 0z"
              />
            </svg>
          </div>
        </div>

        <div className="card bg-white shadow-md rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">
                    <input type="checkbox" className="checkbox" />
                  </th>
                  <th className="py-3 px-6 text-left">Report Type</th>
                  <th className="py-3 px-6 text-left">Reporter Name</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Action</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {paginatedData.map((report) => {
                  const user = usersData.find(
                    (user) => user._id === report.userId
                  );
                  return (
                    <tr
                      key={report._id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left">
                        <input type="checkbox" className="checkbox" />
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={LuggageIcon}
                              alt="Luggage"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {report.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {report.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        {user
                          ? `${user.firstname} ${user.lastname}`
                          : "Unknown User"}
                        <br />
                        <span className="badge badge-ghost badge-sm">
                          {luggageInfos.find(
                            (luggage) => luggage._id === report.luggageId
                          )?.luggage_tag_number || "Reporter"}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left">
                        {report.description}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            report.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : report.status === "Resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <button
                          className="btn btn-sm btn-primary btn-danger"
                          onClick={() => {
                            setCurrentReport(report);
                            setShowUpdateModal(true);
                          }}
                        >
                          Update Status
                        </button>
                        <button
                          className="btn btn-sm btn-outline btn-danger hover:text-white mr-2"
                          onClick={() => {
                            setCurrentReport(report);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between mt-2 ml-2 mr-2">
          <div className="text-sm text-gray-500">
            Showing {paginatedData.length} from {totalItems} data
          </div>
          {paginationSection}
        </div>
      </div>

      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 md:min-w-[30%] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Update Status</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const status = e.target.status.value;
                handleUpdateReport({
                  _id: currentReport._id,
                  status,
                });
                setShowUpdateModal(false);
              }}
            >
              <div className="form-control mb-4">
                <label className="label">Report Title</label>
                <input
                  name="report_title"
                  type="text"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={currentReport.title}
                  disabled
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Report Type</label>
                <input
                  name="luggage_tag_number"
                  type="text"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={currentReport.type}
                  disabled
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Reported by</label>
                <input
                  name="reporter_name"
                  type="text"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={
                    usersData.find((user) => user._id === currentReport.userId)
                      .firstname +
                    " " +
                    usersData.find((user) => user._id === currentReport.userId)
                      .lastname
                  }
                  required
                  disabled
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Status</label>
                <select
                  name="status"
                  className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={currentReport.status}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 md:min-w-[30%] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Delete Report Permanently
            </h3>
            <p>Are you sure you want to delete this report?</p>
            <div className="modal-action gap-2">
              <button className="btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-danger bg-red-500 text-white"
                onClick={() => handleDeleteReport(currentReport)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
