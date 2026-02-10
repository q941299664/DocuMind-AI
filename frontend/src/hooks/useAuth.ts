import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { loginSuccess, logout as logoutAction } from '@/store/slices/authSlice';
import type { User } from '@/api/auth/types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, token } = useSelector((state: RootState) => state.auth);

  const login = (token: string, user: User) => {
    dispatch(loginSuccess({ token, user }));
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
