import React, { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import LuggageIcon from "../assets/green_marker.png";
import { toast, Toaster } from "sonner";

const UserManagement = () => {
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
  const [showModifyRole, setShowModifyRole] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [password, setPassword] = useState("");
  const [confimPassword, setConfirmPassword] = useState("");

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

  async function fetchUsersData() {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.get(`${apiUrl}/auth/users`, {
        withCredentials: true,
      });
      const dataJson = await response.data;
      setUsersData(dataJson);
      setFilteredData(dataJson);
      setTotalItems(dataJson.length);

      // Automatically update user status after fetching users
      dataJson.forEach((user) => {
        const status = getUserStatus(user.loggedInAt);
        updateUserStatus(user._id, status); // Pass user ID and status
      });
    } catch (error) {
      console.log("error fetching user data", error);
    }
  }

  async function fetchLuggageInfo() {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.get(
        `${apiUrl}/luggage-router/luggage-admin`
      );
      setLuggageInfo(response.data);
    } catch (error) {
      console.log("error fetching luggage info", error);
    }
  }

  useEffect(() => {
    fetchUsersData();
    fetchLuggageInfo();
  }, []);

  const getUserStatus = (loggedInAt) => {
    const currentTime = new Date();
    const lastLoggedInTime = new Date(loggedInAt);
    const timeDifference = (currentTime - lastLoggedInTime) / (1000 * 60); // difference in minutes

    if (timeDifference <= 60) {
      return "Active"; // Logged in within the last 1 hour
    } else if (timeDifference <= 1440) {
      return "Inactive"; // Logged in more than 1 hour but less than 24 hours
    } else {
      return "Offline"; // Logged in more than 24 hours ago
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.put(
        `${apiUrl}/auth/update-user-status/${userId}`,
        { status }
      );

      // Update local state after successful status update
      setUsersData((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, status } : user))
      );
      setFilteredData((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, status } : user))
      );
    } catch (error) {
      console.error("Error updating user status", error);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filtered = usersData.filter((user) => {
      const fullName = user
        ? `${user.firstname.toLowerCase()} ${user.lastname.toLowerCase()}`
        : "";

      return (
        fullName.includes(searchTerm) ||
        (user && user.firstname.toLowerCase().includes(searchTerm)) ||
        (user && user.lastname.toLowerCase().includes(searchTerm)) ||
        (user && user.role.toLowerCase().includes(searchTerm))
      );
    });

    setFilteredData(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1);
  };

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;

  const handleAddNew = async (userInfo) => {
    try {
      if (!userInfo.firstname) {
        toast.error("First name is required");
      } else if (!userInfo.lastname) {
        toast.error("Last name is required");
      }

      if (!userInfo.email) {
        toast.error("Email is required");
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Invalid email address");
      }

      if (!userInfo.password) {
        toast.error("Password is required");
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character";
      } else if (!userInfo.confimPassword) {
        toast.error("Confirm Password is required");
      } else if (userInfo.password !== userInfo.confirmedPassword) {
        toast.error("Passwords did not match. Please retry");
        return;
      }

      console.log("User info to add:", userInfo);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.post(
        `${apiUrl}/auth/admin-user-register`,
        userInfo
      );

      if (response.data.status === false) {
        toast.error("Error adding new user");
        return;
      }

      setUsersData((prev) => [...prev, response.data.user]);
      setFilteredData((prev) => [...prev, response.data.user]);
      setTotalItems((prev) => prev + 1);

      fetchUsersData();
      setShowAddModal(false);
      toast.success("Successfully added user");
    } catch (error) {
      console.error("Error adding user", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while adding the user"
      );
    }
  };

  const handleUpdateUser = async (userInfo) => {
    try {
      console.log(userInfo);
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.put(
        `${apiUrl}/auth/updateuser/${userInfo._id}`,
        userInfo
      );
      setUsersData((prev) =>
        prev.map((item) => (item._id === userInfo._id ? response.data : item))
      );
      setFilteredData((prev) =>
        prev.map((item) => (item._id === userInfo._id ? response.data : item))
      );
      if (response.data.status === false) {
        toast.error("Error updating user");
      }
      setShowUpdateModal(false);
      toast.success("Successfully updated");
    } catch (error) {
      console.error("Error updating user", error.response?.data || error);
      toast.error("Error updating user");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await Axios.delete(
        `${apiUrl}/auth/deleteuser/${userId}`
      );
      setUsersData((prev) => prev.filter((item) => item._id !== userId));
      setFilteredData((prev) => prev.filter((item) => item._id !== userId));
      setTotalItems((prev) => prev - 1);

      if (response.status === "false") {
        toast.error("Error deleting user");
      }
      setShowDeleteModal(false);
      toast.success("Successfully deleted user");
    } catch (error) {
      console.error("Error deleting luggage", error);
    }
  };

  const handleModifyRole = async (userInfo) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const updatedUser = { ...userInfo };

      const response = await Axios.put(
        `${apiUrl}/auth/modify-role/${userInfo.userId}`,
        updatedUser
      );

      // Ensure the API response is correctly structured
      if (!response.data || !response.data.role) {
        toast.error("Error modifying account role");
        return;
      }

      // Update local state with the new role
      setUsersData((prev) =>
        prev.map((user) =>
          user._id === userInfo._id
            ? { ...user, role: response.data.role }
            : user
        )
      );
      setFilteredData((prev) =>
        prev.map((user) =>
          user._id === userInfo._id
            ? { ...user, role: response.data.role }
            : user
        )
      );

      fetchUsersData();
      toast.success("Successfully modified account's role");
      setShowModifyRole(false);
    } catch (error) {
      console.error("Error modifying role", error.response?.data || error);
      toast.error("Error modifying account role");
    }
  };

  const paginationButtons = [];
  for (let i = 1; i <= Math.ceil(totalItems / 4); i++) {
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

  const itemsPerPage = 4;
  const totalItemsCount = filteredData.length;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItemsCount);

  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="h-full">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            margin: "5px 0",
          },
        }}
      />
      <div className="mt-5 ml-5 mr-5">
        <div className="flex justify-between mb-5 gap-4">
          <button
            className="btn bg-[#5CC90C] text-white rounded-3xl"
            onClick={() => setShowAddModal(true)}
          >
            + Add New
          </button>

          <div className="search-bar relative w-56">
            <input
              type="text"
              placeholder="Search here"
              value={searchTerm}
              onChange={handleSearch}
              className="input input-bordered rounded-3xl w-full pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Phone</th>
                  <th className="py-3 px-6 text-left">Role</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Action</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {paginatedData.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left">
                        <input type="checkbox" className="checkbox" />
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.profile_dp ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.profile_dp}
                                alt="Luggage"
                              />
                            ) : (
                              <div className="flex h-10 w-10 bg-zinc-400 rounded-full justify-center items-center text-lg text-white">
                                {user.firstname?.charAt(0).toUpperCase()}
                                {user.lastname?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4 min-w-[140px]">
                            <div className="text-sm font-medium text-gray-900 flex-nowrap">
                              {user.firstname} {user.lastname}
                            </div>
                            <span className="badge badge-ghost badge-sm flex-nowrap">
                              {luggageInfo.filter(
                                (luggage) => luggage.user_id === user._id
                              ).length +
                                " " +
                                "tracked luggage"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        {user.email}
                        <br />

                        <span className="badge badge-ghost badge-sm">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3 px-6 text-left">
                        {user.phone ? user.phone : "No phone number"}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <select
                          value={user.role}
                          onChange={async (e) => {
                            const updatedRole = e.target.value;
                            await handleModifyRole({
                              userId: user._id, // Pass the userId
                              role: updatedRole, // Pass the selected role
                            });
                          }}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            user.role === "user"
                              ? "bg-green-100 text-green-800"
                              : user.role === "admin"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            getUserStatus(user.loggedInAt) === "Active"
                              ? "bg-green-100 text-green-800"
                              : getUserStatus(user.loggedInAt) === "Inactive"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {getUserStatus(user.loggedInAt)}{" "}
                          {/* Display Active, Inactive, or Offline */}
                        </div>
                      </td>

                      <td className="py-3 px-6 text-left">
                        <div className="flex flex-col md:flex-row gap-2 md:gap-0">
                          <button
                            className="btn btn-sm btn-outline btn-primary mr-2 w-full md:max-w-16"
                            onClick={() => {
                              setCurrentUser(user);
                              setShowUpdateModal(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline btn-danger w-full md:max-w-16"
                            onClick={() => {
                              setCurrentUser(user);
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
            <h3 className="text-xl font-semibold mb-4">Add New User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddNew({
                  firstname: e.target.firstname.value,
                  lastname: e.target.lastname.value,
                  email: e.target.email.value,
                  password: e.target.password.value,
                  confirmedPassword: e.target.confirmed_password.value,
                });
                setShowAddModal(false);
              }}
            >
              <div className="form-control mb-4">
                <label className="label">First Name</label>
                <input
                  name="firstname"
                  type="text"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Last Name</label>
                <input
                  name="lastname"
                  type="text"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Confirm Password</label>
                <input
                  name="confirmed_password"
                  type="password"
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
          <div className="bg-white p-6 w-[80%] md:w-[30%] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser({
                  _id: currentUser._id,
                  firstname: e.target.firstname.value,
                  lastname: e.target.lastname.value,
                  email: e.target.email.value,
                  phone: e.target.phone.value,
                });
                setShowUpdateModal(false);
              }}
            >
              <div className="form-control mb-4">
                <label className="label"> Firstname</label>
                <input
                  name="firstname"
                  type="text"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={currentUser.firstname}
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Lastname</label>
                <input
                  name="lastname"
                  type="text"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={currentUser.lastname}
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={currentUser.email}
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">Phone Number</label>
                <input
                  name="phone"
                  type="text"
                  placeholder="Add the owner's phone"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={currentUser.phone}
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
          <div className="bg-white p-6 w-[80%] md:w-[30%] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-action">
              <button
                className="btn btn-danger bg-red-500 text-white"
                onClick={() => {
                  handleDeleteUser(currentUser._id);
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

export default UserManagement;
