import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log("logout failed", error.response?.data);
    }
  };

  return (
    <div className="w-full flex justify-end items-center space-x-4 p-4 bg-base-200 shadow-md ">
      <button
        onClick={() => navigate("/home")}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-blue-600"
      >
        Home
      </button>

      <button
        onClick={() => navigate("/profile")}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-blue-600"
      >
        Profile
      </button>

      <button
        onClick={() => navigate("/messagepage")}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-blue-600"
      >
        Messages
      </button>
      <button
        onClick={() => navigate("/bankrequest")}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-blue-600"
      >
        Bank request
      </button>

      {user?.user?.role === "admin" && (
        <button
          onClick={() => navigate("/adminpage")}
          className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-red-700"
        >
          Admin Panel
        </button>
      )}

      <button
        onClick={handleLogout}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-blue-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
