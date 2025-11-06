import React, { useState, useEffect } from 'react';
import { Users, Building2, BookOpen } from 'lucide-react';
import { departmentAPI, courseAPI, studentAPI } from '../services/api';
import StudentTable from './StudentTable';
import DepartmentTable from './DepartmentTable';
import CourseTable from './CourseTable';

function AdminDashboard({ setError, setSuccess }) {
  const [activeTab, setActiveTab] = useState('students');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [deptRes, courseRes, studentRes] = await Promise.all([
        departmentAPI.getAll(),
        courseAPI.getAll(),
        studentAPI.getAll()
      ]);
      setDepartments(deptRes.data);
      setCourses(courseRes.data);
      setStudents(studentRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(studentId);
        setSuccess('Student deleted successfully!');
        fetchAllData();
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  const handleAddStudent = async (studentData) => {
    try {
      await studentAPI.create(studentData);
      setSuccess('Student added successfully!');
      fetchAllData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add student');
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('students')}
            className={`${
              activeTab === 'students'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Users className="h-5 w-5 mr-2" />
            Students
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`${
              activeTab === 'departments'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Building2 className="h-5 w-5 mr-2" />
            Departments
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`${
              activeTab === 'courses'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Courses
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        <>
          {activeTab === 'students' && (
            <StudentTable 
              students={students} 
              departments={departments}
              onDelete={handleDeleteStudent}
              onAdd={handleAddStudent}
            />
          )}
          {activeTab === 'departments' && <DepartmentTable departments={departments} />}
          {activeTab === 'courses' && <CourseTable courses={courses} />}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;