import api from "./api";

// Upload media to Cloudinary (via backend)
export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data; // { url, public_id }
};

// Create a post
export const createPost = async (postData) => {
  const { data } = await api.post("/posts", postData);
  return data;
};

// Get top rated posts
export const getTopRatedPosts = async () => {
  const { data } = await api.get("/posts/top");
  return data;
};

// Search + pagination
export const searchPosts = async (params) => {
  const { data } = await api.get("/posts/search", { params });
  return data;
};

export const deletePost = async (id) => {
  const { data } = await api.delete(`/posts/${id}`);
  return data;
};

export const updatePost = async (id, postData) => {
  const { data } = await api.put(`/posts/${id}`, postData);
  return data;
};

export const ratePost = async (id, value) => {
  const { data } = await api.post(`/posts/${id}/rate`, { value });
  return data;
};


