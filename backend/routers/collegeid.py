from fastapi import APIRouter, HTTPException
from models import CollegeIDCreate
from database import get_db_connection, close_db_connection
from mysql.connector import Error

router = APIRouter(prefix="/college-ids", tags=["College IDs"])

@router.get("")
async def get_college_ids():
    """Get all college IDs"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM COLLEGE_ID")
        return cursor.fetchall()
    finally:
        cursor.close()
        close_db_connection(conn)

@router.get("/{college_id_number}")
async def get_college_id(college_id_number: str):
    """Get specific college ID"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM COLLEGE_ID WHERE College_ID_Number = %s", (college_id_number,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="College ID not found")
        return result
    finally:
        cursor.close()
        close_db_connection(conn)

@router.post("")
async def create_college_id(college_id: CollegeIDCreate):
    """Create a new college ID (Admin only)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO COLLEGE_ID (College_ID_Number, Issue_Date, Expiry_Date, Status)
            VALUES (%s, %s, %s, %s)
        """, (college_id.college_id_number, college_id.issue_date, 
              college_id.expiry_date, college_id.status))
        conn.commit()
        return {"message": "College ID created successfully"}
    except Error as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        close_db_connection(conn)

@router.delete("/{college_id_number}")
async def delete_college_id(college_id_number: str):
    """Delete a college ID"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM COLLEGE_ID WHERE College_ID_Number = %s", (college_id_number,))
        conn.commit()
        return {"message": "College ID deleted successfully"}
    finally:
        cursor.close()
        close_db_connection(conn)