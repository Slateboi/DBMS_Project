from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import get_db_connection, close_db_connection
from routers import auth, students, departments, courses, enrollments, grades, collegeid
import hashlib

app = FastAPI(title=settings.API_TITLE, version=settings.API_VERSION)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(departments.router)
app.include_router(courses.router)
app.include_router(enrollments.router)
app.include_router(grades.router)
app.include_router(collegeid.router)

@app.on_event("startup")
async def startup_event():
    """Initialize database with default admin"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM ADMIN WHERE Admin_ID = 'admin001'")
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO ADMIN (Admin_ID, Email, First_Name, Last_Name)
                VALUES ('admin001', 'admin@college.edu', 'System', 'Administrator')
            """)
            hashed_pw = hashlib.sha256('admin123'.encode()).hexdigest()
            cursor.execute("""
                INSERT INTO USER_LOGIN (User_ID, User_Type, Password)
                VALUES ('admin001', 'admin', %s)
            """, (hashed_pw,))
            conn.commit()
            print("✓ Default admin created: admin001 / admin123")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        cursor.close()
        close_db_connection(conn)

@app.get("/")
async def root():
    return {"message": "College DBMS API", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)