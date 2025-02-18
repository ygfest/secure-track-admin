import { useState, useEffect, useRef } from "react";
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
import greenMarker from "../../assets/green_marker.png";
import axios from "axios";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import NavBarForMap from "./components/NavBarForMap";
import { useUserData } from "../../context/UserContext";
import RelativeTime from "../../components/RelativeTime";
import axiosInstance from "../../utils/axiosInstance";
import useAuth from "../../hook/useAuth";

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

const AdminLuggageTracking = () => {
  const admin = useAuth("admin");

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [trackLocation, setTrackLocation] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [luggageDeets, setLuggageDeets] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const markerRefs = useRef([]);
  const itemRefs = useRef([]);
  const [shouldFly, setShouldFly] = useState(false);

  const { isLocationOn } = useUserData();

  const {
    userId,
    profileDp,
    profileFirstName,
    currentUserLat,
    currentUserLong,
  } = useUserData();

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    const fetchCurrentLocations = async () => {
      try {
        const updatedLuggageDeets = await Promise.all(
          luggageDeets.map(async (luggageLoc) => {
            const luggageId = luggageLoc._id;
            const response = await fetch(
              `https://photon.komoot.io/reverse?lat=${luggageLoc.latitude}&lon=${luggageLoc.longitude}`
            );
            if (response.ok) {
              const data = await response.json();
              if (data && data.features && data.features.length > 0) {
                const properties = data.features[0].properties;
                const locationName = `${properties.name}, ${properties.city}, ${properties.state}, ${properties.country}`;
                console.log("LUGGAGE FETCH LOCATION CALLED");

                // Update the current location in the database
                // Check if location has changed
                let stationary_since = luggageLoc.stationary_since;
                if (locationName !== luggageLoc.currentLocation) {
                  stationary_since = Date.now();
                }
                const apiUrl = import.meta.env.VITE_API_URL;
                await axios.put(
                  `${apiUrl}/luggage-router/update-current-location`,
                  {
                    luggageId,
                    currentLocation: locationName,
                    stationary_since,
                  }
                );
                return {
                  ...luggageLoc,
                  currentLocation: locationName,
                  stationary_since,
                };
              } else {
                let stationary_since = luggageLoc.stationary_since;
                if (luggageLoc.currentLocation !== null) {
                  stationary_since = Date.now();
                }
                const apiUrl = import.meta.env.VITE_API_URL;
                await axios.put(
                  `${apiUrl}/luggage-router/update-current-location`,
                  {
                    luggageId,
                    currentLocation: null,
                    stationary_since: stationary_since,
                  }
                );
                return { ...luggageLoc, currentLocation: "Unknown Location" };
              }
            } else {
              console.error("Error fetching location:", response.status);
              let stationary_since = luggageLoc.stationary_since;
              if (luggageLoc.currentLocation !== null) {
                stationary_since = Date.now();
              }
              const apiUrl = import.meta.env.VITE_API_URL;
              await axios.put(
                `${apiUrl}/luggage-router/update-current-location`,
                {
                  luggageId,
                  currentLocation: null,
                  stationary_since: stationary_since,
                }
              );
              return { ...luggageLoc, currentLocation: "Unknown Location" };
            }
          })
        );

        fetchLuggageData();
      } catch (error) {
        console.error("Error fetching locations: ", error);
      }
    };

    // Debounce the API call to reduce stuttering
    const debouncedFetchCurrentLocations = debounce(
      fetchCurrentLocations,
      10000
    );
    debouncedFetchCurrentLocations();
    return () => {
      debouncedFetchCurrentLocations.cancel();
    };
  }, [JSON.stringify(luggageDeets)]);

  const fetchLuggageData = async () => {
    try {
      const datas = await axiosInstance.get("/luggage-router/luggage-admin");
      setLuggageDeets(datas.data);
    } catch (error) {
      console.error("Error fetching luggage data:", error);
    }
  };

  useEffect(() => {
    fetchLuggageData();
  }, []);

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
        const datas = await axiosInstance("/auth/users");
        setUsersData(datas.data);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchUsersData();
  }, []);

  const position = [currentUserLat, currentUserLong];
  const ownerName =
    usersData._id === luggageDeets.user_id
      ? `${usersData.firstname} ${usersData.lastname}`
      : null;
  const handleMarkerClick = (luggage, index) => {
    setSelectedMarker(luggage);
    markerRefs.current[index].openPopup();
    setShouldFly(true); // Enable fly-to behavior
  };

  const FlyToLocation = ({ latitude, longitude, shouldFly, onFlyComplete }) => {
    const map = useMap();

    useEffect(() => {
      if (shouldFly) {
        map.flyTo([latitude, longitude], 18, { animate: true });

        // Ensure the fly-to action completes before resetting the state
        const timeout = setTimeout(() => {
          onFlyComplete(); // Reset the `shouldFly` state
        }, 1500); // Duration matches the map.flyTo animation duration

        return () => clearTimeout(timeout); // Cleanup to prevent memory leaks
      }
    }, [latitude, longitude, shouldFly, map, onFlyComplete]);

    return null;
  };

  const handleFlyComplete = () => {
    setShouldFly(false); // Reset after flying
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
      const luggageWithTimestamp = {
        ...newLuggage,
        createdAt: new Date().toISOString(), // Adds a timestamp
      };

      const response = await axiosInstance.post(
        "/luggage-router/addluggage",
        luggageWithTimestamp
      );

      if (response.status === 201) {
        await fetchLuggageData(); // Refreshes luggage data
        toast.success("Luggage added successfully");
      } else {
        toast.error("Luggage Tag already in use");
      }

      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding luggage:", error);
      toast.error("Luggage Tag already in use");
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
    }, [isLocationOn, currentUserLat, currentUserLong, map]);

    return null;
  };

  const userIcon = L.divIcon({
    html: `
      <div class="btn btn-circle avatar relative flex items-center justify-center">
        ${
          profileDp
            ? `<div class="w-10 rounded-full border-3 border-white">
                 <img alt="Profile" src="${profileDp}" />
               </div>`
            : `<div class="w-[38px] h-[38px] rounded-full flex justify-center items-center border-gray-300 border-3 bg-white pt-1 text-gray-500 font-poppins text-xl">
                 ${
                   profileFirstName
                     ? profileFirstName.charAt(0).toUpperCase()
                     : ""
                 }
               </div>`
        }
        <div class="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-300"></div>
      </div>`,
    className: "",
    iconSize: [30, 30],
  });

  if (
    currentUserLat === null ||
    currentUserLong === null ||
    profileFirstName === null
  ) {
    return (
      <div className="bg-[#272829] h-[100vh] w-[100vw] flex flex-col items-center justify-center">
        <img src="/ST-without-name.svg" className="h-24 mb-8" />
        <BarLoader color="white" size={40} data-testid="loader" />
      </div>
    );
  }

  if (!admin) {
    return;
  }

  return (
    <>
      <NavBarForMap />
      <div className="fixed inset-0 w-screen h-screen z-0">
        <div
          onClick={() => setClicked((prevClick) => !prevClick)}
          className={`card w-full md:w-[560px] shadow-xl px-0 md:px-2 md:py-6 py-2 absolute z-10 md:top-20 min-w-2 rounded-2xl rounded-br-none rounded-bl-none md:rounded-br-2xl md:rounded-bl-2xl md:right-2 transition-all duration-500 text-white ${
            clicked ? "bottom-0" : "bottom-[-65%]"
          } bg-[#020202a0] backdrop-blur-xl h-[85%] md:max-h-[32rem] max-h-auto cursor-pointer overflow-hidden`}
          style={{ zIndex: 1000 }}
        >
          <div className="block md:hidden mx-auto my-2">
            {clicked ? <FaChevronDown /> : <FaChevronUp />}
          </div>
          <div className="card-header p-2 md:pl-8 pt-0 mt-0 mb-2">
            <h2 className="card-title justify-center md:justify-normal text-md md:text-lg">
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
                  <h4 className="text-md md:text-lg font-poppins font-semibold max-w-[20px]:">
                    {luggageDeet.luggage_custom_name}
                  </h4>
                  <div className="badge badge-primary badge-sm md:badge-md  text-white text-xs rounded-none font-poppins whitespace-nowrap">
                    <RelativeTime shipmentDate={luggageDeet.updatedAt} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-poppins text-[#ffffff8b] font-medium">
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
                {luggageDeet.currentLocation === null ? (
                  <p className="text-xs text-[#ffffff8b]">No Location</p>
                ) : (
                  <p className="text-xs text-[#ffffff8b]">
                    At {luggageDeet.currentLocation}
                  </p>
                )}
                <p className="text-xs text-[#ffffff8b]">
                  {formatStationarySince(luggageDeet.stationary_since)}
                </p>
                <p className="text-xs text-[#ffffff8b]">
                  Owner:{" "}
                  {usersData.find((user) => user._id === luggageDeet.user_id)
                    ? `${
                        usersData.find(
                          (user) => user._id === luggageDeet.user_id
                        ).firstname
                      } ${
                        usersData.find(
                          (user) => user._id === luggageDeet.user_id
                        ).lastname
                      }`
                    : "Unknown Owner"}
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
          center={[currentUserLat, currentUserLong]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution={`&copy; 
            built by <a href="https://www.instagram.com/__sstefano/" className="bg-black text-white">Stefano</a>`}
            url={`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${
              import.meta.env.VITE_STADIA_API_KEY
            }`}
          />
          <LocationMarker trackLocation={trackLocation} />
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={8}
          >
            {luggageDeets.map((luggage, index) =>
              luggage.latitude === null || luggage.longitude === null ? (
                ""
              ) : (
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
                            Tracking Number:
                          </span>{" "}
                          {luggage.luggage_tag_number}
                        </span>{" "}
                        <br />
                        <span className="font-poppins">
                          <span className="font-poppins font-semibold">
                            Location:
                          </span>{" "}
                          {luggage.currentLocation}
                        </span>{" "}
                        <br />
                        <span className="font-poppins">
                          <span className="font-poppins font-semibold">
                            Owner:{" "}
                          </span>

                          {usersData.find(
                            (user) => user._id === luggage.user_id
                          )
                            ? `${
                                usersData.find(
                                  (user) => user._id === luggage.user_id
                                ).firstname
                              } ${
                                usersData.find(
                                  (user) => user._id === luggage.user_id
                                ).lastname
                              }`
                            : "Unknown Owner"}
                        </span>
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
                      latitude={luggage?.latitude}
                      longitude={luggage?.longitude}
                      shouldFly={shouldFly}
                      onFlyComplete={handleFlyComplete}
                    />
                  )}
                </Marker>
              )
            )}
          </MarkerClusterGroup>
          {isLocationOn &&
            currentUserLat !== null &&
            currentUserLong !== null && (
              <>
                <Marker position={position} icon={userIcon} zIndexOffset={1000}>
                  <Popup>
                    You are here <br />
                  </Popup>
                </Marker>
                <Circle
                  center={[currentUserLat, currentUserLong]}
                  pathOptions={fillBlueOptions}
                  radius={200}
                />
              </>
            )}

          {showAddModal && (
            <div className="fixed inset-0 flex items-center justify-center z-[1000] text-white bg-white bg-opacity-20">
              <div className="bg-[#020202a0] backdrop-blur-xl p-6 w-[80%] md:w-[30%] rounded-lg shadow-lg">
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
                      className="input input-bordered bg-[#403e3ea3]"
                      required
                    />
                  </div>
                  <div className="form-control mb-4">
                    <label className="label font-poppins">Tag Number</label>
                    <input
                      name="luggage_tag_number"
                      type="text"
                      className="input input-bordered font-poppins bg-[#403e3ea3]"
                      placeholder="You can see it in the tag"
                      required
                    />
                  </div>
                  <div className="form-control mt-6 flex  flex-row justify-end gap-2">
                    <button
                      className="btn bg-[#403e3ea3] text-white border-none"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary font-poppins text-white"
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

export default AdminLuggageTracking;
