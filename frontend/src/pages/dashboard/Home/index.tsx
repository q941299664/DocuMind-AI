import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import request from '@/api/core/request';
import { Button, Card, Typography, Space, Divider, message } from 'antd';
import { LogoutOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [testResult, setTestResult] = useState<string>('');
  const [testing, setTesting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTestAI = async () => {
    setTesting(true);
    setTestResult('');
    try {
      const res = await request.post('/ai/test', { message: 'Hello from React Frontend!' });
      setTestResult(JSON.stringify(res.data, null, 2));
      messageApi.success('AI 测试成功');
    } catch (err: unknown) {
      console.error(err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      setTestResult(`测试失败: ${error.response?.data?.message || error.message}`);
      messageApi.error('AI 测试失败');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {contextHolder}
      <Card className="w-full max-w-2xl shadow-lg">
        <div className="text-center mb-8">
          <Title level={2}>DocuMind AI 系统</Title>
          <Text type="secondary">智能文档处理平台</Text>
        </div>
        
        {user ? (
          <div className="text-center">
            <Paragraph className="text-lg mb-6">
              你好，<Text strong type="success">{user.username}</Text>！
            </Paragraph>
            
            <Space size="large" className="mb-6">
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                onClick={handleTestAI}
                loading={testing}
                size="large"
              >
                测试 AI 连通性
              </Button>
              <Button
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                size="large"
              >
                退出登录
              </Button>
            </Space>

            {testResult && (
              <div className="mt-6 text-left">
                <Divider>测试结果</Divider>
                <div className="p-4 bg-gray-900 text-green-400 rounded-md font-mono text-sm whitespace-pre-wrap">
                  {testResult}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Space size="large" className="w-full justify-center">
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/login')}
              className="w-32"
            >
              登录
            </Button>
            <Button 
              size="large" 
              onClick={() => navigate('/register')}
              className="w-32 border border-gray-300 !text-gray-700"
            >
              注册
            </Button>
          </Space>
        )}
      </Card>
    </div>
  );
};

export default Home;
