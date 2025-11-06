from fastapi import APIRouter, HTTPException
from models import DepartmentCreate
from database import get_db_connection, close_db_connection
from mysql.connector import Error

router = APIRouter(prefix="/departments", tags=["Departments"])

@router.get("")
async def get_departments():
    """Get all departments"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM DEPARTMENT")
        return cursor.fetchall()
    finally:
        cursor.close()
        close_db_connection(conn)

@router.post("")
async def create_department(dept: DepartmentCreate):
    """Create a new department"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO DEPARTMENT (Dept_ID, Dept_Name, HOD_Name)
            VALUES (%s, %s, %s)
        """, (dept.dept_id, dept.dept_name, dept.hod_name))
        conn.commit()
        return {"message": "Department created successfully"}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cursor.close()
        close_db_connection(conn)

@router.delete("/{dept_id}")
async def delete_department(dept_id: str):
    """Delete a department"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM DEPARTMENT WHERE Dept_ID = %s", (dept_id,))
        conn.commit()
        return {"message": "Department deleted successfully"}
    finally:
        cursor.close()
        close_db_connection(conn)