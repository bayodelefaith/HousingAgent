import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Housing Agent API"
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./housing.db"
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_HERE_CHANGE_ME"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
