-- Create database
CREATE DATABASE IF NOT EXISTS college_db;
USE college_db;

-- DEPARTMENT table
CREATE TABLE DEPARTMENT (
    Dept_ID VARCHAR(10) PRIMARY KEY,
    Dept_Name VARCHAR(100) NOT NULL,
    HOD_Name VARCHAR(100)
);

-- COURSE table
CREATE TABLE COURSE (
    Course_ID VARCHAR(10) PRIMARY KEY,
    Course_Name VARCHAR(100) NOT NULL,
    Credits INT NOT NULL,
    Dept_ID VARCHAR(10),
    FOREIGN KEY (Dept_ID) REFERENCES DEPARTMENT(Dept_ID) ON DELETE SET NULL
);

-- COLLEGE_ID table
CREATE TABLE COLLEGE_ID (
    College_ID_Number VARCHAR(20) PRIMARY KEY,
    Issue_Date DATE NOT NULL,
    Expiry_Date DATE NOT NULL,
    Status VARCHAR(20) DEFAULT 'Active'
);

-- STUDENT table
CREATE TABLE STUDENT (
    Student_ID VARCHAR(20) PRIMARY KEY,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    DOB DATE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(15),
    Dept_ID VARCHAR(10),
    College_ID_Number VARCHAR(20),
    FOREIGN KEY (Dept_ID) REFERENCES DEPARTMENT(Dept_ID) ON DELETE SET NULL,
    FOREIGN KEY (College_ID_Number) REFERENCES COLLEGE_ID(College_ID_Number) ON DELETE CASCADE
);

-- ADDRESS table
CREATE TABLE ADDRESS (
    Address_ID INT AUTO_INCREMENT PRIMARY KEY,
    Street VARCHAR(100),
    City VARCHAR(50),
    State VARCHAR(50),
    ZIP VARCHAR(10),
    College_ID_Number VARCHAR(20),
    FOREIGN KEY (College_ID_Number) REFERENCES COLLEGE_ID(College_ID_Number) ON DELETE CASCADE
);

-- ENROLLMENT table
CREATE TABLE ENROLLMENT (
    Student_ID VARCHAR(20),
    Course_ID VARCHAR(10),
    Semester_No INT NOT NULL,
    Enrollment_Date DATE NOT NULL,
    Academic_Year VARCHAR(10) NOT NULL,
    PRIMARY KEY (Student_ID, Course_ID, Semester_No),
    FOREIGN KEY (Student_ID) REFERENCES STUDENT(Student_ID) ON DELETE CASCADE,
    FOREIGN KEY (Course_ID) REFERENCES COURSE(Course_ID) ON DELETE CASCADE
);

-- GRADE table
CREATE TABLE GRADE (
    Student_ID VARCHAR(20),
    Course_ID VARCHAR(10),
    Semester_No INT,
    Marks DECIMAL(5,2),
    Grade_Letter VARCHAR(2),
    PRIMARY KEY (Student_ID, Course_ID, Semester_No),
    FOREIGN KEY (Student_ID) REFERENCES STUDENT(Student_ID) ON DELETE CASCADE,
    FOREIGN KEY (Course_ID) REFERENCES COURSE(Course_ID) ON DELETE CASCADE
);

-- PHOTO table
CREATE TABLE PHOTO (
    Student_ID VARCHAR(20) PRIMARY KEY,
    Photo LONGBLOB,
    FOREIGN KEY (Student_ID) REFERENCES STUDENT(Student_ID) ON DELETE CASCADE
);

-- ADMIN table
CREATE TABLE ADMIN (
    Admin_ID VARCHAR(20) PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL
);

-- USER_LOGIN table
CREATE TABLE USER_LOGIN (
    User_ID VARCHAR(20),
    User_Type VARCHAR(10),
    Password VARCHAR(255) NOT NULL,
    PRIMARY KEY (User_ID, User_Type)
);

-- Insert sample departments
INSERT INTO DEPARTMENT (Dept_ID, Dept_Name, HOD_Name) VALUES
('CS', 'Computer Science', 'Dr. John Smith'),
('EE', 'Electrical Engineering', 'Dr. Sarah Johnson'),
('ME', 'Mechanical Engineering', 'Dr. Michael Brown'),
('CE', 'Civil Engineering', 'Dr. Emily Davis');

-- Insert sample courses
INSERT INTO COURSE (Course_ID, Course_Name, Credits, Dept_ID) VALUES
('CS101', 'Introduction to Programming', 4, 'CS'),
('CS201', 'Data Structures', 4, 'CS'),
('CS301', 'Database Management Systems', 4, 'CS'),
('CS401', 'Operating Systems', 4, 'CS'),
('EE101', 'Circuit Analysis', 4, 'EE'),
('EE201', 'Digital Electronics', 4, 'EE'),
('ME101', 'Engineering Mechanics', 4, 'ME'),
('ME201', 'Thermodynamics', 4, 'ME'),
('CE101', 'Engineering Drawing', 3, 'CE'),
('CE201', 'Structural Analysis', 4, 'CE');

-- Note: The default admin (admin001 / admin123) will be created automatically 
-- when the FastAPI application starts for the first time