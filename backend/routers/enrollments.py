from fastapi import APIRouter, HTTPException
from models import EnrollmentCreate
from database import get_db_connection, close_db_connection
from mysql.connector import Error

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])

@router.get("/{student_id}")
async def get_student_enrollments(student_id: str):
    """Get all enrollments for a specific student"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT e.*, c.Course_Name, c.Credits
            FROM ENROLLMENT e
            JOIN COURSE c ON e.Course_ID = c.Course_ID
            WHERE e.Student_ID = %s
        """, (student_id,))
        return cursor.fetchall()
    finally:
        cursor.close()
        close_db_connection(conn)

@router.post("")
async def create_enrollment(enrollment: EnrollmentCreate):
    """Create a new enrollment"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO ENROLLMENT (Student_ID, Course_ID, Semester_No, Enrollment_Date, Academic_Year)
            VALUES (%s, %s, %s, %s, %s)
        """, (enrollment.student_id, enrollment.course_id, enrollment.semester_no,
              enrollment.enrollment_date, enrollment.academic_year))
        conn.commit()
        return {"message": "Enrollment created successfully"}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        close_db_connection(conn)

@router.delete("/{student_id}/{course_id}")
async def delete_enrollment(student_id: str, course_id: str):
    """Delete an enrollment"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            DELETE FROM ENROLLMENT 
            WHERE Student_ID = %s AND Course_ID = %s
        """, (student_id, course_id))
        conn.commit()
        return {"message": "Enrollment deleted successfully"}
    finally:
        cursor.close()
        close_db_connection(conn)