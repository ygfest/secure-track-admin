import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon } from "leaflet";

import hazardPinIcon from "../assets/aler-hazard.svg";
import hospitalAlertIcon from "../assets/ambulance.svg";
import fireAlertIcon from "../assets/alert-fire.svg";

// create custom icons
const hazardIcon = new Icon({
  iconUrl: hazardPinIcon,
  iconSize: [40, 40], // size of the icon
});

const hospitalIcon = new Icon({
  iconUrl: hospitalAlertIcon,
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
    icon: hospitalIcon,
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

const UserSide = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (selectedMarker) {
      const fetchAddress = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${selectedMarker.geocode[0]}&lon=${selectedMarker.geocode[1]}&format=json`
          );
          const data = await response.json();
          setAddress(data.display_name);
        } catch (error) {
          console.error("Error fetching address: ", error);
        }
      };

      fetchAddress();
    }
  }, [selectedMarker]);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  return (
    <>
      <div className="card w-96 bg-base-100 shadow-xl fixed z-10 top-20 right-2 min-w-2 rounded-lg">
        {selectedMarker && (
          <div className="card-body">
            <h2 className="card-title">
              {selectedMarker.popUp}
              <div className="badge badge-secondary">
                {selectedMarker.timeReported}
              </div>
            </h2>
            <p>Location: {address}</p>
            <div className="card-actions justify-end">
              <div className="badge badge-outline text-xs mt-2">
                Reported by: {selectedMarker.reporter}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow absolute top-0 left-0 w-full h-full z-0 lg:rounded">
        <MapContainer
          center={[14.5092, 121.0144]}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            attribution={`&copy; 
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 
            contributors`}
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
          >
            {/* Mapping through the markers */}
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.geocode}
                icon={marker.icon}
                eventHandlers={{
                  click: () => handleMarkerClick(marker),
                }}
              >
                <Popup>{marker.popUp}</Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
          <div className="leaflet-bottom right-3 bottom-6 leaflet-right">
            <button
              className="bg-white p-2 rounded-full shadow-md"
              onClick={{ LocationMarker }}
            >
              Show Your Location
            </button>
          </div>
        </MapContainer>
      </div>
    </>
  );
};

export default UserSide;
