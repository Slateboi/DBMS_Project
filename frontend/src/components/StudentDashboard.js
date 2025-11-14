import React, { useState, useEffect } from 'react';
import { User, BookOpen, GraduationCap, MapPin, Camera } from 'lucide-react';
import { studentAPI, enrollmentAPI, gradeAPI } from '../services/api';

function StudentDashboard({ currentUser, setError, setSuccess }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [studentData, setStudentData] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [grades, setGrades] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [addressMode, setAddressMode] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [formData, setFormData] = useState({});
    const [addressData, setAddressData] = useState({
        street: '',
        city: '',
        state: '',
        zip_code: ''
    });

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
            if (response.data.address) {
                setAddressData({
                    street: response.data.address.Street || '',
                    city: response.data.address.City || '',
                    state: response.data.address.State || '',
                    zip_code: response.data.address.ZIP || ''
                });
            }
            if (response.data.photo) {
                setPhotoPreview(`data:image/jpeg;base64,${response.data.photo}`);
            }
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

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);

            try {
                const form = new FormData();
                form.append('file', file);
                await studentAPI.uploadPhoto(currentUser.userId, form);
                setSuccess('Photo uploaded successfully!');
                fetchStudentData();
            } catch (err) {
                setError('Failed to upload photo');
            }
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            if (studentData?.address) {
                await studentAPI.updateAddress(currentUser.userId, addressData);
                setSuccess('Address updated successfully!');
            } else {
                await studentAPI.createAddress(currentUser.userId, addressData);
                setSuccess('Address added successfully!');
            }
            setAddressMode(false);
            fetchStudentData();
        } catch (err) {
            setError('Failed to save address');
        }
    };

    const calculateGPA = () => {
        if (grades.length === 0) return '0.00';
        const gradePoints = {
            'A+': 4.0, 'A': 4.0, 'B+': 3.5, 'B': 3.0,
            'C+': 2.5, 'C': 2.0, 'F': 0.0
        };
        const totalPoints = grades.reduce((sum, grade) => {
            return sum + (gradePoints[grade.Grade_Letter] || 0) * (grade.Credits || 0);
        }, 0);
        const totalCredits = grades.reduce((sum, grade) => sum + (grade.Credits || 0), 0);
        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
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
                <div className="space-y-6">
                    {/* Photo Section */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Camera className="h-5 w-5 mr-2" />
                            Profile Photo
                        </h3>
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Profile"
                                        className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100"
                                    />
                                ) : (
                                    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-indigo-100">
                                        <Camera className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                    <Camera className="h-4 w-4 mr-2" />
                                    Upload Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF (Max 5MB)</p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info Section */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
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
                                    <p className="text-sm font-medium text-gray-500">College ID</p>
                                    <p className="mt-1 text-lg text-gray-900">{studentData.College_ID_Number}</p>
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
                                <div>
                                    <p className="text-sm font-medium text-gray-500">ID Status</p>
                                    <p className="mt-1">
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            studentData.College_ID_Status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {studentData.College_ID_Status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Address Section */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <MapPin className="h-5 w-5 mr-2" />
                                Address
                            </h3>
                            <button
                                onClick={() => setAddressMode(!addressMode)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                {addressMode ? 'Cancel' : studentData?.address ? 'Edit Address' : 'Add Address'}
                            </button>
                        </div>

                        {addressMode ? (
                            <form onSubmit={handleAddressSubmit} className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                                    <input
                                        type="text"
                                        value={addressData.street}
                                        onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Street address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={addressData.city}
                                        onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        value={addressData.state}
                                        onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                    <input
                                        type="text"
                                        value={addressData.zip_code}
                                        onChange={(e) => setAddressData({ ...addressData, zip_code: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="col-span-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Save Address
                                </button>
                            </form>
                        ) : studentData?.address ? (
                            <div className="text-gray-700">
                                <p>{studentData.address.Street}</p>
                                <p>{studentData.address.City}, {studentData.address.State} {studentData.address.ZIP}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No address added yet</p>
                        )}
                    </div>
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
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-900">My Grades</h2>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Current GPA</p>
                            <p className="text-3xl font-bold text-indigo-600">{calculateGPA()}</p>
                        </div>
                    </div>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.Credits}</td>
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