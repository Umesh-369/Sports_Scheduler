import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => {
    // Backend envelope is { success: true, data: ... }
    return response.data;
  },
  (error) => {
    const errorData = error.response?.data?.error || {
      message: error.message || 'Network request failed',
      code: 'NETWORK_ERROR'
    };
    return Promise.reject(errorData);
  }
);

export default api;
