import React, { useState, useEffect } from "react";
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

import hazardPinIcon from "../assets/aler-hazard.svg";
import cargoIcon from "../assets/cargo.png";
import fireAlertIcon from "../assets/alert-fire.svg";
import NavBar from "../components/NavBar";

// create custom icons
const hazardIcon = new Icon({
  iconUrl: hazardPinIcon,
  iconSize: [40, 40], // size of the icon
});

const cargoMarker = new Icon({
  iconUrl: cargoIcon,
  iconSize: [40, 40], // size of the icon
});

const fireIcon = new Icon({
  iconUrl: fireAlertIcon,
  iconSize: [40, 40], // size of the icon
});

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className:
      "flex items-center justify-center bg-gray-900 h-8 w-8 text-white rounded-full text-lg shadow-lg",
    iconSize: [33, 33],
  });
};

// markers
const markers = [
  {
    id: 1,
    geocode: [14.51, 121.0144],
    popUp: "ang inet",
    icon: hazardIcon,
    timeReported: "4 mins ago",
    reporter: "Stefano San Esteban",
  },
  {
    id: 2,
    geocode: [14.53, 121.0144],
    popUp: "Need ambulance",
    icon: cargoMarker,
    timeReported: "now",
    reporter: "Juan dela Cruz",
  },
  {
    id: 3,
    geocode: [14.5292, 121.1144],
    popUp: "May sunog!",
    icon: fireIcon,
    timeReported: "a min ago",
    reporter: "Krisha Nobora",
  },
];

const RelativeTime = ({ shipmentDate }) => {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    const calculateRelativeTime = () => {
      const now = new Date();
      const shipmentDateTime = new Date(shipmentDate);

      if (shipmentDateTime > now) {
        // Shipment date is in the future
        const daysDifference = Math.ceil(
          (shipmentDateTime - now) / (1000 * 60 * 60 * 24)
        );
        setRelativeTime(
          `In ${daysDifference} day${daysDifference !== 1 ? "s" : ""}`
        );
        return;
      }

      const timeDifference = now - shipmentDateTime;

      // Convert milliseconds to seconds
      const secondsDifference = Math.floor(timeDifference / 1000);

      if (secondsDifference < 60) {
        setRelativeTime("just now");
      } else if (secondsDifference < 3600) {
        const minutes = Math.floor(secondsDifference / 60);
        setRelativeTime(`${minutes} minute${minutes !== 1 ? "s" : ""} ago`);
      } else if (secondsDifference < 86400) {
        const hours = Math.floor(secondsDifference / 3600);
        setRelativeTime(`${hours} hour${hours !== 1 ? "s" : ""} ago`);
      } else {
        const days = Math.floor(secondsDifference / 86400);
        setRelativeTime(`${days} day${days !== 1 ? "s" : ""} ago`);
      }
    };

    calculateRelativeTime();
  }, [shipmentDate]);

  return <span>{relativeTime}</span>;
};

const MapComponent = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const [cargoDeets, setCargoDeets] = useState([]);
  const [trackLocation, setTrackLocation] = useState(false);

  useEffect(() => {
    const fetchCurrentLocations = async () => {
      try {
        const updatedCargoDeets = await Promise.all(
          cargoDeets.map(async (cargoLoc) => {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${cargoLoc.latitude}&lon=${cargoLoc.longitude}&format=json`
            );
            const data = await response.json();
            return { ...cargoLoc, currentLocation: data.display_name };
          })
        );
        setCargoDeets(updatedCargoDeets);
      } catch (error) {
        console.error("Error fetching locations: ", error);
      }
    };

    fetchCurrentLocations();
  }, [cargoDeets]);

  const handleLocateUser = (map) => {
    setTrackLocation(true);
    map.locate();
    console.log("button was clicked");
  };

  function LocationMarker({ trackLocation }) {
    const [position, setPosition] = useState(null);
    const map = useMap();

    useMapEvents({
      locationfound(e) {
        if (trackLocation) {
          setPosition(e.latlng);
          map.flyTo(e.latlng, 18, { animate: true, duration: 2 });
        }
      },
    });

    return position === null ? null : (
      <>
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>
      </>
    );
  }
  useEffect(() => {
    async function fetchCargoData() {
      try {
        const datas = await fetch("http://localhost:3000/strack");
        const datasJSON = await datas.json();
        setCargoDeets(datasJSON);
      } catch (error) {
        console.error("Error fetching cargo data:", error);
      }
    }

    fetchCargoData(); // Call the fetchCargoData function inside useEffect
  }, []); // Empty dependency array to run the effect only once on component mount

  return (
    <>
      <NavBar />
      <div className="card w- bg-base-100 shadow-xl fixed z-10 top-20 left-2 min-w-2 rounded-lg">
        {selectedMarker && (
          <div className="card-body">
            <h2 className="card-title text-lg">
              {selectedMarker.popUp}
              <div className="badge badge-secondary text-sm">
                {selectedMarker.timeReported}
              </div>
            </h2>
            <p className="text-sm">Location: {address}</p>
            <div className="card-actions justify-end">
              <div className="badge badge-outline text-xs mt-2">
                Reported by: {selectedMarker.reporter}
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className="card w-96 bg-base-100 shadow-xl fixed z-10 top-20 right-2 min-w-2 rounded-lg"
        style={{ height: "560px", overflowY: "auto" }}
      >
        <div className="card-header p-2 bg-base100 border-b border-gray-300 pl-8 pt-4">
          <h2 className="card-title">Shipment Details</h2>{" "}
          {/* Card title fixed at the top */}
        </div>
        <div
          className="card-body pt-2"
          style={{ maxHeight: "100%", overflowY: "auto" }}
        >
          {cargoDeets.map((cargoDeet) => (
            <div key={cargoDeet.cargo_id}>
              <h4 className="card-title text-base">
                {cargoDeet.air_waybill_number}

                <div className="badge badge-secondary text-xs">
                  <RelativeTime shipmentDate={cargoDeet.shipment_date} />
                </div>
              </h4>
              <h4 className="card-title text-base">
                Description: {cargoDeet.contents}
              </h4>
              <p className="text-xs">Origin: {cargoDeet.departure_location}</p>
              <p className="text-xs">Current Location:{currentLocation}</p>
              <p className="text-xs">
                Destination: {cargoDeet.destination_location}
              </p>
              <div className="card-actions justify-end">
                <div
                  className={`badge badge-outline text-xs mt-2 mb-2 ${
                    cargoDeet.shipment_status === "Delivered"
                      ? "badge-success"
                      : cargoDeet.shipment_status === "Scheduled"
                      ? " badge-info"
                      : cargoDeet.shipment_status === "In Transit"
                      ? "badge-outline"
                      : ""
                  } `}
                >
                  {cargoDeet.shipment_status}
                </div>
              </div>
              <hr /> {/* Add a horizontal rule after each report */}
            </div>
          ))}
        </div>
      </div>
      <button
        className="bg-base-100 p-2 rounded-full shadow-md text-black fixed z-10 bottom-6 right-2"
        onClick={handleLocateUser}
      >
        Show Your Location
      </button>

      <div className="flex-grow absolute top-0 left-0 w-full h-full z-0 lg:rounded">
        <MapContainer
          center={[14.5092, 121.0144]}
          zoom={20}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            attribution={`&copy; 
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 
            contributors`}
            url="https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png"
          />
          <LocationMarker />
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={8} // Adjust the maxClusterRadius as per your requirement
          >
            {/* Mapping through the markers */}
            {cargoDeets.map((cargo) => (
              <Marker
                key={cargo.cargo_id}
                position={[cargo.latitude, cargo.longitude]}
                icon={cargoMarker}
                eventHandlers={{
                  click: () => handleMarkerClick(cargo),
                }}
              >
                <Popup>
                  AWB Number: {cargo.air_waybill_number} <br />
                  Content: {cargo.contents} <br />
                  Origin: {cargo.departure_location}
                  <br />
                  Destination: {cargo.destination_location}
                  <br />
                  Status: {cargo.shipment_status}
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>

          <div className="leaflet-bottom right-3 bottom-6 leaflet-right"></div>
        </MapContainer>
      </div>
    </>
  );
};

export default MapComponent;
