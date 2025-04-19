// BankRequestPage.jsx
import { useState } from "react";
import BankMapCard from "../components/BankCard";
import { useBankStore } from "../stores/useBankStore";
import Navbar from "../components/Navbar";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BankRequestPage = () => {
  const { createBankRequest } = useBankStore();
  const [selectedBank, setSelectedBank] = useState(null);

  const [formData, setFormData] = useState({
    bloodgroup: "",
    quantity: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBank) return alert("Please select a bank from the map.");

    const payload = {
      bank: selectedBank.name,
      bloodgroup: formData.bloodgroup,
      quantity: formData.quantity,
      location: selectedBank.location,
    };

    const res = await createBankRequest(payload);
    if (res?.status === 200) {
      alert("Bank request submitted!");
      setFormData({ bloodgroup: "", quantity: "" });
    }
  };

  return (
    <>
      <Navbar /> {/* 👈 Add Navbar at the very top */}
      <div className="p-6 max-w-4xl mx-auto">
        <BankMapCard onBankSelect={setSelectedBank} />

        <div className="bg-base-200 p-6 rounded-lg shadow mt-6">
          <h2 className="text-lg font-semibold mb-4">
            Request Blood from Bank
          </h2>
          {selectedBank && (
            <div className="mb-4 text-sm text-gray-600">
              Selected Bank: <strong>{selectedBank.name}</strong>
              <br />
              Location: Lat {selectedBank.location.latitude}, Lng{" "}
              {selectedBank.location.longitude}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Blood Group</label>
              <select
                name="bloodgroup"
                className="w-full p-2 border rounded"
                value={formData.bloodgroup}
                onChange={handleInputChange}
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Quantity (bags)</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                min={1}
                max={10}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BankRequestPage;
