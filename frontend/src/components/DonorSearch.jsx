import React, { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import MapComponent from "./MapComponent";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

const DonorSearch = () => {
  const { searchForDonor, user } = useAuthStore();
  const [bloodGroup, setBloodGroup] = useState("");
  const [coords, setCoords] = useState(null);

  const [donorResults, setDonorResults] = useState([]);
  const [donorSearchError, setDonorSearchError] = useState("");
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const handleDonorSearch = async () => {
    if (!bloodGroup) return alert("Please select a blood group");

    const filters = {
      bloodgroup: bloodGroup,
      ...(coords && {
        latitude: coords.lat,
        longitude: coords.lng,
      }),
    };

    try {
      const result = await searchForDonor(filters);
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
    <div className="space-y-4 p-4 bg-base-100 rounded shadow">
      <h3 className="text-lg font-semibold text-primary-accent">
        Search Donors
      </h3>

      <select
        value={bloodGroup}
        onChange={(e) => setBloodGroup(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="" className="text-black">
          Select Blood Group
        </option>
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
          <option key={group} value={group} className="text-black">
            {group}
          </option>
        ))}
      </select>

      <div className="mt-6">
        <h3
          className="text-lg font-semibold mb-2 cursor-pointer text-accent-content hover:underline"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? "Hide Map" : "Select Your Location"}
        </h3>
        {showMap && (
          <MapComponent
            onLocationSelect={(lat, lng) => setCoords({ lat, lng })}
          />
        )}
      </div>

      <button
        onClick={handleDonorSearch}
        className="w-full btn btn-warning text-white p-2 rounded"
      >
        Search Donors
      </button>

      {donorSearchError && (
        <p className="text-red-500 text-sm">{donorSearchError}</p>
      )}

      {donorResults.length > 0 && (
        <div className="pt-4">
          <h4 className="font-bold text-info mb-2">Donors Found:</h4>
          <div className="space-y-2">
            {donorResults.map(
              (donor, idx) =>
                donor._id !== user?.user._id && (
                  <div
                    key={idx}
                    className="border p-3 rounded bg-gray-50 space-y-1"
                  >
                    <p className="font-medium text-accent">{donor.name}</p>
                    <p className="text-sm font-bold text-error">
                      Blood Group: {donor.bloodGroup}
                    </p>
                    <p className="text-sm font-bold text-error">
                      Mobile: 0{donor.mobile}
                    </p>

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
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorSearch;
