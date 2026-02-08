import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <div className="mt-2 text-sm text-gray-600">
              {subtitle}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
