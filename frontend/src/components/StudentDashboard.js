import React, { useState, useEffect } from 'react';
import { User, BookOpen, GraduationCap } from 'lucide-react';
import { studentAPI, enrollmentAPI, gradeAPI } from '../services/api';

function StudentDashboard({ currentUser, setError, setSuccess }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [studentData, setStudentData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (currentUser?.userId) {
      fetchStudentData();
      fetchEnrollments();
      fetchGrades();
    }
  }, [currentUser]);

  const fetchStudentData = async () => {
    try {
      const response = await studentAPI.getOne(currentUser.userId);
      setStudentData(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to fetch student data');
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await enrollmentAPI.getByStudent(currentUser.userId);
      setEnrollments(response.data);
    } catch (err) {
      setError('Failed to fetch enrollments');
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await gradeAPI.getByStudent(currentUser.userId);
      setGrades(response.data);
    } catch (err) {
      setError('Failed to fetch grades');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.update(currentUser.userId, {
        first_name: formData.First_Name,
        last_name: formData.Last_Name,
        email: formData.Email,
        phone: formData.Phone
      });
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      fetchStudentData();
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <User className="h-5 w-5 mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`${
              activeTab === 'enrollments'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Enrollments
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`${
              activeTab === 'grades'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <GraduationCap className="h-5 w-5 mr-2" />
            Grades
          </button>
        </nav>
      </div>

      {activeTab === 'profile' && studentData && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">My Profile</h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.First_Name || ''}
                  onChange={(e) => setFormData({ ...formData, First_Name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.Last_Name || ''}
                  onChange={(e) => setFormData({ ...formData, Last_Name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.Email || ''}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.Phone || ''}
                  onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="col-span-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Student ID</p>
                <p className="mt-1 text-lg text-gray-900">{studentData.Student_ID}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="mt-1 text-lg text-gray-900">{studentData.First_Name} {studentData.Last_Name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-lg text-gray-900">{studentData.Email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="mt-1 text-lg text-gray-900">{studentData.Phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p className="mt-1 text-lg text-gray-900">{studentData.DOB}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="mt-1 text-lg text-gray-900">{studentData.Dept_ID}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'enrollments' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Enrollments</h2>
          {enrollments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No enrollments found</p>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map((enrollment, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enrollment.Course_ID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enrollment.Course_Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.Credits}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.Semester_No}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.Academic_Year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'grades' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Grades</h2>
          {grades.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No grades found</p>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grades.map((grade, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.Course_ID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.Course_Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.Semester_No}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.Marks}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`px-2 py-1 rounded ${
                          grade.Grade_Letter === 'A' || grade.Grade_Letter === 'A+' 
                            ? 'bg-green-100 text-green-800' 
                            : grade.Grade_Letter === 'B' || grade.Grade_Letter === 'B+' 
                            ? 'bg-blue-100 text-blue-800' 
                            : grade.Grade_Letter === 'C' || grade.Grade_Letter === 'C+' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {grade.Grade_Letter}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;