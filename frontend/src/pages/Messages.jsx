import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuthStore } from "../stores/useAuthStore";
import Loading from "../components/Loading";

import { useLocation } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const Messages = () => {
  const { user, checkingAuth } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user) return;

    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_API_BASE_URL.replace("/api", "");

    socket.current = io(SOCKET_URL, {
      withCredentials: true,
    });

    socket.current.emit("register", user.user._id);

    socket.current.on("receiveMessage", (message) => {
      if (
        message.senderId === selectedUser?._id ||
        message.receiverId === selectedUser?._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user, selectedUser]);

  useEffect(() => {
    if (!user) return;

    axiosInstance
      .get("/messages/conversations")
      .then((res) => setUsers(res.data))
      .catch((err) =>
        console.error("Error fetching users:", err.response?.data)
      );
  }, [user]);

  useEffect(() => {
    if (location.state?.selectedUser) {
      setSelectedUser(location.state.selectedUser);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (!selectedUser) return;

    axiosInstance
      .get(`/messages/${selectedUser._id}`)
      .then((res) => setMessages(res.data))
      .catch((err) =>
        console.error("Error fetching messages:", err.response?.data)
      );
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const res = await axiosInstance.post("/messages", {
        receiverId: selectedUser._id,
        text,
      });

      setMessages((prev) => [...prev, res.data]);
      setText("");

      // Emit socket message
      socket.current.emit("sendMessage", {
        senderId: user.user._id,
        receiverId: selectedUser._id,
        text,
      });
    } catch (err) {
      console.error("Failed to send message:", err.response?.data);
    }
  };

  if (checkingAuth) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* User List */}
        <div className="w-1/4 bg-base-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Users</h2>
          <hr className="mb-1" />
          {users.map((u) => (
            <div
              key={u._id}
              className={`p-2 cursor-pointer rounded ${
                selectedUser?._id === u._id
                  ? "bg-black text-white"
                  : "hover:bg-base-100"
              }`}
              onClick={() => setSelectedUser(u)}
            >
              {u.name || u.email}
            </div>
          ))}
        </div>

        {/* Message Panel */}
        <div className="w-3/4 flex flex-col p-4">
          {selectedUser ? (
            <>
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {messages.map((msg, idx) => {
                  const senderId = msg.sender?._id || msg.sender;
                  const isOwnMessage = senderId === user.user._id;

                  return (
                    <div
                      key={msg._id || idx}
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
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <textarea
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message"
                  className="textarea  flex-1"
                />
                <button onClick={handleSend} className="btn btn-primary">
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text">Select a user to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
