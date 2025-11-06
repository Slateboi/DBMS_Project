import React from 'react';

function CourseTable({ courses }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Courses</h2>
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map(course => (
              <tr key={course.Course_ID}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.Course_ID}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.Course_Name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.Credits}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.Dept_ID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CourseTable;