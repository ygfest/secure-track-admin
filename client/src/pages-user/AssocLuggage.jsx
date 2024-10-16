import React, { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import LuggageIcon from "../assets/green_marker.png";

const AssocLuggage = () => {
  const navigate = useNavigate();
  const [luggageInfo, setLuggageInfo] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [userId, setUserId] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentLuggage, setCurrentLuggage] = useState(null);

  useEffect(() => {
    Axios.defaults.withCredentials = true;
  }, []);

  console.log(userId);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await Axios.get(`${apiUrl}/auth/verify`, {
          withCredentials: true,
        });

        console.log("Verify token response:", response.data);

        if (!response.data.status || response.data.user.role !== "user") {
          navigate("/sign-in");
        } else {
          console.log("Authorized");
          setUserId(response.data.user.userID);
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
        const response = await Axios.get(`${apiUrl}/luggage-router/luggage`);
        setLuggageInfo(response.data);
        setFilteredData(response.data);
        setTotalItems(response.data.length);
      } catch (error) {
        console.log("error fetching luggage info", error);
      }
    }
    fetchLuggageInfo();
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

    const filtered = luggageInfo.filter((luggage) => {
      const user = usersData.find((user) => user._id === luggage.user_id);
      const fullName = user
        ? `${user.firstname.toLowerCase()} ${user.lastname.toLowerCase()}`
        : "";

      return (
        fullName.includes(searchTerm) ||
        (user && user.firstname.toLowerCase().includes(searchTerm)) ||
        (user && user.lastname.toLowerCase().includes(searchTerm)) ||
        luggage.luggage_custom_name.toLowerCase().includes(searchTerm) ||
        luggage.luggage_tag_number.toLowerCase().includes(searchTerm) ||
        luggage.status.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredData(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1);
  };

  const handleAddNew = async (luggageData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.post(
        `${apiUrl}/luggage-router/addluggage`,
        luggageData
      );
      setLuggageInfo((prev) => [...prev, response.data]);
      setFilteredData((prev) => [...prev, response.data]);
      setTotalItems((prev) => prev + 1);
      setShowAddModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding luggage", error);
    }
  };

  const handleUpdateLuggage = async (luggageData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.put(
        `${apiUrl}/luggage-router/updateluggage/${luggageData._id}`,
        luggageData
      );
      setLuggageInfo((prev) =>
        prev.map((item) =>
          item._id === luggageData._id ? response.data : item
        )
      );
      setFilteredData((prev) =>
        prev.map((item) =>
          item._id === luggageData._id ? response.data : item
        )
      );
      setShowUpdateModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating luggage", error);
    }
  };

  const handleDeleteLuggage = async (luggageId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await Axios.delete(`${apiUrl}/luggage-router/deleteluggage/${luggageId}`);
      setLuggageInfo((prev) => prev.filter((item) => item._id !== luggageId));
      setFilteredData((prev) => prev.filter((item) => item._id !== luggageId));
      setTotalItems((prev) => prev - 1);
      setShowDeleteModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting luggage", error);
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
    <div className="h-[100vh]">
      <div className="mt-5 ml-5 mr-5">
        <div className="flex justify-between mb-5">
          <button
            className="btn bg-[#5CC90C] text-white rounded-3xl"
            onClick={() => setShowAddModal(true)}
          >
            + Add New
          </button>

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
                  <th className="py-3 px-6 text-left">Luggage Name</th>
                  <th className="py-3 px-6 text-left">Associated with</th>
                  <th className="py-3 px-6 text-left">Location</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Action</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {paginatedData.map((luggage) => {
                  const user = usersData.find(
                    (user) => user._id === luggage.user_id
                  );
                  return (
                    <tr
                      key={luggage._id}
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
                              {luggage.luggage_custom_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {luggage.luggage_tag_number}
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
                          Owner
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left">
                        {luggage.currentLocation}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            luggage.status === "In Range"
                              ? "bg-green-100 text-green-800"
                              : luggage.status === "Out of Range"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {luggage.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <button
                          className="btn btn-sm btn-outline btn-primary mr-2"
                          onClick={() => {
                            setCurrentLuggage(luggage);
                            setShowUpdateModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline btn-danger"
                          onClick={() => {
                            setCurrentLuggage(luggage);
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

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 md:min-w-[30%] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Luggage</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddNew({
                  luggage_custom_name: e.target.luggage_custom_name.value,
                  luggage_tag_number: e.target.luggage_tag_number.value,
                  user_id: userId,
                });
                setShowAddModal(false);
              }}
            >
              <div className="form-control mb-4">
                <label className="label">Luggage Name</label>
                <input
                  name="luggage_custom_name"
                  type="text"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Tag Number</label>
                <input
                  name="luggage_tag_number"
                  type="text"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 md:min-w-[30%] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Update Luggage</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateLuggage({
                  _id: currentLuggage._id,
                  luggage_custom_name: e.target.luggage_custom_name.value,
                  luggage_tag_number: e.target.luggage_tag_number.value,
                  status: e.target.status.value,
                  user_id: userId,
                });
                setShowUpdateModal(false);
              }}
            >
              <div className="form-control mb-4">
                <label className="label">Luggage Name</label>
                <input
                  name="luggage_custom_name"
                  type="text"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={currentLuggage.luggage_custom_name}
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Tag Number</label>
                <input
                  name="luggage_tag_number"
                  type="text"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={currentLuggage.luggage_tag_number}
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Status</label>
                <input
                  name="status"
                  type="text"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={currentLuggage.status}
                  required
                  disabled
                />
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
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this luggage?</p>
            <div className="modal-action">
              <button
                className="btn btn-danger bg-red-500 text-white"
                onClick={() => {
                  handleDeleteLuggage(currentLuggage._id);
                  setShowDeleteModal(false);
                }}
              >
                Delete
              </button>
              <button className="btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssocLuggage;
