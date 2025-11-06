from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database settings
    DB_HOST: str = "localhost"
    DB_USER: str = "root"
    DB_PASSWORD: str = "215253"  # CHANGE THIS TO YOUR MYSQL PASSWORD!
    DB_NAME: str = "college_db"
    
    # API settings
    API_TITLE: str = "College DBMS API"
    API_VERSION: str = "1.0.0"
    
    class Config:
        env_file = ".env"

settings = Settings()