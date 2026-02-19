import api from "./api";

// Get all chats of logged-in user
export const getUserChats = async () => {
  const { data } = await api.get("/chats");
  return data;
};

// Create or access private chat
export const accessChat = async (identifier) => {
  const { data } = await api.post("/chats", { identifier });
  return data;
};



// Get messages of a chat
export const getChatMessages = async (chatId) => {
  const { data } = await api.get(`/chats/${chatId}`);
  return data;
};

// Send message (REST – saves to DB)
export const sendMessageAPI = async (chatId, messageData) => {
  const { data } = await api.post(
    `/chats/${chatId}/message`,
    messageData
  );
  return data;
};
