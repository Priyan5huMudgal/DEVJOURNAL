import axios from 'axios';

// Instantiate Axios with root relative base URL for easy deployment & development serving
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject Bearer authentication tokens on all request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Unified Auth services
export const authService = {
  async register(payload: { name: string; email: string; password?: string }) {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },
  async login(payload: { email: string; password?: string }) {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },
  async logout() {
    localStorage.removeItem('accessToken');
    const response = await api.post('/auth/logout');
    return response.data;
  },
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },
  async updateProfile(payload: { name: string; bio?: string; preferences?: { theme: string; notifications: boolean }; avatar?: string }) {
    const response = await api.put('/auth/profile', payload);
    return response.data;
  },
  async changePassword(payload: { currentPassword?: string; newPassword?: string }) {
    const response = await api.put('/auth/change-password', payload);
    return response.data;
  }
};

// Journal services
export const journalService = {
  async getEntries(filters?: { search?: string; tag?: string; mood?: string; sort?: string }) {
    const response = await api.get('/journal', { params: filters });
    return response.data;
  },
  async createEntry(payload: any) {
    const response = await api.post('/journal', payload);
    return response.data;
  },
  async updateEntry(id: string, payload: any) {
    const response = await api.put(`/journal/${id}`, payload);
    return response.data;
  },
  async deleteEntry(id: string) {
    const response = await api.delete(`/journal/${id}`);
    return response.data;
  }
};

// Goals services
export const goalService = {
  async getGoals(filters?: { type?: string; status?: string }) {
    const response = await api.get('/goals', { params: filters });
    return response.data;
  },
  async createGoal(payload: any) {
    const response = await api.post('/goals', payload);
    return response.data;
  },
  async updateGoal(id: string, payload: any) {
    const response = await api.put(`/goals/${id}`, payload);
    return response.data;
  },
  async deleteGoal(id: string) {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};

// Roadmaps services
export const roadmapService = {
  async getRoadmaps() {
    const response = await api.get('/roadmaps');
    return response.data;
  },
  async createRoadmap(payload: any) {
    const response = await api.post('/roadmaps', payload);
    return response.data;
  },
  async updateRoadmap(id: string, payload: any) {
    const response = await api.put(`/roadmaps/${id}`, payload);
    return response.data;
  },
  async updateTopicStatus(id: string, topicIndex: number, status: string) {
    const response = await api.patch(`/roadmaps/${id}/topic/${topicIndex}`, { status });
    return response.data;
  },
  async deleteRoadmap(id: string) {
    const response = await api.delete(`/roadmaps/${id}`);
    return response.data;
  }
};

// Resource services
export const resourceService = {
  async getResources(filters?: { category?: string; isFavorite?: boolean; search?: string }) {
    const response = await api.get('/resources', { params: filters });
    return response.data;
  },
  async createResource(payload: any) {
    const response = await api.post('/resources', payload);
    return response.data;
  },
  async updateResource(id: string, payload: any) {
    const response = await api.put(`/resources/${id}`, payload);
    return response.data;
  },
  async deleteResource(id: string) {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  }
};

// Code Snippet services
export const snippetService = {
  async getSnippets(filters?: { language?: string; isFavorite?: boolean; search?: string; tag?: string }) {
    const response = await api.get('/snippets', { params: filters });
    return response.data;
  },
  async createSnippet(payload: any) {
    const response = await api.post('/snippets', payload);
    return response.data;
  },
  async updateSnippet(id: string, payload: any) {
    const response = await api.put(`/snippets/${id}`, payload);
    return response.data;
  },
  async deleteSnippet(id: string) {
    const response = await api.delete(`/snippets/${id}`);
    return response.data;
  }
};

// Analytics service
export const analyticsService = {
  async getDashboardStats() {
    const response = await api.get('/analytics/stats');
    return response.data;
  }
};

export default api;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
