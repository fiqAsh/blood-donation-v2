import React, { useState } from "react";
import { usePostStore } from "../stores/usePostStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import MapComponent from "./MapComponent";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

const SearchFilter = () => {
  const { filterPost } = usePostStore();
  const { searchForDonor, user } = useAuthStore();

  const [urgency, setUrgency] = useState("");
  const [time, setTime] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [coords, setCoords] = useState(null);
  const [maxDistance, setMaxDistance] = useState("5000");

  const [donorResults, setDonorResults] = useState([]);
  const [donorSearchError, setDonorSearchError] = useState("");
  const navigate = useNavigate();

  const handlePostFilter = () => {
    const filters = {};
    if (urgency) filters.urgency = urgency;
    if (time) filters.time = time;
    filterPost(filters);
  };

  const handleDonorSearch = async () => {
    if (!bloodGroup) return alert("Please select a blood group");

    console.log("coords before search:", coords);

    const filters = {
      bloodgroup: bloodGroup,
      ...(coords && {
        latitude: coords.lat,
        longitude: coords.lng,
        maxDistance,
      }),
    };

    try {
      const result = await searchForDonor(filters);
      console.log(result);
      const donors = result?.donors;

      if (donors?.length) {
        setDonorResults(donors);
        setDonorSearchError("");
      } else {
        setDonorResults([]);
        setDonorSearchError("No donors found.");
      }
    } catch (error) {
      console.error("Error searching donors:", error);
      setDonorSearchError("Something went wrong while searching.");
    }
  };

  const handleMessage = async (receiver, text) => {
    try {
      await axiosInstance.post("/messages", {
        receiverId: receiver._id,
        text,
      });

      navigate("/messagepage", {
        state: {
          selectedUser: receiver,
        },
      });
    } catch (error) {
      console.error("Failed to send message:", error.response?.data);
      alert("Failed to send message. Try again.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Search & Filter</h2>

      {/* Filter Posts */}
      <div className="space-y-2">
        <h3 className="font-medium">Filter Posts</h3>
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Urgency</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Time</option>
          <option value="today">Today</option>
          <option value="1 week">Last 1 Week</option>
          <option value="1 month">Last 1 Month</option>
        </select>

        <button
          onClick={handlePostFilter}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Filter Posts
        </button>
      </div>

      <hr />

      {/* Search Donors */}
      <div className="space-y-2">
        <h3 className="font-medium">Search Donors</h3>
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <MapComponent
          onLocationSelect={(lat, lng) => setCoords({ lat, lng })}
        />

        <input
          type="number"
          placeholder="Max Distance (meters)"
          value={maxDistance}
          onChange={(e) => setMaxDistance(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={handleDonorSearch}
          className="w-full bg-red-600 text-white p-2 rounded"
        >
          Search Donors
        </button>
      </div>

      {/* Display Results */}
      {donorSearchError && (
        <p className="text-red-500 text-sm">{donorSearchError}</p>
      )}

      {donorResults.length > 0 && (
        <div className="pt-4">
          <h4 className="font-semibold text-gray-600 mb-2">Donors Found:</h4>
          <div className="space-y-2">
            {donorResults.map((donor, idx) => (
              <div
                key={idx}
                className="border p-3 rounded bg-gray-50 space-y-1"
              >
                <p className="font-medium">{donor.name}</p>
                <p className="text-sm text-gray-600">
                  Blood Group: {donor.bloodGroup}
                </p>
                <p className="text-sm text-gray-600">Mobile: {donor.mobile}</p>

                {/* Only show message button if the logged-in user is not the donor */}
                {donor._id !== user?.user._id && (
                  <button
                    onClick={() =>
                      handleMessage(
                        donor,
                        `Hi ${donor.name}, I found your profile through the donor search and would like to get in touch.`
                      )
                    }
                    className="mt-2 btn btn-primary w-full"
                  >
                    Message {donor.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
