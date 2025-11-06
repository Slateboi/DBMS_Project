import mysql.connector
from mysql.connector import Error
from config import settings

def get_db_connection():
    """Create and return a MySQL database connection"""
    try:
        connection = mysql.connector.connect(
            host=settings.DB_HOST,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            database=settings.DB_NAME
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        raise

def close_db_connection(connection):
    """Close the database connection"""
    if connection and connection.is_connected():
        connection.close()