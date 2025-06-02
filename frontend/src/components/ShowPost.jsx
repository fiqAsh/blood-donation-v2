import React, { useEffect } from "react";
import { usePostStore } from "../stores/usePostStore";
import { useAuthStore } from "../stores/useAuthStore";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import Loading from "./Loading";
import DonorsPostsMap from "./Donors&PostsMap";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

const ShowPost = () => {
  const { posts, fetchPosts, loadingPosts } = usePostStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleMessage = async (receiver, text) => {
    try {
      await axiosInstance.post("/messages", {
        receiverId: receiver._id,
        text,
      });

      console.log("Navigating to messages with:", receiver);

      navigate("/messagepage", {
        state: {
          selectedUser: receiver,
        },
      });
    } catch (error) {
      console.error("Failed to send message:", error.response?.data);
      alert("Failed to send message. Try again.");
    }
  };

  if (loadingPosts) return <Loading />;

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600">
        No posts found. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post._id}
          className="card bg-primary shadow-md rounded-xl border hover:bg-rose-400 transition duration-300 overflow-hidden"
        >
          <div className="card-body space-y-2">
            <h2 className="card-title text-lg text-primary-content">
              Blood Group: {post.bloodGroup}
            </h2>
            <p className="text">
              <strong>Description:</strong> {post.description}
            </p>
            <p>
              <strong>Quantity:</strong> {post.quantity} bag
              {post.quantity > 1 && "s"}
            </p>
            <p>
              <strong>Urgency:</strong>{" "}
              <span
                className={`badge ${
                  post.urgency === "High"
                    ? "badge-error"
                    : post.urgency === "Medium"
                    ? "badge-warning"
                    : "badge-success"
                }`}
              >
                {post.urgency}
              </span>
            </p>

            {post.location && (
              <div className="h-40 mt-2 rounded overflow-hidden">
                <DonorsPostsMap
                  latitude={post.location.latitude}
                  longitude={post.location.longitude}
                />
              </div>
            )}

            {user?.user?._id !== post?.user?._id && (
              <button
                className="btn btn-accent border rounded-lg shadow-lg w-full"
                onClick={() => {
                  handleMessage(
                    post.user,
                    `Regarding your blood request: ${post.description}`
                  );
                }}
              >
                Message {post.user.name}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowPost;
