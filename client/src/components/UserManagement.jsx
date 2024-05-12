import React, { useState, useEffect } from "react";
import "../App.css";
import NavigationBar from "./NavigationBar";

const UserManagement = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchUsersData() {
      try {
        const data = await fetch("http://localhost:3000/users");
        const dataJson = await data.json();
        setUsersData(dataJson);
        setFilteredData(dataJson); // Initially set filtered data to all datap
        setTotalItems(dataJson.length); // Initially set total items count
      } catch (error) {
        console.log("error fetching data", error);
      }
    }

    fetchUsersData();
  }, []);

  // Helper function to filter data based on search term
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = usersData.filter((user) => {
      const fullName =
        user.first_name.toLowerCase() + " " + user.last_name.toLowerCase();
      return (
        fullName.includes(searchTerm) ||
        user.first_name.toLowerCase().includes(searchTerm) ||
        user.last_name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
        // Add more search criteria as needed
      );
    });
    setFilteredData(filtered);
    setTotalItems(filtered.length); // Update total items count after filtering
    setCurrentPage(1); // Reset current page to 1 after filtering
  };

  // Helper function to get status color
  function getStatusColor(status) {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "yellow";
      case "suspended":
        return "red";
      default:
        return "gray";
    }
  }

  // Helper function to get status text
  function getStatusText(status) {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "suspended":
        return "Suspended";
      default:
        return "Unknown";
    }
  }

  // Pagination buttons
  const paginationButtons = [];
  for (let i = 1; i <= Math.ceil(totalItems / 5); i++) {
    paginationButtons.push(
      <button
        key={i}
        className={`join-item btn ${currentPage === i ? "btn-active" : ""}`}
        onClick={() => setCurrentPage(i)}
        disabled={i > Math.ceil(totalItems / 5)}
      >
        {i}
      </button>
    );
  }

  // Pagination section
  const paginationSection = (
    <div className="flex justify-end pt-2">
      <div className="join">{paginationButtons}</div>
    </div>
  );

  // Pagination logic to slice data for current page
  const itemsPerPage = 5; // Set items per page
  const totalItemsCount = filteredData.length; // Total filtered items count

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItemsCount); // Ensure endIndex doesn't exceed totalItemsCount

  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <>
      <NavigationBar />
      <div className="mt-5 ml-5 mr-5">
        <div className="flex justify-between mb-5 ">
          <button className="btn bg-red-500 hover:bg-red-700 text-white rounded-3xl">
            + Add New
          </button>

          <div className="search-bar relative">
            <input
              type="text"
              placeholder="Search here"
              value={searchTerm}
              onChange={handleSearch}
              className="input input-bordered rounded-3xl pr-10"
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

        <div className="card bg-base-100 card-bordered rounded-lg">
          <div className="overflow-x-auto">
            <table className="table">
              {/* Table headers */}
              <thead>
                <tr>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th></th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {paginatedData.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src="https://img.daisyui.com/tailwind-css-component-profile-2@56w.png"
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            <span>
                              {user.first_name} {user.last_name}
                            </span>
                          </div>
                          <div className="text-sm opacity-50">
                            {user.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {user.email}
                      <br />
                      <span className="badge badge-ghost badge-sm">
                        Proponent
                      </span>
                    </td>
                    <td>{user.phone_number}</td>
                    <td>
                      <button
                        className={`btn btn-outline btn-xs ${
                          user.role === "admin" ? "btn-info" : "btn-success"
                        }`}
                      >
                        {user.role}
                      </button>
                    </td>
                    <td>
                      <div
                        className={`text-md ${
                          user.status === "active"
                            ? "text-green-400"
                            : user.status === "inactive"
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      >
                        <span>&#8226;</span>
                        <span>
                          {user.status !== null ? user.status : "Unavailable"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-primary">Update</button>
                      <button className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Table footer */}
              <tfoot>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        {/* Pagination */}
        {/* Pagination and Showing data count */}
        <div className="flex justify-between mt-2 ml-2 mr-2">
          {/* Showing data count */}
          <div className="text-sm text-gray-500">
            Showing {paginatedData.length} from {totalItems} data
          </div>
          {/* Pagination */}
          {paginationSection}
        </div>
      </div>
    </>
  );
};

export default UserManagement;
