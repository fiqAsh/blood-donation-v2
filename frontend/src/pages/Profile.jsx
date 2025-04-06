import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../stores/useAuthStore";
import UserInfo from "../components/UserInfo";
import UserPosts from "../components/UserPosts";
import UserNotifications from "../components/UserNotifications";
import PostStatus from "../components/PostStatus";

const Profile = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("info");
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* User Info */}
      <div className="w-full bg-blue-100 py-4 px-6 border-b border-gray-300">
        <h2 className="text-lg font-semibold text-gray-800">Hello, User</h2>
        <p className="text-gray-600">Joined on:</p>
      </div>

      <hr />

      {/* {tabs section} */}

      <div className="w-4/5 mx-auto bg-white mt-6 p-4 border border-gray-300 rounded-lg shadow-sm">
        <div className="flex justify-center space-x-6 pb-3">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "info"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "posts"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            My Posts
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "notifications"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab("reqStatus")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "reqStatus"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Request Status
          </button>
        </div>

        {/* tabcontent */}

        <div className="mt-6">
          {activeTab === "info" && <UserInfo user={user} />}
          {activeTab === "posts" && <UserPosts userId={user.user._id} />}
          {activeTab === "notifications" && (
            <UserNotifications userId={user.user._id} />
          )}
          {activeTab === "reqStatus" && <PostStatus userId={user.user._id} />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
