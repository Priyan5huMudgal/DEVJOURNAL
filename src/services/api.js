import axios from "axios";
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  }
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const authService = {
  async register(payload) {
    const response = await api.post("/auth/register", payload);
    return response.data;
  },
  async login(payload) {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },
  async logout() {
    localStorage.removeItem("accessToken");
    const response = await api.post("/auth/logout");
    return response.data;
  },
  async getProfile() {
    const response = await api.get("/auth/me");
    return response.data;
  },
  async updateProfile(payload) {
    const response = await api.put("/auth/profile", payload);
    return response.data;
  },
  async changePassword(payload) {
    const response = await api.put("/auth/change-password", payload);
    return response.data;
  }
};
const journalService = {
  async getEntries(filters) {
    const response = await api.get("/journal", { params: filters });
    return response.data;
  },
  async createEntry(payload) {
    const response = await api.post("/journal", payload);
    return response.data;
  },
  async updateEntry(id, payload) {
    const response = await api.put(`/journal/${id}`, payload);
    return response.data;
  },
  async deleteEntry(id) {
    const response = await api.delete(`/journal/${id}`);
    return response.data;
  }
};
const goalService = {
  async getGoals(filters) {
    const response = await api.get("/goals", { params: filters });
    return response.data;
  },
  async createGoal(payload) {
    const response = await api.post("/goals", payload);
    return response.data;
  },
  async updateGoal(id, payload) {
    const response = await api.put(`/goals/${id}`, payload);
    return response.data;
  },
  async deleteGoal(id) {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};
const roadmapService = {
  async getRoadmaps() {
    const response = await api.get("/roadmaps");
    return response.data;
  },
  async createRoadmap(payload) {
    const response = await api.post("/roadmaps", payload);
    return response.data;
  },
  async updateRoadmap(id, payload) {
    const response = await api.put(`/roadmaps/${id}`, payload);
    return response.data;
  },
  async updateTopicStatus(id, topicIndex, status) {
    const response = await api.patch(`/roadmaps/${id}/topic/${topicIndex}`, { status });
    return response.data;
  },
  async deleteRoadmap(id) {
    const response = await api.delete(`/roadmaps/${id}`);
    return response.data;
  }
};
const resourceService = {
  async getResources(filters) {
    const response = await api.get("/resources", { params: filters });
    return response.data;
  },
  async createResource(payload) {
    const response = await api.post("/resources", payload);
    return response.data;
  },
  async updateResource(id, payload) {
    const response = await api.put(`/resources/${id}`, payload);
    return response.data;
  },
  async deleteResource(id) {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  }
};
const snippetService = {
  async getSnippets(filters) {
    const response = await api.get("/snippets", { params: filters });
    return response.data;
  },
  async createSnippet(payload) {
    const response = await api.post("/snippets", payload);
    return response.data;
  },
  async updateSnippet(id, payload) {
    const response = await api.put(`/snippets/${id}`, payload);
    return response.data;
  },
  async deleteSnippet(id) {
    const response = await api.delete(`/snippets/${id}`);
    return response.data;
  }
};
const analyticsService = {
  async getDashboardStats() {
    const response = await api.get("/analytics/stats");
    return response.data;
  }
};
var api_default = api;
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
export {
  analyticsService,
  authService,
  api_default as default,
  goalService,
  journalService,
  resourceService,
  roadmapService,
  snippetService
};
