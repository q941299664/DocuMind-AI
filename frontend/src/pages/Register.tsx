import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AuthLayout from '../components/layout/AuthLayout';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    code: ''
  });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      setError('请输入邮箱地址');
      return;
    }
    
    setSendingCode(true);
    setError('');
    
    try {
      const res = await api.post('/auth/send-code', { email: formData.email });
      if (res.data.code === 200) {
        setMsg('验证码已发送，请查收邮件');
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(res.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '发送失败，请重试');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setRegistering(true);
    
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.code === 200) {
        alert('注册成功，请登录');
        navigate('/login');
      } else {
        setError(res.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '注册失败，请稍后重试');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <AuthLayout
      title="注册新账号"
      subtitle={
        <span>
          已有账号？ <Link to="/login" className="text-blue-600 hover:underline">直接登录</Link>
        </span>
      }
    >
      {error && <div className="p-3 text-sm text-red-600 bg-red-100 rounded">{error}</div>}
      {msg && <div className="p-3 text-sm text-green-600 bg-green-100 rounded">{msg}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="用户名"
          name="username"
          type="text"
          required
          value={formData.username}
          onChange={handleChange}
          placeholder="请输入用户名"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <div className="flex gap-2">
            <Input
              name="email"
              type="email"
              required
              className="flex-1"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入邮箱"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleSendCode}
              disabled={sendingCode || countdown > 0 || !formData.email}
              isLoading={sendingCode}
              className="w-32"
            >
              {countdown > 0 ? `${countdown}s` : '发送验证码'}
            </Button>
          </div>
        </div>
        <Input
          label="验证码"
          name="code"
          type="text"
          required
          maxLength={6}
          value={formData.code}
          onChange={handleChange}
          placeholder="请输入验证码"
        />
        <Input
          label="密码"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="请输入密码"
        />
        <Button
          type="submit"
          className="w-full"
          isLoading={registering}
        >
          注册
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;
