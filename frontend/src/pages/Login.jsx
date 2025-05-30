import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import InfoPanel from "../components/InfoPanel"; // adjust path if needed

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
      navigate("/home");
    } catch (error) {
      console.log("login failed", error.response?.data);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Left: InfoPanel */}
      <div className="flex flex-col justify-center items-center bg-base-100 text-primary-content p-8">
        <InfoPanel
          title="Welcome Back!"
          subtitle="Login to find or help someone in need"
          slides={[
            "🔐 Secure & private access",
            "📊 View your donation history",
            "💬 Chat with recipients directly",
          ]}
          mode="login"
        />
      </div>

      {/* Right: Login Form */}
      <div className="flex justify-center items-center p-6 bg-base-100">
        <div className="card bg-primary p-6 rounded-lg shadow-lg w-full max-w-md">
          {message && <p className="text-center text-red-500">{message}</p>}
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="input bg-rose-200 rounded-lg p-2 shadow-sm focus:outline-none w-full text-black"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              className="input bg-rose-200 rounded-lg p-2 shadow-sm focus:outline-none w-full text-black"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              className="btn btn-accent text-black font-bold py-2 px-6 rounded-lg shadow-md w-full"
              onClick={handleSubmit}
              type="submit"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-black">
            Have No Account?{" "}
            <a href="/signup" className="text-primary-content hover:underline">
              Sign Up here!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
