import request from '@/api/core/request';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from './types.ts';

export const login = (data: LoginRequest) => 
  request.post<LoginResponse>('/auth/login', data, { skipErrorHandler: true });

export const register = (data: RegisterRequest) => 
  request.post<string>('/auth/register', data);

export const sendCode = (email: string) => 
  request.post<string>('/auth/send-code', null, { params: { email } });

export const me = () => 
  request.get<User>('/auth/me');
