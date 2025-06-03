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
    <div className="relative min-h-screen">
      <div className="pt-[72px] flex flex-row">
        {" "}
        <div className="w-full md:w-[70%] p-4 bg-base-100 overflow-y-auto max-h-[calc(100vh-72px)] ">
          <CreatePost />

          <div className="flex items-center justify-between mb-4 mt-4">
            <h1 className="text-2xl font-bold text-primary-content">
              Blood Donation Posts
            </h1>
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="btn btn-accent btn-sm border  shadow-lg"
              title="Toggle Filter"
            >
              <FunnelIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          {showFilter && <PostFilter />}
          <ShowPost />
        </div>
        {/* Fixed Sidebar */}
        <div className="hidden md:block md:w-[30%] pl-2 pr-2 border-l border-gray-200 bg-base-100 fixed top-[72px] right-0 h-[calc(100vh-72px)] overflow-y-auto">
          <DonorSearch />
        </div>
      </div>
    </div>
  );
};

export default Home;
