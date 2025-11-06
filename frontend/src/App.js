import React, { useState } from 'react';
import { GraduationCap, LogOut } from 'lucide-react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    setCurrentUser(null);
    setError('');
    setSuccess('');
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">College DBMS</span>
            </div>
            {currentUser && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {currentUser.first_name || currentUser.userId}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={clearMessages} className="text-red-700 hover:text-red-900">×</button>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-green-700">{success}</p>
              <button onClick={clearMessages} className="text-green-700 hover:text-green-900">×</button>
            </div>
          </div>
        )}

        {!currentUser ? (
          <Login setCurrentUser={setCurrentUser} setError={setError} setSuccess={setSuccess} />
        ) : currentUser.userType === 'admin' ? (
          <AdminDashboard setError={setError} setSuccess={setSuccess} />
        ) : (
          <StudentDashboard currentUser={currentUser} setError={setError} setSuccess={setSuccess} />
        )}
      </main>
    </div>
  );
}

export default App;