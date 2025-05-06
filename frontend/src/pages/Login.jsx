import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);

      setMessage(response.data.message);
      setFormData({ email: "", password: "" });
      console.log("Role:", response?.data?.user?.role);

      navigate("/home");
    } catch (error) {
      console.log("login failed", error.response?.data);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card bg-base-300 p-6 rounded-lg shadow-lg">
        {message && <p className="text-center text-red-500">{message}</p>}
        <form className="flex flex-col gap-4 bg-base-300">
          <input
            type="email"
            placeholder="Email"
            className="input-primary bg-base-200   rounded-lg p-2 shadow-sm focus:outline-none "
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-primary bg-base-200  rounded-lg p-2 shadow-sm focus:outline-none"
            required
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </form>
        <div className="flex justify-center mt-6 flex-col">
          <button
            className="btn text-white font-bold py-2 px-6 rounded-lg shadow-md  w-full"
            onClick={handleSubmit}
          >
            Login
          </button>
          <p className="inline-block ">
            Have No Account? Sign Up here!! ➡{" "}
            <a href="/signup" className="text hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
