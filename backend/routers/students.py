from fastapi import APIRouter, HTTPException
from models import StudentCreate, StudentUpdate
from database import get_db_connection, close_db_connection
from routers.auth import hash_password
from mysql.connector import Error

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("")
async def get_students():
    """Get all students"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM STUDENT")
        return cursor.fetchall()
    finally:
        cursor.close()
        close_db_connection(conn)

@router.get("/{student_id}")
async def get_student(student_id: str):
    """Get a specific student by ID"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM STUDENT WHERE Student_ID = %s", (student_id,))
        student = cursor.fetchone()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student
    finally:
        cursor.close()
        close_db_connection(conn)

@router.post("")
async def create_student(student: StudentCreate):
    """Create a new student with college ID and login credentials"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Generate college ID
        college_id = f"CID{student.student_id}"
        
        # Insert into COLLEGE_ID table
        cursor.execute("""
            INSERT INTO COLLEGE_ID (College_ID_Number, Issue_Date, Expiry_Date, Status)
            VALUES (%s, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 YEAR), 'Active')
        """, (college_id,))
        
        # Insert into STUDENT table
        cursor.execute("""
            INSERT INTO STUDENT (Student_ID, First_Name, Last_Name, DOB, Email, Phone, Dept_ID, College_ID_Number)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (student.student_id, student.first_name, student.last_name, 
              student.dob, student.email, student.phone, student.dept_id, college_id))
        
        # Insert into USER_LOGIN table
        hashed_pw = hash_password(student.password)
        cursor.execute("""
            INSERT INTO USER_LOGIN (User_ID, User_Type, Password)
            VALUES (%s, 'student', %s)
        """, (student.student_id, hashed_pw))
        
        conn.commit()
        return {"message": "Student created successfully", "college_id": college_id}
    except Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        close_db_connection(conn)

@router.put("/{student_id}")
async def update_student(student_id: str, student: StudentUpdate):
    """Update student information"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        updates = []
        values = []
        
        if student.first_name:
            updates.append("First_Name = %s")
            values.append(student.first_name)
        if student.last_name:
            updates.append("Last_Name = %s")
            values.append(student.last_name)
        if student.email:
            updates.append("Email = %s")
            values.append(student.email)
        if student.phone:
            updates.append("Phone = %s")
            values.append(student.phone)
        
        if not updates:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        values.append(student_id)
        query = f"UPDATE STUDENT SET {', '.join(updates)} WHERE Student_ID = %s"
        cursor.execute(query, values)
        conn.commit()
        
        return {"message": "Student updated successfully"}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        close_db_connection(conn)

@router.delete("/{student_id}")
async def delete_student(student_id: str):
    """Delete student and all related records"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Get college ID
        cursor.execute("SELECT College_ID_Number FROM STUDENT WHERE Student_ID = %s", (student_id,))
        result = cursor.fetchone()
        if result:
            college_id = result[0]
            # Delete from all related tables (cascading deletes)
            cursor.execute("DELETE FROM USER_LOGIN WHERE User_ID = %s", (student_id,))
            cursor.execute("DELETE FROM GRADE WHERE Student_ID = %s", (student_id,))
            cursor.execute("DELETE FROM ENROLLMENT WHERE Student_ID = %s", (student_id,))
            cursor.execute("DELETE FROM PHOTO WHERE Student_ID = %s", (student_id,))
            cursor.execute("DELETE FROM ADDRESS WHERE College_ID_Number = %s", (college_id,))
            cursor.execute("DELETE FROM STUDENT WHERE Student_ID = %s", (student_id,))
            cursor.execute("DELETE FROM COLLEGE_ID WHERE College_ID_Number = %s", (college_id,))
        conn.commit()
        return {"message": "Student deleted successfully"}
    except Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        close_db_connection(conn)