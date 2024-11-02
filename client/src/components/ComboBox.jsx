import React from "react";

const UserComboBox = ({ options, onChange, value }) => {
  return (
    <div className="form-control">
      <select
        className="select select-bordered focus:outline-none focus:ring-2 focus:ring-primary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((luggageOption) => (
          <option
            className="hover:bg-green-300"
            key={luggageOption._id}
            value={luggageOption.luggage_custom_name}
          >
            {luggageOption.luggage_custom_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserComboBox;
