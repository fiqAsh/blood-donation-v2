import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../stores/useAuthStore";
import UserInfo from "../components/UserInfo";
import UserPosts from "../components/UserPosts";
import UserNotifications from "../components/UserNotifications";
import PostStatus from "../components/PostStatus";
import UserBankRequest from "../components/UserBankRequest";
import { useNotificationStore } from "../stores/useNotificationStore";

const Profile = () => {
  const { user, calculateBMI } = useAuthStore();
  const { getNotifications, notifications } = useNotificationStore();

  const [activeTab, setActiveTab] = useState("info");
  const [bmiResult, setBmiResult] = useState(null);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const isAdmin = user?.user?.role === "admin";

  useEffect(() => {
    getNotifications();
    const fetchBMI = async () => {
      const result = await calculateBMI();
      setBmiResult(result);
    };
    fetchBMI();
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <hr />

      {/* User Info */}
      <div className="w-full bg-black py-4 px-6 border-b border-gray-300">
        <h2 className="text-lg font-semibold text">Hello, {user.user.name}</h2>
        {bmiResult && (
          <div className="mt-2 text-sm text">
            <p>
              <span className="font-medium">BMI:</span>{" "}
              {bmiResult.bmi.toFixed(2)}
            </p>
            <p>
              <span className="font-medium text">Category:</span>{" "}
              {bmiResult.category}
            </p>
          </div>
        )}

        <p className="text">
          Joined on{" "}
          {new Date(user.user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <hr />

      {/* {tabs section} */}

      <div className="w-4/5 mx-auto bg-base-100 mt-6 p-4 border border-gray-300 rounded-lg shadow-sm">
        <div className="flex justify-center space-x-6 pb-3">
          {/* Profile tab (Always visible) */}
          <button
            onClick={() => setActiveTab("info")}
            className={`py-2 px-4 font-semibold ${
              activeTab === "info"
                ? "text border-b-2 border-accent-content"
                : "text-warning hover:text-warning-content"
            }`}
          >
            Profile
          </button>

          {/* Show other tabs only if NOT admin */}
          {!isAdmin && (
            <>
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-2 px-4 font-semibold ${
                  activeTab === "posts"
                    ? "text border-b-2 border-accent-content"
                    : "text-warning hover:text-warning-content"
                }`}
              >
                My Posts
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`py-2 px-4 font-semibold ${
                  activeTab === "notifications"
                    ? "text border-b-2 border-accent-content"
                    : "text-warning hover:text-warning-content"
                }`}
              >
                Notifications
                {unreadCount > 0 && (
                  <div className="badge badge-xs badge-secondary ml-1 rounded ">
                    {unreadCount}
                  </div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("reqStatus")}
                className={`py-2 px-4 font-semibold ${
                  activeTab === "reqStatus"
                    ? "text border-b-2 border-accent-content"
                    : "text-warning hover:text-warning-content"
                }`}
              >
                Request Status
              </button>
              <button
                onClick={() => setActiveTab("userbankrequest")}
                className={`py-2 px-4 font-semibold ${
                  activeTab === "userbankrequest"
                    ? "text border-b-2 border-accent-content"
                    : "text-warning hover:text-warning-content"
                }`}
              >
                User Bank requests
              </button>
            </>
          )}
        </div>

        {/* tabcontent */}

        <div className="mt-6">
          {activeTab === "info" && <UserInfo user={user} />}

          {!isAdmin && (
            <>
              {activeTab === "posts" && <UserPosts userId={user.user._id} />}
              {activeTab === "notifications" && (
                <UserNotifications userId={user.user._id} />
              )}
              {activeTab === "reqStatus" && (
                <PostStatus userId={user.user._id} />
              )}
              {activeTab === "userbankrequest" && <UserBankRequest />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
