import React from "react";

const TokenExpirationAlert = ({ onOkClick }) => {
  return (
    <div
      role="alert"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
    >
      <div className="bg-white border border-black text-black shadow-lg rounded-lg p-4 max-w-[400px]">
        <div className="flex items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info stroke-current text-black mr-2 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3 className="font-bold">Your Token has Expired</h3>
            <div className="text-xs">
              Please log in again to continue using our app.
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="btn btn-sm bg-white text-black border-black hover:bg-black hover:text-white"
            onClick={onOkClick}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExpirationAlert;
