import { useState } from "react";
import BankMapCard from "../components/BankCard";
import { useBankStore } from "../stores/useBankStore";

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
      <div className="p-6 max-w-4xl mx-auto ">
        <BankMapCard onBankSelect={setSelectedBank} />

        <div className="bg-primary p-6 rounded-lg shadow mt-6">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Request Blood from Bank
          </h2>
          {selectedBank && (
            <div className="mb-4 text-sm text-black">
              Selected Bank: <strong>{selectedBank.name}</strong>
              <br />
              Location: Lat {selectedBank.location.latitude}, Lng{" "}
              {selectedBank.location.longitude}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-black">
                Blood Group
              </label>
              <select
                name="bloodgroup"
                className="w-full p-2 border border-black rounded bg-secondary"
                value={formData.bloodgroup}
                onChange={handleInputChange}
              >
                <option value="" className="text-black">
                  Select Blood Group
                </option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group} className="text-black">
                    {group}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-black">
                Quantity (bags)
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-secondary border border-black"
                min={1}
                max={10}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-secondary w-full text-black font-bold border border-black"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BankRequestPage;
