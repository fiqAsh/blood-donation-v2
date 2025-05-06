import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const isAdmin = user?.user?.role === "admin";

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

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar w-full flex justify-end items-center space-x-4 p-4 bg-base-200 shadow-md">
      {/* Non-admin buttons */}
      {!isAdmin && (
        <>
          <button
            onClick={() => navigate("/home")}
            className={`btn ${
              isActive("/home") ? "btn-primary" : "btn-neutral"
            }`}
          >
            Home
          </button>

          <button
            onClick={() => navigate("/bankrequest")}
            className={`btn ${
              isActive("/bankrequest") ? "btn-primary" : "btn-neutral"
            }`}
          >
            Bank request
          </button>
        </>
      )}

      {/* Common to all users */}
      <button
        onClick={() => navigate("/messagepage")}
        className={`btn ${
          isActive("/messagepage") ? "btn-primary" : "btn-neutral"
        }`}
      >
        Messages
      </button>

      <button
        onClick={() => navigate("/profile")}
        className={`btn ${
          isActive("/profile") ? "btn-primary" : "btn-neutral"
        }`}
      >
        Profile
      </button>

      {/* Admin-only */}
      {isAdmin && (
        <button
          onClick={() => navigate("/adminpage")}
          className={`btn ${
            isActive("/adminpage") ? "btn-primary" : "btn-warning"
          }`}
        >
          Admin Panel
        </button>
      )}

      <button onClick={handleLogout} className="btn btn-neutral">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
