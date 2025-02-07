import React from "react";

function SearchBar({ searchTerm, handleSearch }) {
  return (
    <div className="search-bar relative w-56">
      <input
        type="text"
        placeholder="Search here"
        value={searchTerm}
        onChange={handleSearch}
        className="input input-bordered w-full rounded-3xl pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
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
  );
}

export default SearchBar;
