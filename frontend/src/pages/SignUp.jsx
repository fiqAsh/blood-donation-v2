import React, { useState } from "react";
import MapComponent from "../components/MapComponent";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodGroup: "",
    mobile: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    latitude: null,
    longitude: null,
  });

  const [message, setMessage] = useState("");
  const [showMap, setShowMap] = useState(false);

  const genderConfig = {
    male: { height: { min: 150, max: 200 }, weight: { min: 50, max: 120 } },
    female: { height: { min: 140, max: 180 }, weight: { min: 40, max: 100 } },
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["age", "weight", "height", "mobile"].includes(name)
        ? Number(value) || ""
        : value,
    });
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      setMessage(response.data.message);
      setFormData({
        name: "",
        email: "",
        password: "",
        bloodGroup: "",
        mobile: "",
        gender: "",
        age: "",
        height: "",
        weight: "",
        latitude: null,
        longitude: null,
      });
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 ">
      <div className="bg-base-300 p-6 rounded-lg shadow-lg w-full max-w-xl">
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form className=" grid grid-cols-2 gap-4 bg-base-300">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="input-primary bg-base-200 rounded-lg p-2 shadow-sm focus:outline-none"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-base-200 input-primary rounded-lg p-2 shadow-sm focus:outline-none"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-base-200 input-primary rounded-lg p-2 shadow-sm focus:outline-none"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <select
              name="bloodGroup"
              className="bg-base-200 input-primary rounded-lg p-2 shadow-sm focus:outline-none"
              required
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <div className="flex items-center rounded-lg p-2 shadow-sm bg-base-200">
              <span className="input-primary pr-2">+880</span>
              <input
                type="text"
                placeholder="1XXXXXXXXX"
                className="bg-base-200 input-primary flex-1 outline-none focus:outline-none"
                required
                name="mobile"
                value={formData.mobile}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 10) value = value.slice(0, 10);
                  setFormData({ ...formData, mobile: value });
                }}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <select
              name="gender"
              className="bg-base-200 select-primary rounded-lg p-2 shadow-sm focus:outline-none"
              required
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input
              type="number"
              placeholder="Age"
              className="bg-base-200 input-primary rounded-lg p-2 shadow-sm focus:outline-none"
              required
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="65"
              disabled={!formData.gender}
            />
            <input
              type="number"
              placeholder="Height (cm)"
              className="bg-base-200 input-primary rounded-lg p-2 shadow-sm focus:outline-none"
              required
              name="height"
              value={formData.height}
              onChange={handleChange}
              min={
                formData.gender ? genderConfig[formData.gender].height.min : 0
              }
              max={
                formData.gender ? genderConfig[formData.gender].height.max : 999
              }
              disabled={!formData.gender}
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              className="bg-base-200 input-primary rounded-lg p-2 shadow-sm focus:outline-none"
              required
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min={
                formData.gender ? genderConfig[formData.gender].weight.min : 0
              }
              max={
                formData.gender ? genderConfig[formData.gender].weight.max : 999
              }
              disabled={!formData.gender}
            />
          </div>
        </form>

        <div className="mt-6">
          <h3
            className="text-lg font-semibold mb-2 cursor-pointer text-accent-content hover:underline"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? "Hide Map" : "Select Your Location"}
          </h3>
          {showMap && (
            <div className="mt-4">
              <MapComponent onLocationSelect={handleLocationSelect} />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center mt-6">
          <button
            className="btn text-white font-bold py-2 px-6 rounded-lg shadow-md w-full"
            type="submit"
            onClick={handleSubmit}
          >
            Sign Up
          </button>
          <p className="mt-2 text-sm">
            Already signed up? Log in ➡{" "}
            <a href="/" className="text hover:underline">
              LOGIN
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
