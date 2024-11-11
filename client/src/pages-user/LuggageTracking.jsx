import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon } from "leaflet";
import { FaChevronUp, FaChevronDown, FaPlusCircle } from "react-icons/fa";
import { format } from "date-fns";
import debounce from "lodash.debounce";

import hazardPinIcon from "../assets/aler-hazard.svg";
import cargoIcon from "../assets/cargo.png";
import luggagePngIcon from "../assets/luggage.png";
import greenMarker from "../assets/green_marker.png";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useUserNotif } from "../context/UserNotifContext";
import L from "leaflet";
import { useLocation } from "../context/UserLocationContext";

const luggageIcon = new Icon({
  iconUrl: greenMarker,
  iconSize: [40, 40],
});

const fillBlueOptions = { fillColor: "lime", color: "lime" };

const createClusterCustomIcon = (cluster) => {
  return divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className:
      "flex items-center justify-center bg-gray-900 h-8 w-8 text-white rounded-full text-lg shadow-lg",
    iconSize: [33, 33],
  });
};

const RelativeTime = ({ shipmentDate }) => {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    const calculateRelativeTime = () => {
      const now = new Date();
      const shipmentDateTime = new Date(shipmentDate);
      const timeDifference = now - shipmentDateTime;
      const secondsDifference = Math.floor(timeDifference / 1000);

      if (secondsDifference < 60) {
        setRelativeTime("Last updated Now");
      } else if (secondsDifference < 3600) {
        const minutes = Math.floor(secondsDifference / 60);
        setRelativeTime(
          `${
            minutes === 1
              ? "Last updated a minute"
              : `Last updated ${minutes} minutes`
          } ago`
        );
      } else if (secondsDifference < 86400) {
        const hours = Math.floor(secondsDifference / 3600);
        setRelativeTime(
          `${
            hours === 1 ? "Last updated an hour" : `Last updated ${hours} hours`
          } ago`
        );
      } else if (secondsDifference < 2592000) {
        const days = Math.floor(secondsDifference / 86400);
        setRelativeTime(
          `${
            days === 1 ? "Last updated a day" : `Last updated ${days} days`
          } ago`
        );
      } else {
        setRelativeTime("Last updated a while ago");
      }
    };

    calculateRelativeTime();
    const interval = setInterval(calculateRelativeTime, 60000);
    return () => clearInterval(interval);
  }, [shipmentDate]);

  return <span>{relativeTime}</span>;
};

const LuggageTracking = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [trackLocation, setTrackLocation] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [luggageDeets, setLuggageDeets] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [userId, setUserId] = useState();
  const [showAddModal, setShowAddModal] = useState(false);
  const markerRefs = useRef([]);
  const itemRefs = useRef([]);
  const navigate = useNavigate();

  const [profileDp, setProfileDp] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const { isLocationOn, currentUserLat, currentUserLong } = useLocation();
  const mapRef = useRef(null); // Ref to store the map instance
  const radius = 20;
  const center = [currentUserLat, currentUserLong];
  const [lastChecked, setLastChecked] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { openNotif, setOpenNotif } = useUserNotif();
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/auth/verify`);
        if (!response.data.status || response.data.user.role !== "user") {
          navigate("/sign-in");
        } else {
          setUserId(response.data.user.userID);
          setProfileDp(response.data.user.profile_dp);
          setProfileName(response.data.user.firstname);
          setProfileLastName(response.data.user.lastname);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        navigate("/sign-in");
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    const fetchCurrentLocations = async () => {
      try {
        const updatedLuggageDeets = await Promise.all(
          luggageDeets.map(async (luggageLoc) => {
            const response = await fetch(
              `https://photon.komoot.io/reverse?lat=${luggageLoc.latitude}&lon=${luggageLoc.longitude}`
            );
            if (response.ok) {
              const data = await response.json();
              if (data && data.features && data.features.length > 0) {
                const properties = data.features[0].properties;
                const locationName = `${properties.name}, ${properties.city}, ${properties.state}, ${properties.country}`;
                return { ...luggageLoc, currentLocation: locationName };
              } else {
                return { ...luggageLoc, currentLocation: "Unknown Location" };
              }
            } else {
              console.error("Error fetching location:", response.status);
              return { ...luggageLoc, currentLocation: "Unknown Location" };
            }
          })
        );
        setLuggageDeets(updatedLuggageDeets);
      } catch (error) {
        console.error("Error fetching locations: ", error);
      }
    };

    // Debounce the API call to reduce stuttering
    const debouncedFetchCurrentLocations = debounce(
      fetchCurrentLocations,
      59000
    );
    debouncedFetchCurrentLocations();

    // Cleanup debounce on unmount
    return () => {
      debouncedFetchCurrentLocations.cancel();
    };
  }, [JSON.stringify(luggageDeets)]);

  const handleLocateUser = (map) => {
    setTrackLocation(true);
    map.locate();
    console.log("button was clicked");
  };

  const LocationMarker = ({ trackLocation }) => {
    const [position, setPosition] = useState(null);
    const map = useMap();

    useMapEvents({
      locationfound(e) {
        if (trackLocation) {
          setPosition(e.latlng);
          map.flyTo(e.latlng, map.getZoom());
        }
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const datas = await axios.get(`${apiUrl}/auth/users`);
        setUsersData(datas.data);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchUsersData();
  }, []);

  const position = [currentUserLat, currentUserLong];

  const isLuggageOutsideGeofence = async (
    luggageLat,
    luggageLong,
    centerLat,
    centerLong,
    radius
  ) => {
    console.log("Luggage Coordinates:", { luggageLat, luggageLong });
    console.log("Center Coordinates:", { centerLat, centerLong });

    if (!luggageLat || !luggageLong || !centerLat || !centerLong) {
      return null;
    }

    try {
      const mapCenter = L.latLng(centerLat, centerLong);
      const luggageLocation = L.latLng(luggageLat, luggageLong);
      const distance = luggageLocation.distanceTo(mapCenter);
      return distance > radius;
    } catch (error) {
      console.error("Error in calculating distance:", error);
      return null;
    }
  };

  useEffect(() => {
    const shouldUpdateGeofence =
      luggageDeets.length > 0 &&
      currentUserLat !== null &&
      currentUserLong !== null;
    if (shouldUpdateGeofence) {
      updateGeofenceStatus();
    }
  }, [luggageDeets, currentUserLat, currentUserLong]);

  const updateGeofenceStatus = async () => {
    if (isUpdating) return; // Prevent re-entry if an update is in progress

    setIsUpdating(true);
    let hasGeoStatusChanged = false;

    try {
      const updatedStatuses = await Promise.all(
        luggageDeets.map(async (luggage) => {
          const {
            latitude: luggageLat,
            longitude: luggageLong,
            _id,
            status,
          } = luggage;

          const isOutside = await isLuggageOutsideGeofence(
            luggageLat,
            luggageLong,
            currentUserLat,
            currentUserLong,
            radius
          );

          const newStatus =
            isOutside === null
              ? "Out of Coverage"
              : isOutside
              ? "Out of Range"
              : "In Range";

          if (status !== newStatus) {
            if (
              newStatus === "Out of Range" ||
              newStatus === "Out of Coverage"
            ) {
              hasGeoStatusChanged = true; // Track status change here
            }

            await axios.post(
              `${
                import.meta.env.VITE_API_URL
              }/luggage-router/luggage/${_id}/updateStatus`,
              { status: newStatus, luggageId: _id }
            );

            return { ...luggage, status: newStatus };
          }

          return luggage;
        })
      );

      // Only update luggageDeets if there are changes
      const luggageDeetsChanged =
        JSON.stringify(updatedStatuses) !== JSON.stringify(luggageDeets);

      if (luggageDeetsChanged) {
        setLuggageDeets(updatedStatuses);
        toast.success("Geofence statuses have been updated");

        //fetchUserReports();
      }

      // Ensure geoStatChanged is set only if relevant status change occurred
      if (hasGeoStatusChanged) {
        setGeoStatChanged(true); // Update geoStatChanged only when necessary
      }
    } catch (error) {
      console.error("Error updating geofence statuses:", error);
      toast.error(
        "Please turn on location and refresh the page to get the updated geofencing status"
      );
    } finally {
      setIsUpdating(false); // Reset update state after completion
    }
  };

  console.log("LAT", currentUserLat);
  console.log("LONG:", currentUserLong);

  useEffect(() => {
    const isNewDataAvailable = luggageDeets.some(
      (luggage) =>
        lastChecked === null ||
        new Date(luggage.timestamp) > new Date(lastChecked)
    );

    if (isNewDataAvailable) {
      updateGeofenceStatus();
      setLastChecked(new Date()); // Update the last checked time to now
    }
  }, [luggageDeets, lastChecked]); // Run whenever luggageDeets change

  useEffect(() => {
    const fetchLuggageData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const datas = await axios.get(`${apiUrl}/luggage-router/luggage`);
        setLuggageDeets(datas.data);
      } catch (error) {
        console.error("Error fetching luggage data:", error);
      }
    };

    fetchLuggageData();
  }, []);

  const handleMarkerClick = (luggage, index) => {
    setSelectedMarker(luggage);
    markerRefs.current[index].openPopup();
  };

  const FlyToLocation = ({ latitude, longitude }) => {
    const map = useMap();
    useEffect(() => {
      map.flyTo([latitude, longitude], 16, { animate: true });
    }, [latitude, longitude, map]);
    return null;
  };

  useEffect(() => {
    if (selectedMarker) {
      const index = luggageDeets.findIndex(
        (luggage) => luggage._id === selectedMarker._id
      );
      if (index !== -1) {
        itemRefs.current[index].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [selectedMarker, luggageDeets]);

  useEffect(() => {
    const formatStationarySince = (timestamp) => {
      const date = new Date(timestamp);
      const isToday = date.toDateString() === new Date().toDateString();
      return isToday
        ? `Since ${format(date, "p")}`
        : `Since ${format(date, "p EEEE")}`;
    };
  }, [luggageDeets]);

  const formatStationarySince = (timestamp) => {
    const date = new Date(timestamp);
    const isToday = date.toDateString() === new Date().toDateString();
    return isToday
      ? `Since ${format(date, "p")}`
      : `Since ${format(date, "p EEEE")}`;
  };

  const handleAddNewLuggage = async (newLuggage) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${apiUrl}/luggage-router/addluggage`,
        newLuggage
      );
      if (response.status === 201) {
        setLuggageDeets([...luggageDeets, newLuggage]);
        console.log("New Luggage Details: ", newLuggage);
        await fetchLuggageData();
        toast.success("Luggage added succesfully");
        window.location.reload();
      } else {
        toast.error("Error adding Luggage");
      }
      setShowAddModal(false);
    } catch (error) {
      console.log("error adding luggage", error);
      toast.error("Error Adding Luggage");
    }
  };

  const FlyToUserLocation = ({
    isLocationOn,
    currentUserLat,
    currentUserLong,
  }) => {
    const map = useMap();

    useEffect(() => {
      if (isLocationOn && currentUserLat !== null && currentUserLong !== null) {
        map.flyTo([currentUserLat, currentUserLong], 16, { animate: true });
      }
    }, [isLocationOn, currentUserLat, currentUserLong, map]); // Include map in dependency array

    return null; // Component does not render anything
  };

  const userIcon = L.divIcon({
    html: `
      <div class="btn btn-circle avatar relative flex items-center justify-center">
        ${
          profileDp
            ? `<div class="w-10 rounded-full border-3 border-white">
                 <img alt="Profile" src="${profileDp}" />
               </div>`
            : `<div class="w-[38px] h-[38px] pt-1 rounded-full flex justify-center items-center border-gray-300 border-3 bg-white text-gray-500 font-poppins text-xl">
                 ${profileName ? profileName.charAt(0).toUpperCase() : ""}
               </div>`
        }
        <div class="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-300"></div>
      </div>`,
    className: "",
    iconSize: [30, 30],
  });

  return (
    <>
      <NavBar />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            margin: "5px 0",
          },
        }}
      />

      <div className="fixed inset-0 w-screen h-screen flex flex-col z-0">
        <div
          onClick={() => {
            setClicked((prevClick) => !prevClick);
            setOpenNotif(false);
          }}
          className={`card w-full md:w-[560px] shadow-xl px-0 md:px-2 md:py-6 py-2 absolute z-10 md:top-20 min-w-2 rounded-2xl rounded-br-none rounded-bl-none md:rounded-br-2xl md:rounded-bl-2xl md:right-2 transition-all duration-500 text-white ${
            clicked ? "bottom-0" : "bottom-[-65%]"
          } bg-[#020202a0] backdrop-blur-xl z-[1000] h-[85%] md:max-h-[32rem] max-h-auto cursor-pointer overflow-hidden`}
        >
          <div className="block md:hidden mx-auto my-2">
            {clicked ? <FaChevronDown /> : <FaChevronUp />}
          </div>
          <div className="card-header p-2 md:pl-8 pt-0 mt-0 mb-2">
            <h2 className="card-title text-center justify-center md:justify-normal text-md md:text-lg">
              Luggage Details
            </h2>
          </div>
          <div className="card-body overflow-y-auto h-full pt-2 gap-3">
            {luggageDeets.map((luggageDeet, index) => (
              <div
                key={luggageDeet._id}
                ref={(el) => (itemRefs.current[index] = el)}
                className={`p-4 bg-[#403e3ea3] ${
                  luggageDeet === selectedMarker
                    ? "border-2 border-white scale-105"
                    : ""
                } hover:scale-105 transition rounded-[7px] flex flex-col gap-1 cursor-pointer`}
                onClick={() => handleMarkerClick(luggageDeet, index)}
              >
                <div className="flex items-center justify-between">
                  <h4 className=" text-md md:text-lg font-poppins font-semibold max-w-[20px]:">
                    {luggageDeet.luggage_custom_name}
                  </h4>
                  <div className="badge badge-primary badge-sm md:badge-md  text-white text-xs rounded-none font-poppins whitespace-nowrap ">
                    <RelativeTime shipmentDate={luggageDeet.timestamps} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-poppins text-[#ffffff8b] font-medium">
                    {luggageDeet.luggage_tag_number}
                  </h4>
                  <div
                    className={`badge badge-outline text-xs font-poppins ${
                      luggageDeet.status === "In Range"
                        ? "text-green-200"
                        : luggageDeet.status === "Out of Range"
                        ? "text-yellow-200"
                        : "text-red-100"
                    }`}
                  >
                    {luggageDeet.status}
                  </div>
                </div>
                <p className="text-xs text-[#ffffff8b]">
                  At {luggageDeet.currentLocation}
                </p>
                <p className="text-xs text-[#ffffff8b]">
                  {formatStationarySince(luggageDeet.stationary_since)}
                </p>
              </div>
            ))}
            <div
              onClick={() => setShowAddModal(true)}
              className="p-4 bg-[#403e3ea3] hover:scale-105 transition rounded-[7px] flex flex-col gap-1 cursor-pointer text-center text white"
            >
              <FaPlusCircle className="text-2xl mx-auto " />
              <p>Add a new Luggage</p>
            </div>
          </div>
        </div>
        <MapContainer
          center={[14.5092, 121.0144]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution={`&copy; 
            developed by <a href="https://www.instagram.com/__sstefano/" className="bg-black text-white z-[1]">Stefano</a>`}
            url={`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${
              import.meta.env.VITE_STADIA_API_KEY
            }`}
          />
          <LocationMarker trackLocation={trackLocation} />
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={5}
          >
            {luggageDeets.map((luggage, index) => (
              <Marker
                key={luggage._id}
                position={[luggage.latitude, luggage.longitude]}
                icon={luggageIcon}
                ref={(el) => (markerRefs.current[index] = el)}
                eventHandlers={{
                  click: () => handleMarkerClick(luggage, index),
                }}
              >
                <Popup>
                  {usersData && luggage.user_id && (
                    <>
                      <span className="text-lg font-bold font-poppins">
                        {luggage.luggage_custom_name}
                      </span>
                      <br />
                      <span className="font-poppins">
                        <span className="font-poppins font-semibold">
                          Tracking Number:{" "}
                        </span>{" "}
                        {luggage.luggage_tag_number}
                      </span>{" "}
                      <br />
                      <span className="font-poppins">
                        <span className="font-poppins font-semibold">
                          {" "}
                          Location:
                        </span>{" "}
                        {luggage.currentLocation}
                      </span>{" "}
                      <br />
                      <br />
                      <span
                        className={`font-poppins ${
                          luggage.status === "In Range"
                            ? "text-green-500"
                            : luggage.status === "Out of Range"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        Status: {luggage.status}
                      </span>
                    </>
                  )}
                </Popup>
                {selectedMarker && selectedMarker._id === luggage._id && (
                  <FlyToLocation
                    latitude={luggage.latitude}
                    longitude={luggage.longitude}
                  />
                )}
              </Marker>
            ))}
          </MarkerClusterGroup>
          {isLocationOn &&
            currentUserLat !== null &&
            currentUserLong !== null && (
              <>
                <Marker
                  position={position}
                  icon={userIcon}
                  zIndexOffset={100000}
                >
                  <Popup>
                    You are here <br />
                  </Popup>
                </Marker>
                <Circle
                  center={center}
                  pathOptions={fillBlueOptions}
                  radius={radius}
                />
              </>
            )}

          {showAddModal && (
            <div className="fixed inset-0 flex items-center justify-center z-[8000] bg-white bg-opacity-20">
              <div className="bg-[#020202a0] backdrop-blur-xl text-white p-6 w-[80%] md:w-[30%] rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold font-poppins mb-4">
                  Add New Luggage
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddNewLuggage({
                      luggage_custom_name: e.target.luggage_custom_name.value,
                      luggage_tag_number: e.target.luggage_tag_number.value,
                      user_id: userId,
                    });
                    //window.location.reload();
                  }}
                >
                  <div className="form-control mb-4">
                    <label className="label font-poppins">Luggage Name</label>
                    <input
                      name="luggage_custom_name"
                      type="text"
                      className="input bg-[#403e3ea3] text-white input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="form-control mb-4">
                    <label className="label font-poppins">Tag Number</label>
                    <input
                      name="luggage_tag_number"
                      type="text"
                      className="input input-bordered bg-[#403e3ea3] text-zin-800 font-poppins focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="You can see it in the tag"
                      required
                    />
                  </div>
                  <div className="form-control mt-6 flex flex-row justify-end gap-4 ">
                    <button
                      className="btn bg-[#403e3ea3] text-white border-none"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary text-white font-poppins"
                    >
                      Add Luggage
                    </button>
                  </div>
                </form>
                <div
                  tabIndex={0}
                  role="button"
                  className="absolute top-0 right-0 m-2 p-2 text-[#3B3F3F] hover:bg-gray-200 rounded-3xl"
                  onClick={() => setShowAddModal(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </MapContainer>
      </div>
    </>
  );
};

export default LuggageTracking;
