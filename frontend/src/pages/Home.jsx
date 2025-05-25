import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import ShowPost from "../components/ShowPost";
import DonorSearch from "../components/DonorSearch";
import PostFilter from "../components/PostFilter";
import { FunnelIcon } from "@heroicons/react/24/outline";

const Home = () => {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <hr />

      <div className="flex flex-1 flex-row ">
        {/* Main Content */}
        <div className="w-full md:w-[70%] p-4 bg-base-200">
          <CreatePost />

          {/* Heading with Filter Icon */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Blood Donation Posts</h1>
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="btn btn-ghost btn-sm"
              title="Toggle Filter"
            >
              <FunnelIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Conditionally render PostFilter */}
          {showFilter && <PostFilter />}

          <ShowPost />
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-[30%] pl-2 pr-2 border-l border-gray-200 bg-base-200 ">
          <DonorSearch />
        </div>
      </div>
    </div>
  );
};

export default Home;
