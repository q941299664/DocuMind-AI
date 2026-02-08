import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：自动添加 JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理全局错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 如果是 401 错误，且不是登录接口本身的错误，则清除 Token 并跳转
    // 登录接口的 401 意味着用户名/密码错误，不应该触发全局登出逻辑
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      // Token 失效，清除 Token 并跳转登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
