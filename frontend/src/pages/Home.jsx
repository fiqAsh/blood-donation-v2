import React from "react";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import ShowPost from "../components/ShowPost";
import SearchFilter from "../components/SearchFilter";
import BankFilter from "../components/BankFilter";
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CreatePost />
      <SearchFilter />
      <ShowPost />
    </div>
  );
};

export default Home;
