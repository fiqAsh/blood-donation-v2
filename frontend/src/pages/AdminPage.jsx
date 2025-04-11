import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";

const AdminPage = () => {
  const { user, checkingAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkingAuth && user?.user?.role !== "admin") {
      navigate("/home");
    }
  }, [checkingAuth, user]);

  if (checkingAuth || !user) return <Loading />;

  return (
    <div>
      <Navbar />
      <h1>Welcome Admin!</h1>
    </div>
  );
};

export default AdminPage;
