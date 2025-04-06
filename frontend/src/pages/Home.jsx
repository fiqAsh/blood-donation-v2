import React from "react";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CreatePost />
    </div>
  );
};

export default Home;
