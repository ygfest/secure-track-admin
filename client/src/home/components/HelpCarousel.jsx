import { useState } from "react";
import { FiHelpCircle } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { MdNavigateNext } from "react-icons/md";

function HelpCarousel() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleHelpModal = () => setShowHelpModal(!showHelpModal);

  return (
    <>
      <button
        onClick={toggleHelpModal}
        className="fixed bottom-4 right-4 bg-gray-100 bg-opacity-50 backdrop-blur-md rounded-full p-3 shadow-lg hover:bg-gray-200 transition-all"
      >
        <FiHelpCircle className="text-secondary text-2xl" />
      </button>
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white bg-opacity-90 backdrop-blur-lg rounded-lg shadow-xl p-6 w-[90%] max-w-lg">
            <button
              onClick={toggleHelpModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              ×
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-secondary mb-4">
                Help | Users Guide
              </h2>
              <p className="text-gray-600">Slide {currentSlide + 1} of 4</p>
            </div>

            {/* Carousel Sections */}
            {currentSlide === 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Dashboard Overview
                </h3>
                <p className="text-gray-700 mb-2">
                  Get started with your SecureTrack Dashboard. This section
                  helps you navigate the application, view important data, and
                  understand what you can do within the platform.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    Navigate between different pages and see real-time data.
                  </li>
                  <li>
                    Analyze luggage data like temperature, geofence status, and
                    recent events.
                  </li>
                  <li>Map view shows luggage location and status insights.</li>
                </ul>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Live Tracking
                </h3>
                <p className="text-gray-700 mb-2">
                  The Live Tracking feature displays a map with your current
                  location, luggage location, and the geofence boundary.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    Toggle your location visibility to view live user and
                    luggage positions.
                  </li>
                  <li>
                    Luggage markers and user markers show the exact positions on
                    the map.
                  </li>
                  <li>
                    View geofence boundaries in green; status indicators
                    include:
                    <ul className="list-disc pl-5">
                      <li>
                        <strong>In Range:</strong> luggage is within the
                        boundary.
                      </li>
                      <li>
                        <strong>Out of Range:</strong> luggage is outside the
                        boundary.
                      </li>
                      <li>
                        <strong>Out of Coverage:</strong> no recent location
                        updates.
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            )}

            {currentSlide === 2 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  My Luggage
                </h3>
                <p className="text-gray-700 mb-2">
                  Manage all your registered luggage here. You can add, update,
                  delete, or search for specific luggage.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    View each luggage’s name, tag number, owner, location, and
                    geofence status.
                  </li>
                  <li>Use search to find luggage quickly.</li>
                  <li>
                    Options include adding luggage, updating details, erasing
                    tracking data, and deleting records.
                  </li>
                </ul>
              </div>
            )}

            {currentSlide === 3 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Profile & Settings
                </h3>
                <p className="text-gray-700 mb-2">
                  Access and manage your profile information, report issues, and
                  adjust settings here.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    View profile details including your name and registration
                    date.
                  </li>
                  <li>
                    Report device or software anomalies, with updates on report
                    statuses.
                  </li>
                  <li>
                    Edit personal details, reset password, or delete your
                    account permanently.
                  </li>
                </ul>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentSlide(currentSlide - 1)}
                className={`flex items-center ${
                  currentSlide === 0 ? "text-gray-300" : "text-primary"
                }`}
                disabled={currentSlide === 0}
              >
                <span className="mr-1">
                  <MdNavigateNext className="rotate-180" />
                </span>{" "}
                Previous
              </button>

              <button
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className={`flex items-center ${
                  currentSlide === 3 ? "text-gray-300" : "text-primary"
                }`}
                disabled={currentSlide === 3}
              >
                Next{" "}
                <span className="ml-1">
                  <MdNavigateNext />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HelpCarousel;
