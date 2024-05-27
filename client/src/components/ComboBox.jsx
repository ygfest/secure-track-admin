import React from "react";

const UserComboBox = ({ options, onChange, value }) => {
  return (
    <div className="form-control">
      <select
        className="select select-bordered"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((luggageOption) => (
          <option
            key={luggageOption._id}
            value={luggageOption.luggage_tag_number}
          >
            {luggageOption.luggage_tag_number}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserComboBox;
