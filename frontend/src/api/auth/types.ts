export interface User {
  id: number;
  username: string;
  email: string;
  actived: boolean;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface RegisterRequest {
  username: string;
  password?: string;
  email: string;
  code: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
