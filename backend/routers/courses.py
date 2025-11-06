from fastapi import APIRouter, HTTPException
from models import CourseCreate
from database import get_db_connection, close_db_connection
from mysql.connector import Error

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("")
async def get_courses():
    """Get all courses"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM COURSE")
        return cursor.fetchall()
    finally:
        cursor.close()
        close_db_connection(conn)

@router.post("")
async def create_course(course: CourseCreate):
    """Create a new course"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO COURSE (Course_ID, Course_Name, Credits, Dept_ID)
            VALUES (%s, %s, %s, %s)
        """, (course.course_id, course.course_name, course.credits, course.dept_id))
        conn.commit()
        return {"message": "Course created successfully"}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        close_db_connection(conn)

@router.delete("/{course_id}")
async def delete_course(course_id: str):
    """Delete a course"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM COURSE WHERE Course_ID = %s", (course_id,))
        conn.commit()
        return {"message": "Course deleted successfully"}
    finally:
        cursor.close()
        close_db_connection(conn)