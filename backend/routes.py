
"""
API route handlers for the LinkedIn Posts AI Agent
"""
from fastapi import APIRouter, HTTPException, Request, Response
from starlette.responses import JSONResponse
from models import (
    UserInput, GenerateRequest, PostContent, 
    ContentCalendarRequest, AnalyticsRequest, SchedulePostRequest
)
from services import (
    ProfileService, IndustryService, ContentService, 
    AnalyticsService, SchedulingService
)
from ai_service import ai_service, tldr_collection, MONGO_AVAILABLE, fetch_non_posted_topics
from pydantic import BaseModel
import json
import traceback

"""Using a single router for all endpoints"""
router = APIRouter()  

# Logout endpoint must come after router is defined
@router.post("/api/linkedin/logout")
def linkedin_logout():
    """Logout by clearing the LinkedIn access token cookie."""
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("linkedin_access_token")
    return response

# TLDR news endpoint
@router.get("/tldr-news")
def get_tldr_news():
    """Get latest TLDR news from MongoDB."""
    # If MongoDB is unavailable, return empty list
    if not MONGO_AVAILABLE or tldr_collection is None:
        return JSONResponse(content={"news": []})
    try:
        news = list(
            tldr_collection.find({}, {"_id": 0})
            .sort("published", -1)
            .limit(10)
        )
        return JSONResponse(content={"news": news})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health and status endpoints
@router.get("/")
def read_root():
    """Root endpoint"""
    return {"message": "LinkedIn Posts AI Agent Backend is running!", "status": "healthy"}


# Profile endpoints
@router.get("/profile")
def get_user_profile():
    """Get user profile with analysis insights"""
    try:
        profile_analysis = ProfileService.get_profile_analysis()
        return JSONResponse(content=profile_analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Industry research endpoints
@router.get("/industry-trends/{industry}")
def get_industry_trends(industry: str):
    """Get latest industry trends and news"""
    try:
        trends = IndustryService.get_industry_trends(industry)
        return JSONResponse(content=trends)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Content strategy endpoints
@router.get("/content-strategy")
def get_content_strategy():
    """Get personalized content strategy"""
    try:
        strategy = ContentService.get_content_strategy()
        return JSONResponse(content=strategy)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/content-calendar")
def generate_content_calendar(request: ContentCalendarRequest):
    """Generate a content calendar"""
    try:
        calendar = ContentService.generate_content_calendar(request.days, request.content_types)
        return JSONResponse(content=calendar)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Content generation endpoints
@router.post("/generate-post")
def generate_post(user_input: UserInput):
    """Generate a basic LinkedIn post"""
    try:
        result = ContentService.generate_basic_post(user_input.role, user_input.industry)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-personalized-content")
def generate_personalized_content(request: GenerateRequest):
    """Generate personalized content based on user profile"""
    try:
        result = ContentService.generate_personalized_content(request.topic, request.content_type)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Engagement optimization endpoints
@router.post("/optimize-post")
def optimize_post(post_content: PostContent):
    """Analyze and optimize a post for better engagement"""
    try:
        result = ContentService.optimize_post(post_content.text)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Analytics endpoints
@router.get("/analytics")
def get_analytics():
    """Get post performance analytics"""
    try:
        analytics = AnalyticsService.get_analytics()
        return JSONResponse(content=analytics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/post/{post_id}")
def get_post_analytics(post_id: str):
    """Get analytics for a specific post"""
    try:
        analytics = AnalyticsService.get_post_analytics(post_id)
        return JSONResponse(content=analytics)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# Scheduling endpoints
@router.post("/schedule-post")
def schedule_post(request: SchedulePostRequest):
    """Schedule a post for future publishing"""
    try:
        result = SchedulingService.schedule_post(request.content, request.scheduled_time)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/scheduled-posts")
def get_scheduled_posts():
    """Get all scheduled posts"""
    try:
        posts = SchedulingService.get_scheduled_posts()
        return JSONResponse(content=posts)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Test endpoints
@router.get("/test-gemini")
def test_gemini():
    """Test Gemini API connection"""
    return ai_service.test_connection()

# News post generation endpoint
class NewsPostRequest(BaseModel):
    title: str

@router.post("/generate-news-post")
def generate_news_post(request: NewsPostRequest):
    """Generate a LinkedIn post based on a news item"""
    try:
        post = ai_service.generate_news_post(request.title, {})
        # Mark the topic as posted in MongoDB for persistence
        tldr_collection.update_many({"subtopic": request.title}, {"$set": {"posted": True}})
        return JSONResponse(content={"post": post})
    except Exception as e:
        print('Error in /generate-news-post:', traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user-interests")
def get_user_interests():
    """Fetch user interests from user_profile.json."""
    try:
        with open("backend/data/user_profile.json", "r") as file:
            data = json.load(file)
            interests = data.get("user_profile", {}).get("interests", [])
            return {"interests": interests}
    except Exception as e:
        return {"error": str(e)}

@router.get("/non-posted-topics")
def get_non_posted_topics():
    """Fetch individual subtopics that have not been posted about."""
    try:
        topics = fetch_non_posted_topics()
        # Ensure topics is a flat list of subtopics
        return {"topics": topics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching non-posted topics: {e}")

@router.get("/used-topics")
def get_used_topics():
    """Fetch topics that have already been posted about."""
    try:
        # Find all documents where 'posted' is True and collect all subtopics (now using 'subtopic' string)
        used_docs = tldr_collection.find({"posted": True}, {"_id": 0, "subtopic": 1})
        used_topics = [doc.get("subtopic") for doc in used_docs if doc.get("subtopic")]
        return {"topics": used_topics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching used topics: {e}")

@router.post("/mark-topic-posted")
async def mark_topic_posted(request: Request):
    """Mark a topic as posted in the database."""
    try:
        data = await request.json()
        topic = data.get("topic")
        if not topic:
            raise HTTPException(status_code=400, detail="No topic provided.")
        # Set 'posted' to True for all docs containing this subtopic (use 'subtopic' field)
        tldr_collection.update_many({"subtopic": topic}, {"$set": {"posted": True}})
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error marking topic as posted: {e}")


@router.post("/save-generated-post")
async def save_generated_post(request: Request):
    """Save a generated post for a topic in MongoDB."""
    try:
        data = await request.json()
        topic = data.get("topic")
        post = data.get("post")
        linkedin_post_url = data.get("linkedin_post_url")
        if not topic or not post:
            raise HTTPException(status_code=400, detail="Topic and post are required.")
        update_fields = {"generated_post": post}
        if linkedin_post_url:
            update_fields["linkedin_post_url"] = linkedin_post_url
        tldr_collection.update_many({"subtopic": topic}, {"$set": update_fields})
        return {"status": "success"}
    except Exception as e:
        print('Error in /save-generated-post:', traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error saving generated post: {e}")


@router.get("/get-generated-post/{topic}")
def get_generated_post(topic: str):
    """Get the generated post for a topic from MongoDB."""
    try:
        doc = tldr_collection.find_one({"subtopic": topic}, {"_id": 0, "generated_post": 1, "linkedin_post_url": 1})
        return {
            "post": doc.get("generated_post") if doc else None,
            "linkedin_post_url": doc.get("linkedin_post_url") if doc else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching generated post: {e}")
