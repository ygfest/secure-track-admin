import React from "react";

const UserAddLuggageModal = ({ userId }) => {
  if (!show) return null;

  const handleAddNewLuggage = async (newLuggage) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const luggageWithTimestamp = {
        ...newLuggage,
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post(
        `${apiUrl}/luggage-router/addluggage`,
        luggageWithTimestamp
      );

      if (response.status === 201) {
        await fetchLuggageData();

        toast.success("Luggage added successfully");
      } else {
        toast.error("Luggage Tag already in use");
      }

      setShowAddModal(false);
    } catch (error) {
      console.log("error adding luggage", error);
      toast.error("Luggage Tag already in use");
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[8000] bg-white bg-opacity-20">
      <div className="bg-[#020202a0] backdrop-blur-xl text-white p-6 w-[80%] md:w-[30%] rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold font-poppins mb-4">
          Add New Luggage
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              luggage_custom_name: e.target.luggage_custom_name.value,
              luggage_tag_number: e.target.luggage_tag_number.value,
              user_id: userId,
            });
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
          <div className="form-control mt-6 flex flex-row justify-end gap-4">
            <button
              type="button"
              className="btn bg-[#403e3ea3] text-white border-none"
              onClick={onClose}
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
          onClick={onClose}
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
  );
};

export default UserAddLuggageModal;
