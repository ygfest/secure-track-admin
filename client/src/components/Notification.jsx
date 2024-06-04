import React from "react";

const Notification = () => {
  return (
    <div
      className="card w-96 bg-base-100 shadow-xl fixed z-10 top-20 right-2 min-w-2 rounded-lg"
      style={{ height: "560px", overflowY: "auto" }}
    >
      <div className="card-header p-2 bg-base100 border-b border-gray-300 pl-8 pt-4">
        <h2 className="card-title">Alerts and Notifications</h2>{" "}
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
  );
};

export default Notification;
