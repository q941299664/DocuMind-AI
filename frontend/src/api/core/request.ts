import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { ErrorCode } from '../../lib/constants';
import toast from 'react-hot-toast';

// 扩展 AxiosRequestConfig 类型，添加 skipErrorHandler 属性
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorHandler?: boolean;
  }
}

// 定义通用的响应结构
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message } = response.data || {};
    
    if (code && code !== ErrorCode.SUCCESS) {
        if (!response.config.skipErrorHandler) {
            toast.error(message || '操作失败');
        }
        
        return Promise.reject({
            config: response.config,
            request: response.request,
            response: response,
            message: message || 'Business Error'
        });
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const config = error.config;
    
    if (!config?.skipErrorHandler) {
        const errorMessage = data?.message || '网络请求失败，请稍后重试';
        toast.error(errorMessage);
    }

    if ((status === 401 || data?.code === ErrorCode.UNAUTHORIZED) && !config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 封装常用的请求方法
export const request = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) => 
    instance.get<ApiResponse<T>>(url, config),
    
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    instance.post<ApiResponse<T>>(url, data, config),
    
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    instance.put<ApiResponse<T>>(url, data, config),
    
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) => 
    instance.delete<ApiResponse<T>>(url, config),
};

export default request;
