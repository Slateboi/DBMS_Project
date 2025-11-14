import React, { useState, useEffect } from 'react';
import { gradeAPI, enrollmentAPI } from '../services/api';

function GradeManagement({ students, courses, setError, setSuccess }) {
  const [grades, setGrades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    semester_no: '',
    marks: '',
    grade_letter: ''
  });

  useEffect(() => {
    fetchGrades();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchStudentEnrollments(selectedStudent);
    }
  }, [selectedStudent]);

  const fetchGrades = async () => {
    try {
      const response = await gradeAPI.getAll();
      setGrades(response.data);
    } catch (err) {
      setError('Failed to fetch grades');
    }
  };

  const fetchStudentEnrollments = async (studentId) => {
    try {
      const response = await enrollmentAPI.getByStudent(studentId);
      setStudentEnrollments(response.data);
    } catch (err) {
      setError('Failed to fetch enrollments');
    }
  };

  const calculateGradeLetter = (marks) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C+';
    if (marks >= 40) return 'C';
    return 'F';
  };

  const handleMarksChange = (marks) => {
    const grade = calculateGradeLetter(parseFloat(marks));
    setFormData({ ...formData, marks, grade_letter: grade });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await gradeAPI.update(
          formData.student_id,
          formData.course_id,
          formData.semester_no,
          {
            marks: parseFloat(formData.marks),
            grade_letter: formData.grade_letter
          }
        );
        setSuccess('Grade updated successfully!');
      } else {
        await gradeAPI.create({
          ...formData,
          marks: parseFloat(formData.marks)
        });
        setSuccess('Grade added successfully!');
      }
      setShowForm(false);
      setEditMode(false);
      setFormData({
        student_id: '',
        course_id: '',
        semester_no: '',
        marks: '',
        grade_letter: ''
      });
      fetchGrades();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save grade');
    }
  };

  const handleEdit = (grade) => {
    setFormData({
      student_id: grade.Student_ID,
      course_id: grade.Course_ID,
      semester_no: grade.Semester_No,
      marks: grade.Marks,
      grade_letter: grade.Grade_Letter
    });
    setSelectedStudent(grade.Student_ID);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (studentId, courseId, semesterNo) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await gradeAPI.delete(studentId, courseId, semesterNo);
        setSuccess('Grade deleted successfully!');
        fetchGrades();
      } catch (err) {
        setError('Failed to delete grade');
      }
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Grade Management</h2>
          <p className="text-sm text-gray-600 mt-1">Enter and manage student grades</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setEditMode(false);
              setFormData({
                student_id: '',
                course_id: '',
                semester_no: '',
                marks: '',
                grade_letter: ''
              });
            }
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add Grade'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-medium mb-4">{editMode ? 'Edit Grade' : 'Add New Grade'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
              <select
                required
                disabled={editMode}
                value={formData.student_id}
                onChange={(e) => {
                  setFormData({ ...formData, student_id: e.target.value, course_id: '', semester_no: '' });
                  setSelectedStudent(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.Student_ID} value={student.Student_ID}>
                    {student.Student_ID} - {student.First_Name} {student.Last_Name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
              <select
                required
                disabled={editMode || !formData.student_id}
                value={formData.course_id}
                onChange={(e) => {
                  const enrollment = studentEnrollments.find(enr => enr.Course_ID === e.target.value);
                  setFormData({ 
                    ...formData, 
                    course_id: e.target.value,
                    semester_no: enrollment ? enrollment.Semester_No : ''
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Course</option>
                {studentEnrollments.map(enrollment => (
                  <option key={enrollment.Course_ID} value={enrollment.Course_ID}>
                    {enrollment.Course_ID} - {enrollment.Course_Name}
                  </option>
                ))}
              </select>
              {formData.student_id && studentEnrollments.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Student has no enrollments</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
              <input
                type="number"
                required
                disabled={editMode}
                value={formData.semester_no}
                onChange={(e) => setFormData({ ...formData, semester_no: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Semester Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marks (0-100) *</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.01"
                value={formData.marks}
                onChange={(e) => handleMarksChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter marks"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Letter</label>
              <input
                type="text"
                value={formData.grade_letter}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                placeholder="Auto-calculated"
              />
              <p className="text-xs text-gray-500 mt-1">Grade is automatically calculated based on marks</p>
            </div>
            <button
              type="submit"
              className="col-span-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {editMode ? 'Update Grade' : 'Add Grade'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades.map((grade, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.Student_ID}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.First_Name} {grade.Last_Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {grade.Course_ID} - {grade.Course_Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.Semester_No}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.Marks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      grade.Grade_Letter === 'A+' || grade.Grade_Letter === 'A' 
                        ? 'bg-green-100 text-green-800' 
                        : grade.Grade_Letter === 'B+' || grade.Grade_Letter === 'B' 
                        ? 'bg-blue-100 text-blue-800' 
                        : grade.Grade_Letter === 'C+' || grade.Grade_Letter === 'C' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {grade.Grade_Letter}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(grade)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(grade.Student_ID, grade.Course_ID, grade.Semester_No)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GradeManagement;
