import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUserChats, accessChat } from "../services/chatService";
import "./Chats.css";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [identifier, setIdentifier] = useState("");
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("userInfo"));

  const fetchChats = async () => {
    try {
      const data = await getUserChats();
      setChats(data);
    } catch (error) {
      console.error("Failed to fetch chats", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const startChat = async () => {
    if (!identifier.trim())
      return alert("Enter email or name");

    try {
      const chat = await accessChat(identifier.trim());
      setIdentifier("");
      fetchChats();
      navigate(`/chats/${chat._id}`);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to start chat"
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="chats-container">
        <h2 className="chats-title">Chats 💬</h2>

        {/* START CHAT */}
        <div className="start-chat-card card">
          <input
            className="chat-input"
            placeholder="Enter email or name to start a chat"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <button
            className="start-chat-btn"
            onClick={startChat}
          >
            Start Chat
          </button>
        </div>

        {/* CHAT LIST */}
        <div className="chat-list">
          {chats.length === 0 && (
            <div className="empty-chats">
              <p>No chats yet.</p>
              <span>Start a meaningful conversation 🌿</span>
            </div>
          )}

          {chats.map((chat) => {
            const otherUser = chat.participants.find(
              (p) =>
                p._id.toString() !==
                currentUser?._id.toString()
            );

            return (
              <div
                key={chat._id}
                className="chat-item card"
                onClick={() =>
                  navigate(`/chats/${chat._id}`)
                }
              >
                <div className="chat-avatar">
                  {otherUser?.name?.charAt(0)}
                </div>

                <div className="chat-info">
                  <div className="chat-name">
                    {otherUser?.name}
                  </div>
                  <div className="chat-subtext">
                    Tap to open conversation
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default Chats;
