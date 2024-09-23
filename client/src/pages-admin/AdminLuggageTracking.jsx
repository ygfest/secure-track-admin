import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon } from "leaflet";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { format } from "date-fns";

import hazardPinIcon from "../assets/aler-hazard.svg";
import cargoIcon from "../assets/cargo.png";
import luggagePngIcon from "../assets/luggage.png";
import greenMarker from "../assets/green_marker.png";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create custom icons
const hazardIcon = new Icon({
  iconUrl: hazardPinIcon,
  iconSize: [40, 40],
});

const cargoMarker = new Icon({
  iconUrl: cargoIcon,
  iconSize: [40, 40],
});

const luggageIcon = new Icon({
  iconUrl: greenMarker,
  iconSize: [40, 40],
});

// Custom cluster icon
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
  const markerRefs = useRef([]);
  const itemRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/verify");
        if (!response.data.status) {
          navigate("/user/tracking");
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
              `https://nominatim.openstreetmap.org/reverse?lat=${luggageLoc.latitude}&lon=${luggageLoc.longitude}&format=json`
            );
            const data = await response.json();
            return { ...luggageLoc, currentLocation: data.display_name };
          })
        );
        setLuggageDeets(updatedLuggageDeets);
      } catch (error) {
        console.error("Error fetching locations: ", error);
      }
    };

    fetchCurrentLocations();
  }, [luggageDeets]);

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
        const datas = await axios.get("http://localhost:3000/auth/users");
        setUsersData(datas.data);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchUsersData();
  }, []);

  useEffect(() => {
    const fetchLuggageData = async () => {
      try {
        const datas = await axios.get(
          "http://localhost:3000/luggage-router/luggage-admin"
        );
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

  const formatStationarySince = (timestamp) => {
    const date = new Date(timestamp);
    const isToday = date.toDateString() === new Date().toDateString();
    return isToday
      ? `Since ${format(date, "p")}`
      : `Since ${format(date, "p EEEE")}`;
  };

  const findUserById = (userId) => {
    return usersData.find((user) => user._id === userId);
  };

  return (
    <>
      <NavBar />
      <div className="flex-grow relative w-full h-full z-0 lg:rounded">
        <MapContainer
          center={[14.5092, 121.0144]}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            attribution={`&copy; 
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 
            contributors`}
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            //url="https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png"
          />
          <LocationMarker trackLocation={trackLocation} />
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={8}
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
                      {findUserById(luggage.user_id)?.lastname}'s luggage <br />
                      Tracking Number: {luggage.luggage_tag_number} <br />
                      Location: {luggage.currentLocation} <br />
                      Owner: {luggage.user_id}
                      <br />
                      Status: {luggage.status}
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
          <div
            onClick={() => setClicked((prevClick) => !prevClick)}
            className={`card w-full md:w-[560px] shadow-xl px-2 py-6 absolute z-10 md:top-20 min-w-2 rounded-2xl md:right-2 transition-all duration-500 text-white ${
              clicked ? "bottom-0" : "bottom-[-65%]"
            } bg-[#020202a0] backdrop-blur-xl h-[85%] md:max-h-[32rem] max-h-auto cursor-pointer`}
            style={{ zIndex: 1000 }}
          >
            <div className="block md:hidden mx-auto my-2">
              {clicked ? <FaChevronDown /> : <FaChevronUp />}
            </div>
            <div className="card-header p-2 pl-8 pt-0 mt-0 mb-2">
              <h2 className="card-title justify-center md:justify-normal text-md md:text-lg">
                Luggage Details
              </h2>
            </div>
            <div className="card-body overflow-y-auto h-full pt-2">
              {luggageDeets.map((luggageDeet, index) => (
                <div
                  key={luggageDeet._id}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className={`p-4 bg-[#403e3ea3] ${
                    luggageDeet === selectedMarker
                      ? "border-2 border-white scale-105"
                      : ""
                  } hover:scale-105 transition rounded-[7px] flex flex-col gap-2 cursor-pointer`}
                  onClick={() => handleMarkerClick(luggageDeet, index)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className=" text-lg font-poppins font-semibold">
                      {`${findUserById(luggageDeet.user_id)?.firstname} ${
                        findUserById(luggageDeet.user_id)?.lastname
                      }`}
                      's luggage
                    </h4>
                    <div className="badge badge-primary badge-lg  text-white text-xs rounded-none font-poppins">
                      <RelativeTime shipmentDate={luggageDeet.timestamp} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-poppins text-gray-400 font-medium">
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
                  <p className="text-xs">At {luggageDeet.currentLocation}</p>
                  <p className="text-xs">
                    {formatStationarySince(luggageDeet.stationary_since)}
                  </p>
                  <p className="text-xs">
                    Destination: {luggageDeet.destination}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </MapContainer>
      </div>
    </>
  );
};

export default LuggageTracking;
