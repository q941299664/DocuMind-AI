import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/api/auth/types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      localStorage.removeItem('token');
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false;
    }
  },
});

export const { setLoading, loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
