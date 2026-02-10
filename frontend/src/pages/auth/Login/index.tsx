import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthLayout from '@/layouts/AuthLayout';
import { ErrorCode } from '@/lib/constants';
import { Form, Input, Button, Modal, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import * as AuthApi from '@/api/auth';
import type { LoginRequest } from '@/api/auth/types';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    
    try {
      const res = await AuthApi.login(values);
      const result = res.data;
      
      if (result.code === ErrorCode.SUCCESS) { // 200
        login(result.data.token, result.data.user);
        messageApi.success('登录成功');
        navigate('/');
      } else if (result.code === ErrorCode.USER_NOT_FOUND) { // 20001
        // 账号不存在，弹窗提示
        Modal.confirm({
          title: '账号不存在',
          content: result.message || '账号不存在，是否前往注册？',
          okText: '前往注册',
          cancelText: '取消',
          onOk: () => {
            navigate('/register');
          }
        });
      } else {
        messageApi.error(result.message || '登录失败');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      // 处理 HTTP 错误或其他异常
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      const result = error.response?.data;
      if (result) {
         if (result.code === ErrorCode.USER_NOT_FOUND) {
            Modal.confirm({
                title: '账号不存在',
                content: result.message || '账号不存在，是否前往注册？',
                okText: '前往注册',
                cancelText: '取消',
                onOk: () => {
                  navigate('/register');
                }
              });
         } else {
            messageApi.error(result.message || '登录失败，请稍后重试');
         }
      } else {
         messageApi.error('网络错误，请检查您的连接');
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
      {contextHolder}
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名或邮箱!' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="用户名或邮箱" 
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="密码" 
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default Login;
