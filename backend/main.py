"""
LinkedIn Posts AI Agent Backend
A professional AI-powered LinkedIn content creation and management system.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()
from config import Config
from routes import router

# Initialize configuration
Config.validate_config()

# Create FastAPI application
app = FastAPI(
    title=Config.APP_NAME,
    version=Config.APP_VERSION,
    description="AI-powered LinkedIn content creation and management system",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.CORS_ORIGINS,
    allow_credentials=Config.CORS_CREDENTIALS,
    allow_methods=Config.CORS_METHODS,
    allow_headers=Config.CORS_HEADERS,
)

# Include API routes
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=Config.DEBUG
    )

