import { useEffect, useState } from "react";
import LuggageIcon from "../../assets/green_marker.png";
import { toast } from "sonner";
import axiosInstance from "../../utils/axiosInstance";
import { useAdminDataContext } from "../../context/AdminDataContext";
import SearchBar from "../../components/SearchBar";

const AdminAssocLuggage = () => {
  const [luggageInfo, setLuggageInfo] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentLuggage, setCurrentLuggage] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");

  const { usersData } = useAdminDataContext();

  useEffect(() => {
    async function fetchLuggageInfo() {
      try {
        const response = await axiosInstance.get(
          "/luggage-router/luggage-admin"
        );
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
  }, []);

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
        luggage.status.toLowerCase().includes(searchTerm) ||
        luggage.currentLocation.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredData(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1);
  };

  const user = usersData.find((user) => user._id === currentLuggage?.user_id);
  const userId = user?._id;

  const ownerName = user?.firstname + " " + user?.lastname;

  const handleAddNew = async (luggageData) => {
    try {
      const response = await axiosInstance.post(
        "/luggage-router/addluggage",
        luggageData
      );
      setLuggageInfo((prev) => [...prev, response.data]);
      setFilteredData((prev) => [...prev, response.data]);
      setTotalItems((prev) => prev + 1);
      setShowAddModal(false);
      toast.success("Luggage added successfully");
      //window.location.reload();
    } catch (error) {
      console.error("Error adding luggage", error);
    }
  };

  const handleUpdateLuggage = async (luggageData) => {
    try {
      const response = await axiosInstance.put(
        `/luggage-router/updateluggage/${luggageData._id}`,
        { ...luggageData, user_id: selectedUserId } // Include selected user
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
      toast.success("Luggage updated successfully");
      //window.location.reload();
    } catch (error) {
      console.error("Error updating luggage", error);
    }
  };

  const handleDeleteData = async (luggageTagNumber) => {
    try {
      const response = await axiosInstance.delete(
        `/luggage-router/delete-tracking-data/${luggageTagNumber}`
      );
      if (response.data.status === false) {
        console.error("Error deleting luggage data");
      } else {
        toast.success("Successfully deleted all tracking data");
      }
    } catch (error) {
      console.error("Error deleting luggage data:", error);
      toast.error("Error deleting luggage data");
    }
  };

  const handleDeleteLuggage = async (luggageId) => {
    try {
      await axiosInstance.delete(`/luggage-router/deleteluggage/${luggageId}`);
      setLuggageInfo((prev) => prev.filter((item) => item._id !== luggageId));
      setFilteredData((prev) => prev.filter((item) => item._id !== luggageId));
      setTotalItems((prev) => prev - 1);
      setShowDeleteModal(false);
      toast.success("Luggage deleted successfully");
      //window.location.reload();
    } catch (error) {
      console.error("Error deleting luggage", error);
    }
  };

  const paginationButtons = [];
  for (let i = 1; i <= Math.ceil(totalItems / 5); i++) {
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

  const itemsPerPage = 5;
  const totalItemsCount = filteredData.length;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItemsCount);

  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="h-full">
      <div className="mt-5 ml-5 mr-5">
        <div className="flex justify-between mb-5 gap-4">
          <button
            className="btn bg-[#5CC90C] text-white rounded-3xl"
            onClick={() => setShowAddModal(true)}
          >
            + Add New
          </button>
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
                          className={`inline-flex justify-center items-center px-2 py-0.5 rounded text-xs font-medium flex-nowrap ${
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
                        <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                          <button
                            className="btn  w-full md:max-w-16 btn-sm btn-outline btn-primary hover:text-white mr-2"
                            onClick={() => {
                              setCurrentLuggage(luggage);
                              setShowUpdateModal(true);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="btn  w-full md:max-w-16 btn-sm btn-outline btn-danger"
                            onClick={() => {
                              setCurrentLuggage(luggage);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </button>
                        </div>
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
          <div className="bg-white p-6 w-[80%] md:w-[30%] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Luggage</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddNew({
                  luggage_custom_name: e.target.luggage_custom_name.value,
                  luggage_tag_number: e.target.luggage_tag_number.value,
                  user_id: selectedUserId || "",
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
              <div className="form-control mb-4">
                <label className="label">Owner (User)</label>
                <select
                  value={selectedUserId || ""}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="select select-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="" disabled>
                    Select owner
                  </option>
                  {usersData.length === 0 ? (
                    <option value="" disabled>
                      No users found
                    </option>
                  ) : (
                    usersData.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstname} {user.lastname}
                      </option>
                    ))
                  )}
                </select>
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
          <div className="bg-white p-6 w-[80%] md:w-[30%] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Update Luggage</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateLuggage({
                  _id: currentLuggage._id,
                  luggage_custom_name: e.target.luggage_custom_name.value,
                  luggage_tag_number: e.target.luggage_tag_number.value,
                  status: e.target.status.value,
                  user_id: selectedUserId || "",
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
                <label className="label">Owner (User)</label>
                <select
                  value={selectedUserId || ""}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="select select-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" disabled>
                    {currentLuggage.user_id
                      ? usersData.find(
                          (user) => user._id === currentLuggage.user_id
                        )
                        ? `${
                            usersData.find(
                              (user) => user._id === currentLuggage.user_id
                            )?.firstname || "Select"
                          } ${
                            usersData.find(
                              (user) => user._id === currentLuggage.user_id
                            )?.lastname || "Owner"
                          }`
                        : "Select owner"
                      : "Select owner"}
                  </option>
                  {usersData.length === 0 && (
                    <option value="" disabled>
                      No users found
                    </option>
                  )}
                  {usersData.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.firstname || "Unknown"} {user.lastname || "Owner"}
                    </option>
                  ))}
                </select>
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

              <div className="flex flex-col gap-2">
                <div className="flex">
                  <button
                    className="btn w-full bg-red-500 text-white"
                    onClick={() =>
                      handleDeleteData(currentLuggage.luggage_tag_number)
                    }
                  >
                    Erase tracking data
                  </button>
                </div>
                <div className="flex flex-row gap-2 w-full">
                  <button type="submit" className="btn btn-primary w-1/2">
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn w-1/2"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 w-[80%] md:w-[30%] rounded-lg shadow-lg">
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

export default AdminAssocLuggage;
