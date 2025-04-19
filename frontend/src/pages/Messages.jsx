import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar"; // 👈 import the Navbar

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

const Messages = () => {
  const { user, checkingAuth } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!user) return;

    axiosInstance
      .get("/messages/users")
      .then((res) => setUsers(res.data))
      .catch((err) =>
        console.error("Error fetching users:", err.response?.data)
      );
  }, [user]);

  useEffect(() => {
    if (!selectedUser) return;

    axiosInstance
      .get(`/messages/${selectedUser._id}`)
      .then((res) => setMessages(res.data))
      .catch((err) =>
        console.error("Error fetching messages:", err.response?.data)
      );
  }, [selectedUser]);

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const res = await axiosInstance.post("/messages", {
        receiverId: selectedUser._id,
        text,
      });

      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Failed to send message:", err.response?.data);
    }
  };

  if (checkingAuth) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar at the top */}
      <Navbar />

      {/* Main chat layout below navbar */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 bg-base-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Users</h2>
          {users.map((u) => (
            <div
              key={u._id}
              className={`p-2 cursor-pointer rounded ${
                selectedUser?._id === u._id
                  ? "bg-primary text-white"
                  : "hover:bg-base-300"
              }`}
              onClick={() => setSelectedUser(u)}
            >
              {u.name || u.email}
            </div>
          ))}
        </div>

        <div className="w-3/4 flex flex-col p-4">
          {selectedUser ? (
            <>
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {messages.map((msg) => {
                  const senderId = msg.sender?._id || msg.sender;
                  const isOwnMessage = senderId === user.user._id;

                  return (
                    <div
                      key={msg._id}
                      className={`chat ${
                        isOwnMessage ? "chat-end" : "chat-start"
                      }`}
                    >
                      <div
                        className={`chat-bubble ${
                          isOwnMessage
                            ? "bg-primary text-white"
                            : "bg-base-300 text-black"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message"
                  className="input input-bordered flex-1"
                />
                <button onClick={handleSend} className="btn btn-primary">
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">
              Select a user to start chatting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
