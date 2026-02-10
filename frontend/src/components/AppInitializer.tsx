import React from 'react';
import { useMount } from 'ahooks';
import { useDispatch } from 'react-redux';
import * as AuthApi from '@/api/auth';
import { setUser, setLoading, logout } from '@/store/slices/authSlice';

// 这是一个无 UI 组件，仅用于初始化应用状态
const AppInitializer: React.FC = () => {
  const dispatch = useDispatch();

  useMount(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await AuthApi.me();
        dispatch(setUser(res.data.data));
      } catch (error) {
        console.error('Failed to fetch user:', error);
        dispatch(logout());
      }
    } else {
        dispatch(setLoading(false));
    }
  });

  return null;
};

export default AppInitializer;
