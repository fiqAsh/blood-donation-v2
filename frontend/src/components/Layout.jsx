import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 w-full z-[9999]">
        <Navbar />
        <hr className="border-black" />
      </div>

      <div className="pt-[72px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
