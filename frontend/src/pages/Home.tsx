import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        欢迎光临 DocuMind AI 系统
      </h1>
      
      {user ? (
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">
            你好，<span className="font-semibold text-blue-600">{user.username}</span>！
          </p>
          <button
            onClick={handleLogout}
            className="px-6 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
          >
            退出登录
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            登录
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-2 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            注册
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
