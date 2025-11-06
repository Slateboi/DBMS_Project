import React, { useState } from 'react';
import { authAPI } from '../services/api';

function Login({ setCurrentUser, setError, setSuccess }) {
  const [loginForm, setLoginForm] = useState({
    userId: '',
    password: '',
    userType: 'student'
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await authAPI.login(loginForm);
      setCurrentUser({ ...response.data, userType: loginForm.userType });
      setSuccess('Login successful!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
              <select
                value={loginForm.userType}
                onChange={(e) => setLoginForm({ ...loginForm, userType: e.target.value })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {loginForm.userType === 'admin' ? 'Admin ID' : 'Student ID'}
              </label>
              <input
                type="text"
                required
                value={loginForm.userId}
                onChange={(e) => setLoginForm({ ...loginForm, userId: e.target.value })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={loginForm.userType === 'admin' ? 'Enter admin ID' : 'Enter student ID'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Default Admin: admin001 / admin123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;