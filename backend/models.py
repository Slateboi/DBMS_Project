from pydantic import BaseModel
from typing import Optional
from datetime import date

class LoginRequest(BaseModel):
    userId: str
    password: str
    userType: str

class StudentCreate(BaseModel):
    student_id: str
    first_name: str
    last_name: str
    dob: str
    email: str
    phone: Optional[str] = None
    dept_id: str
    password: str

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class DepartmentCreate(BaseModel):
    dept_id: str
    dept_name: str
    hod_name: str

class CourseCreate(BaseModel):
    course_id: str
    course_name: str
    credits: int
    dept_id: str

class EnrollmentCreate(BaseModel):
    student_id: str
    course_id: str
    semester_no: int
    enrollment_date: str
    academic_year: str

class GradeCreate(BaseModel):
    student_id: str
    course_id: str
    semester_no: int
    marks: float
    grade_letter: str

class AddressCreate(BaseModel):
    student_id: str
    street: str
    city: str
    state: str
    zip_code: str