"""
Configuration settings for the LinkedIn Posts AI Agent
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

class Config:
    """Application configuration"""
    
    # API Keys
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
    
    # Application settings
    APP_NAME = "LinkedIn Posts AI Agent"
    APP_VERSION = "1.0.0"
    DEBUG = os.environ.get("DEBUG", "False").lower() == "true"
    
    # CORS settings
    CORS_ORIGINS = ["*"]  # Allow all origins for development
    CORS_CREDENTIALS = False
    CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_HEADERS = ["*"]
    
    # Data file paths
    DATA_DIR = Path(__file__).parent / "data"
    USER_PROFILE_FILE = DATA_DIR / "user_profile.json"
    
    # Gemini model settings
    GEMINI_MODEL = "gemini-1.5-flash"
    
    @classmethod
    def validate_config(cls):
        """Validate required configuration"""
        if not cls.GEMINI_API_KEY:
            print("❌ Warning: GEMINI_API_KEY environment variable is not set")
            return False
        print("✅ GEMINI_API_KEY is configured")
        return True
