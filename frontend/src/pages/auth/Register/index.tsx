import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import * as AuthApi from '@/api/auth';
import type { RegisterRequest } from '@/api/auth/types';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleSendCode = async () => {
    try {
      const email = form.getFieldValue('email');
      if (!email) {
        messageApi.warning('请先输入邮箱地址');
        return;
      }
      // 简单正则校验邮箱
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        messageApi.warning('请输入有效的邮箱地址');
        return;
      }
      
      setSendingCode(true);
      
      const res = await AuthApi.sendCode(email);
      if (res.data.code === 200) {
        messageApi.success('验证码已发送，请查收邮件');
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
        messageApi.error(res.data.message || '发送失败');
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      messageApi.error(error.response?.data?.message || '发送失败，请重试');
    } finally {
      setSendingCode(false);
    }
  };

  const onFinish = async (values: RegisterRequest) => {
    setLoading(true);
    
    try {
      const res = await AuthApi.register(values);
      if (res.data.code === 200) {
        messageApi.success('注册成功，即将跳转登录');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        messageApi.error(res.data.message || '注册失败');
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      messageApi.error(error.response?.data?.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
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
      {contextHolder}
      
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        size="large"
        scrollToFirstError
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="用户名" 
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '请输入有效的邮箱地址!' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="邮箱" 
          />
        </Form.Item>

        <Form.Item label="验证码" required>
          <div className="flex gap-2">
            <Form.Item
              name="code"
              noStyle
              rules={[{ required: true, message: '请输入验证码!' }]}
            >
              <Input 
                prefix={<SafetyCertificateOutlined />} 
                placeholder="6位验证码" 
                maxLength={6}
                className="flex-1"
              />
            </Form.Item>
            <Button
              onClick={handleSendCode}
              disabled={sendingCode || countdown > 0}
              loading={sendingCode}
              style={{ width: '120px' }}
            >
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </Button>
          </div>
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码!' },
            { min: 6, message: '密码至少6位!' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="密码" 
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            注册
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default Register;
