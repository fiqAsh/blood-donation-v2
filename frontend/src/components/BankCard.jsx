import { useEffect, useState } from "react";
import { useBankStore } from "../stores/useBankStore";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuthStore } from "../stores/useAuthStore";

const dhakaPosition = [23.8103, 90.4125];

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const BankMapCard = ({ onBankSelect }) => {
  const { bankData, fetchBankData, updateBankDetails } = useBankStore();
  const { user } = useAuthStore();
  const [selectedBank, setSelectedBank] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", bloodInventory: {} });

  useEffect(() => {
    fetchBankData();
  }, []);
  const getInventoryList = (inventory) => {
    if (!inventory || typeof inventory !== "object")
      return <p>No inventory data</p>;

    return Object.entries(inventory).map(([group, quantity]) => (
      <p key={group}>
        <span className="font-semibold">
          {group.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:
        </span>{" "}
        {quantity}
      </p>
    ));
  };

  const handleEditClick = (bank) => {
    setSelectedBank(bank);
    setFormData({
      name: bank.name,
      bloodInventory: { ...bank.bloodInventory },
    });
    setEditMode(true);
  };

  const handleInventoryChange = (group, value) => {
    setFormData((prev) => ({
      ...prev,
      bloodInventory: {
        ...prev.bloodInventory,
        [group]: Number(value),
      },
    }));
  };

  const handleSubmit = async () => {
    const res = await updateBankDetails(selectedBank._id, formData);
    if (res?.status === 200) {
      alert("Bank updated!");
      fetchBankData(); // refresh data
      setEditMode(false);
    }
  };

  const renderInventoryInputs = () => {
    const groups = [
      "A_positive",
      "A_negative",
      "B_positive",
      "B_negative",
      "AB_positive",
      "AB_negative",
      "O_positive",
      "O_negative",
    ];
    return groups.map((group) => (
      <div key={group} className="mb-2">
        <span className="font-semibold">
          {group.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:
        </span>{" "}
        <input
          type="number"
          min="0"
          value={formData.bloodInventory[group] || 0}
          onChange={(e) => handleInventoryChange(group, e.target.value)}
          className="input  w-full bg-accent text-black border border-black"
        />
      </div>
    ));
  };

  return (
    <div className="p-4 bg-primary rounded-lg shadow mb-6 border border-black">
      <h2 className="text-xl font-bold mb-4 text-accent-content">
        Blood Bank Locations
      </h2>
      <div className="border border-black">
        <MapContainer
          center={dhakaPosition}
          zoom={12}
          style={{ height: "500px", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {bankData.map((bank) => (
            <Marker
              key={bank._id}
              position={[bank.location.latitude, bank.location.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  if (user?.user?.role === "admin") {
                    handleEditClick(bank);
                  } else {
                    onBankSelect(bank);
                  }
                },
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{bank.name}</h3>
                  <p className="text-sm text-gray-500">
                    Lat: {bank.location.latitude}, Lng:{" "}
                    {bank.location.longitude}
                  </p>
                  {getInventoryList(bank.bloodInventory)}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Edit Form */}
      {editMode && selectedBank && user?.user?.role === "admin" && (
        <div className="mt-6 p-4 bg-secondary rounded shadow text-black border border-black">
          <h3 className="font-bold text-lg mb-2">Edit Bank</h3>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Bank Name</label>
            <input
              type="text"
              className="input w-full bg-accent border border-black"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2">Inventory</h4>
            {renderInventoryInputs()}
          </div>

          <button
            onClick={handleSubmit}
            className="btn btn-secondary mt-4 w-full border border-black"
          >
            Update Bank
          </button>
        </div>
      )}
    </div>
  );
};

export default BankMapCard;
