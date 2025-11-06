import React, { useState } from 'react';

function StudentTable({ students, departments, onDelete, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    dob: '',
    email: '',
    phone: '',
    dept_id: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd(formData);
    setShowForm(false);
    setFormData({
      student_id: '',
      first_name: '',
      last_name: '',
      dob: '',
      email: '',
      phone: '',
      dept_id: '',
      password: ''
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Student Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Add New Student'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-medium mb-4">Add New Student</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Student ID"
              required
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="First Name"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              placeholder="Date of Birth"
              required
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              required
              value={formData.dept_id}
              onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.Dept_ID} value={dept.Dept_ID}>{dept.Dept_Name}</option>
              ))}
            </select>
            <input
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="col-span-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Student
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map(student => (
              <tr key={student.Student_ID}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.Student_ID}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.First_Name} {student.Last_Name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.Email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.Dept_ID}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onDelete(student.Student_ID)}
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
  );
}

export default StudentTable;