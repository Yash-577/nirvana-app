import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import {
  getChatMessages,
  sendMessageAPI,
} from "../services/chatService";
import { useAuth } from "../context/AuthContext";
import "./ChatRoom.css";

const socket = io(import.meta.env.VITE_API_URL);


const ChatRoom = () => {
  const { chatId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      const data = await getChatMessages(chatId);
      setMessages(data.messages);
    };

    loadMessages();

    socket.emit("joinChat", chatId);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const messageData = { text };

    const savedMessage = await sendMessageAPI(
      chatId,
      messageData
    );

    socket.emit("sendMessage", {
      chatId,
      message: savedMessage,
    });

    setMessages((prev) => [...prev, savedMessage]);
    setText("");
  };

  return (
    <div className="chatroom-container">

      {/* Header */}
      <div className="chatroom-header">
        Private Chat 🔒
      </div>

      {/* Messages */}
      <div className="chatroom-messages">
        {messages.map((msg, index) => {
          const senderId = msg.sender?._id
            ? msg.sender._id.toString()
            : msg.sender?.toString();

          const isMyMessage =
            senderId === user?._id?.toString();

          return (
            <div
              key={index}
              className={`message-row ${
                isMyMessage ? "me" : "other"
              }`}
            >
              <div
                className={`message-bubble ${
                  isMyMessage ? "me-bubble" : "other-bubble"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chatroom-input-area">
        <input
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Type a message..."
          className="chatroom-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          className="chatroom-send-btn"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
