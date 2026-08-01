import api from './api';

export const checkHealth = async () => {
  try {
    const res = await api.get('/health');
    return res.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    return { success: false, status: 'disconnected', error: error.message };
  }
};
