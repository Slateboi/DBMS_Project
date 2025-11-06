import React from 'react';

function DepartmentTable({ departments }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Departments</h2>
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dept ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HOD Name</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map(dept => (
              <tr key={dept.Dept_ID}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.Dept_ID}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.Dept_Name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.HOD_Name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DepartmentTable;