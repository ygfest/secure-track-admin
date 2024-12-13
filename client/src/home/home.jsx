import { useEffect, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { SiVite } from "react-icons/si";
import { FiHelpCircle } from "react-icons/fi";
import { MdNavigateNext } from "react-icons/md";

export default function Home() {
  // Initialize an array of refs for each card.
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const cardsRef = useRef([]);

  // Apply fade-in animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.3 }
    );

    // Ensure all refs are elements before observing
    cardsRef.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) {
          observer.unobserve(card);
        }
      });
    };
  }, []); // Empty dependency array ensures it runs only once on mount.

  const toggleHelpModal = () => setShowHelpModal(!showHelpModal);

  return (
    <main className="bg-white font-poppins">
      {/* Hero Section */}
      <section className="relative flex h-[80vh] w-full items-center justify-center min-w-[400px]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#8f00ff,transparent_1px),linear-gradient(to_bottom,#8f00ff,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_0%,#000_80%,transparent_110%)]" />
        <nav className="fixed left-1/2 top-4 z-40 w-[90%] max-w-[1200px] -translate-x-1/2 rounded-3xl border-2 border-[#42393962] px-4 py-3 backdrop-blur-sm backdrop-saturate-150 bg-white md:px-8 md:py-4">
          <header className="flex w-full items-center justify-between">
            <img src="/st-logo.png" alt="logo" width={120} height={35} />
            <div className="flex gap-1 md:gap-4 items-center">
              <Link to="/sign-up">
                <button className="hidden md:inline p-2 text-sm md:text-base font-medium text-white bg-primary hover:bg-zinc-600 rounded-lg min-w-[150px] md:min-w-[120px] flex-nowrap">
                  Find My Way
                </button>
                <button className="md:hidden p-2 text-sm md:text-base font-medium text-white bg-secondary hover:bg-zinc-600 rounded-lg min-w-[120px] md:min-w-[120px] flex-nowrap">
                  Create account
                </button>
              </Link>
            </div>
          </header>
        </nav>
        <div className="z-30 w-[90%] max-w-[1200px] pt-4">
          <h1 className="text-center text-[2.3rem] font-bold leading-tight md:text-[3.2rem] md:leading-none lg:text-[4rem] 2xl:text-[4.5rem]">
            <span className="text-black">
              Your Ultimate Guide to Navigating
            </span>
            <br />
            <span
              className="bg-gradient-to-b from-[#8f00ff] to-[#6a0dad]
 bg-clip-text text-transparent"
            >
              NAIA Terminal 1, Effortlessly.
            </span>
          </h1>
        </div>
      </section>

      {/*<section className="relative mt-36 flex flex-col items-center min-w-[400px]">
        <p>Logos...</p>
        <div className="h-[32px] w-full flex justify-center">
          <img src="/ST-logo-with-name.png" className="h-full" />
        </div>
      </section>*/}

      {/* Flow of Cards Section */}
      <section className="relative mt-36 flex flex-col items-center min-w-[400px]">
        <div className="w-[90%] max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Card 1 - Real-time Location Tracking */}
          <div
            ref={(el) => (cardsRef.current[0] = el)}
            className="relative flex flex-col items-center p-8 rounded-3xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] self-start transform -translate-y-12 h-[540px] md:mt-[60px]"
          >
            <div className="w-full flex justify-center items-center mb-6">
              <img
                src="/location.svg"
                alt="Real-time Location Tracking"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-start">
              <h3 className="text-2xl font-semibold text-secondary">
                Real-time Location Tracking
              </h3>
              <p className="text-base text-gray-600">
                Never lose sight of your belongings. SecureTrack’s advanced GPS
                tracking keeps you updated on your luggage’s exact location,
                whether it’s en route to your destination or waiting at the
                terminal.
              </p>
            </div>
          </div>

          {/* Card 2 - Intrusion Monitoring */}
          <div
            ref={(el) => (cardsRef.current[1] = el)}
            className="relative flex flex-col items-center p-8 rounded-3xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] self-end transform translate-y-12 h-[540px] md:mt-[240px]"
          >
            <div className="w-full flex justify-center items-center mb-6">
              <img
                src="/intrusion.svg"
                alt="Intrusion Monitoring"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-start">
              <h3 className="text-2xl font-semibold text-secondary">
                Intrusion Monitoring
              </h3>
              <p className="text-base text-gray-600">
                Protect your valuables from unauthorized access. SecureTrack’s
                smart sensors instantly alert you if tampering or forced entry
                is detected, ensuring your peace of mind.
              </p>
            </div>
          </div>

          {/* Card 3 - Fall Detection */}
          <div
            ref={(el) => (cardsRef.current[2] = el)}
            className="relative flex flex-col items-center p-8 rounded-3xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] self-start transform -translate-y-12 h-[540px] md:mt-[-180px]"
          >
            <div className="w-full flex justify-center items-center mb-6">
              <img
                src="/fall.svg"
                alt="Fall Detection"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-start">
              <h3 className="text-2xl font-semibold text-secondary">
                Fall Detection
              </h3>
              <p className="text-base text-gray-600">
                Shield your belongings from unexpected impacts. SecureTrack
                detects sudden drops or rough handling, notifying you in
                real-time about potential damage risks.
              </p>
            </div>
          </div>

          {/* Card 4 - Temperature Monitoring */}
          <div
            ref={(el) => (cardsRef.current[3] = el)}
            className="relative flex flex-col items-center p-8 rounded-3xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] self-end transform translate-y-12 h-[540px] "
          >
            <div className="w-full flex justify-center items-center mb-6">
              <img
                src="/temp.svg"
                alt="Temperature Monitoring"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-start">
              <h3 className="text-2xl font-semibold text-secondary">
                Temperature Monitoring
              </h3>
              <p className="text-base text-gray-600">
                Keep delicate items safe. From perishable goods to sensitive
                electronics, SecureTrack monitors temperature changes, so you
                can act swiftly if conditions become unsuitable.
              </p>
            </div>
          </div>

          {/* Card 5 - Geofencing */}
          <div
            ref={(el) => (cardsRef.current[4] = el)}
            className="relative flex flex-col items-center p-8 rounded-3xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] self-start transform -translate-y-12 h-[540px] md:mt-[-180px]"
          >
            <div className="w-full flex justify-center items-center mb-6">
              <img
                src="/geofence.svg"
                alt="Geofencing"
                className="w-full max-w-[500px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-start">
              <h3 className="text-2xl font-semibold text-secondary">
                Geofencing
              </h3>
              <p className="text-base text-gray-600">
                Define safety zones for your luggage. Receive instant alerts if
                your belongings move outside your designated boundaries—perfect
                for crowded terminals or layovers.
              </p>
            </div>
          </div>

          {/* Card 6 - Reporting Feature */}
          <div
            ref={(el) => (cardsRef.current[5] = el)}
            className="relative flex flex-col items-center p-8 rounded-3xl shadow-lg bg-gradient-to-r from-[#F3F4F6] to-[#E5E7EB] self-end transform translate-y-12 h-[540px]"
          >
            <div className="w-full flex justify-center items-center mb-6">
              <img
                src="/reporting.svg"
                alt="Reporting Feature"
                className="w-full max-w-[400px] h-auto object-cover rounded-md"
              />
            </div>
            <div className="w-full space-y-4 text-start">
              <h3 className="text-2xl font-semibold text-secondary">
                Reporting Feature
              </h3>
              <p className="text-base text-gray-600">
                Easily report device or software issues to developers and
                administrators for swift resolutions, ensuring reliable luggage
                monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Help Button */}
      <button
        onClick={toggleHelpModal}
        className="fixed bottom-4 right-4 bg-gray-100 bg-opacity-50 backdrop-blur-md rounded-full p-3 shadow-lg hover:bg-gray-200 transition-all"
      >
        <FiHelpCircle className="text-secondary text-2xl" />
      </button>

      {/* Help Modal */}
      {/* Help Modal */}
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

      {/* Other Sections */}
      <section className="h-[500px] min-w-[400px]"></section>

      <footer className="w-full min-w-[400px] py-8 text-left bg-secondary text-white">
        <div className="flex flex-wrap justify-between gap-8 h-auto px-4">
          {/* Logos Section */}
          <div className="flex flex-row justify-center w-full md:w-auto  gap-6">
            <div className="flex flex-wrap items-center justify-start gap-6">
              <a
                href="https://www.philsca.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/PhilSCA-Official-Logo.png"
                  className="h-24 w-24 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  alt="PhilSCA Logo"
                />
              </a>
              <a
                href="https://www.philsca.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/ics.svg"
                  className="h-24 w-24 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  alt="ICS Logo"
                />
              </a>
              <a
                href="https://secure-track-est.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/ST-with-name.svg"
                  className="h-24 w-24 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  alt="SecureTrack Logo"
                />
              </a>
            </div>
          </div>

          {/* Researchers Section */}
          <div className="text-sm md:text-base flex flex-col items-start gap-4">
            <p className="font-normal">
              Group Members <br />
              <a className="text-gray-400 font-light hover:text-primary transition-colors">
                Diacosta, Andrie
              </a>
              <br />
              <a className="text-gray-400 font-light hover:text-primary transition-colors">
                San Esteban, Stefano
              </a>
              <br />
              <a
                href="https://www.instagram.com/__sstefano/"
                className="text-gray-400 font-light hover:text-primary transition-colors"
              >
                San Esteban, Stefano
              </a>
            </p>
            <div>
              <p>ADVISER</p>
              <p className="text-gray-400 font-light hover:text-primary transition-colors">
                Dr. Glenn Arwin Bristol
              </p>
            </div>
          </div>

          {/* Research Coordinator and Panel Section */}
          <div className="text-sm md:text-base flex flex-col items-start gap-4">
            <p className="font-normal">
              COURSE INSTRUCTOR <br />
              <a
                href="https://www.instagram.com/__sstefano/"
                className="text-gray-400 font-light hover:text-primary transition-colors"
              >
                Ms. Ruth Cacho
              </a>
            </p>
            <div>
              <p>PANEL</p>
              <p className="text-gray-400 font-light hover:text-primary transition-colors">
                Mr. Alvin John M. Paz
              </p>
              <p className="text-gray-400 font-light hover:text-primary transition-colors">
                Asst. Prof. Darwin M. Catalan
              </p>
              <p className="text-gray-400 font-light hover:text-primary transition-colors">
                Mr. Erickson Antonio
              </p>
            </div>
          </div>

          {/* Built By and Powered By Section */}
          <div className="text-sm md:text-base flex flex-col items-start gap-4">
            <p className="font-normal">
              BUILT BY <br />
              <a
                href="https://www.instagram.com/__sstefano/"
                className="text-gray-400 font-light hover:text-primary transition-colors flex items-center"
              >
                <img src="/ST.svg" alt="ST logo" className="h-6 opacity-69" />
                efano San Esteban
              </a>
            </p>
            <div className="flex items-center gap-2">
              <p>POWERED BY</p>
              <SiVite className="text-primary hover:text-primary text-3xl transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
