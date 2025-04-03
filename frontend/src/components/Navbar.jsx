import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

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
    <div className="flex justify-end space-x-4">
      <button
        onClick={() => navigate("/home")}
        className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600"
      >
        Home
      </button>
      <button
        onClick={() => navigate("/profile")}
        className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600"
      >
        Profile
      </button>
      <button
        onClick={handleLogout}
        className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600"
      >
        Logout
      </button>
    </div>
  );
};
export default Navbar;
