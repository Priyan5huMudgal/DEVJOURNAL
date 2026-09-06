import api from "./api";
const checkHealth = async () => {
  try {
    const res = await api.get("/health");
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { success: false, status: "disconnected", error: error.message };
  }
};
export {
  checkHealth
};
