from fastapi import APIRouter, HTTPException
from models import GradeCreate
from database import get_db_connection, close_db_connection
from mysql.connector import Error

router = APIRouter(prefix="/grades", tags=["Grades"])

@router.get("/{student_id}")
async def get_student_grades(student_id: str):
    """Get all grades for a specific student"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT g.*, c.Course_Name, c.Credits
            FROM GRADE g
            JOIN COURSE c ON g.Course_ID = c.Course_ID
            WHERE g.Student_ID = %s
        """, (student_id,))
        return cursor.fetchall()
    finally:
        cursor.close()
        close_db_connection(conn)

@router.post("")
async def create_grade(grade: GradeCreate):
    """Create a new grade record"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO GRADE (Student_ID, Course_ID, Semester_No, Marks, Grade_Letter)
            VALUES (%s, %s, %s, %s, %s)
        """, (grade.student_id, grade.course_id, grade.semester_no, 
              grade.marks, grade.grade_letter))
        conn.commit()
        return {"message": "Grade created successfully"}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        close_db_connection(conn)

@router.put("/{student_id}/{course_id}/{semester_no}")
async def update_grade(student_id: str, course_id: str, semester_no: int, grade: GradeCreate):
    """Update a grade record"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE GRADE 
            SET Marks = %s, Grade_Letter = %s
            WHERE Student_ID = %s AND Course_ID = %s AND Semester_No = %s
        """, (grade.marks, grade.grade_letter, student_id, course_id, semester_no))
        conn.commit()
        return {"message": "Grade updated successfully"}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        close_db_connection(conn)