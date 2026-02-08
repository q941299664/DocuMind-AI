import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AuthLayout from '../components/layout/AuthLayout';
import { ErrorCode } from '../lib/error';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await api.post('/auth/login', { username, password });
      if (res.data.code === ErrorCode.SUCCESS) {
        login(res.data.data.access_token, res.data.data.user);
        navigate('/');
      } else {
        setError(res.data.message || '登录失败');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const serverError = err.response?.data;
      if (serverError) {
        switch (serverError.code) {
          case ErrorCode.USER_NOT_FOUND:
            setError('用户不存在，请先注册');
            break;
          case ErrorCode.PASSWORD_ERROR:
            setError('密码错误，请重试');
            break;
          case ErrorCode.MISSING_PARAMETERS:
            setError('请输入用户名和密码');
            break;
          default:
            setError(serverError.message || '登录失败，请稍后重试');
        }
      } else {
        setError('网络错误，请检查您的连接');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="登录 DocuMind AI"
      subtitle={
        <span>
          还没有账号？ <Link to="/register" className="text-blue-600 hover:underline">立即注册</Link>
        </span>
      }
    >
      {error && <div className="p-3 text-sm text-red-600 bg-red-100 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="用户名"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="请输入用户名"
        />
        <Input
          label="密码"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
        />
        <Button
          type="submit"
          className="w-full"
          isLoading={loading}
        >
          登录
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
