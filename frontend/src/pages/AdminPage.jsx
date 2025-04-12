import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { useBankStore } from "../stores/useBankStore";
import BankFilter from "../components/BankFilter";

const AdminPage = () => {
  const { user, checkingAuth } = useAuthStore();
  const { bankData, fetchBankData } = useBankStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkingAuth && user?.user?.role !== "admin") {
      navigate("/home");
    } else {
      fetchBankData();
    }
  }, [checkingAuth, user]);

  if (checkingAuth || !user) return <Loading />;
  console.log(bankData);

  return (
    <div>
      <Navbar />
      <h1>Admin DashBoard</h1>
      <BankFilter />
    </div>
  );
};

export default AdminPage;
