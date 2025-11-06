from fastapi import APIRouter, HTTPException
from models import LoginRequest
from database import get_db_connection, close_db_connection
import hashlib

router = APIRouter(prefix="/auth", tags=["Authentication"])

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/login")
async def login(request: LoginRequest):
    """
    Authenticate user (admin or student) and return user information
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        hashed_pw = hash_password(request.password)
        cursor.execute("""
            SELECT * FROM USER_LOGIN 
            WHERE User_ID = %s AND User_Type = %s AND Password = %s
        """, (request.userId, request.userType, hashed_pw))
        
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Get additional user information based on user type
        if request.userType == 'admin':
            cursor.execute("SELECT * FROM ADMIN WHERE Admin_ID = %s", (request.userId,))
            user_info = cursor.fetchone()
        else:
            cursor.execute("SELECT * FROM STUDENT WHERE Student_ID = %s", (request.userId,))
            user_info = cursor.fetchone()
        
        return {
            "userId": request.userId,
            "userType": request.userType,
            "first_name": user_info.get('First_Name') if user_info else None
        }
    finally:
        cursor.close()
        close_db_connection(conn)