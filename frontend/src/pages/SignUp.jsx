import React, { useState } from "react";
import MapComponent from "../components/MapComponent";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import InfoPanel from "../components/InfoPanel";

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
  const [showForm, setShowForm] = useState(false);

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
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen ">
      {/* Left Side - Info Panel */}
      <div className=" text-primary-content flex flex-col justify-center items-center p-8">
        <InfoPanel
          title="Welcome to BloodConnect"
          subtitle="🚑 Connecting donors and recipients in real-time"
          slides={[
            "📍 Location-based donor matching",
            "🩸 Track requests & donations easily",
            "🔔 Get notified when you're needed",
            "💬 Chat with recipients/donors directly",
          ]}
          mode="signup"
        />
      </div>

      {/* Right Side - Signup Section */}
      <div className="flex justify-center items-center p-6 bg-base-100 ">
        {!showMap && !showForm ? (
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-4">Ready to join?</h2>
            <p className="mb-6">
              Become a donor or find help fast. Start your journey here.
            </p>
            <button
              className="btn btn-accent text-white px-6 py-2 rounded-lg"
              onClick={() => setShowForm(true)}
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="bg-primary p-6 rounded-lg shadow-lg w-full max-w-xl">
            {message && (
              <p className="text-center text-red-500 mb-4">{message}</p>
            )}

            <form className=" grid grid-cols-2 gap-4 bg-primary">
              {/* Left Column */}
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className=" bg-rose-200 rounded-lg p-2 shadow-sm focus:outline-none border-black border-[1px] placeholder:text-black"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-rose-200 input-primary rounded-lg p-2 shadow-sm focus:outline-none border-black border-[1px] placeholder:text-black"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="bg-rose-200 input-primary rounded-lg p-2 shadow-sm focus:outline-none border-black border-[1px] placeholder:text-black"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <select
                  name="bloodGroup"
                  className="bg-rose-200  rounded-lg p-2 shadow-sm focus:outline-none border-black border-[1px] text-black "
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

                <div className="flex items-center rounded-lg p-2 shadow-sm bg-rose-200 border-black placeholder:text-black border-[1px]">
                  <span className="text-black pr-2 whitespace-nowrap">
                    +880
                  </span>
                  <input
                    type="text"
                    placeholder="1XXXXXXXXX"
                    className="bg-rose-200 input-primary flex-1 min-w-0 outline-none focus:outline-none text-black"
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
                  className="bg-rose-200 select-primary rounded-lg p-2 shadow-sm focus:outline-none border-black border-[1px]  text-black"
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
                  className="bg-rose-200 input-primary rounded-lg p-2 shadow-sm focus:outline-none border-black border-[1px] placeholder:text-black"
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
                  className="bg-rose-200 input-primary rounded-lg p-2 shadow-sm focus:outline-none border-black border-[1px] placeholder:text-black"
                  required
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min={
                    formData.gender
                      ? genderConfig[formData.gender].height.min
                      : 0
                  }
                  max={
                    formData.gender
                      ? genderConfig[formData.gender].height.max
                      : 999
                  }
                  disabled={!formData.gender}
                />
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  className="bg-rose-200  input-primary rounded-lg p-2 shadow-sm focus:outline-none border-black border-[1px] placeholder:text-black"
                  required
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min={
                    formData.gender
                      ? genderConfig[formData.gender].weight.min
                      : 0
                  }
                  max={
                    formData.gender
                      ? genderConfig[formData.gender].weight.max
                      : 999
                  }
                  disabled={!formData.gender}
                />
              </div>
            </form>

            <div className="mt-6">
              <h3
                className="text-lg font-semibold mb-2 cursor-pointer text-primary-content hover:underline"
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
                className="btn btn-accent font-bold py-2 px-6 rounded-lg shadow-md w-full"
                type="submit"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
              <p className="mt-2 text-sm">
                Already signed up? Log in ➡{" "}
                <a href="/" className="text font-bold hover:underline">
                  LOGIN
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
