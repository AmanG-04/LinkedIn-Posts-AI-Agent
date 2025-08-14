
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# Model for basic user input when generating a post
class UserInput(BaseModel):
    role: str
    industry: str

# Model for a request to generate personalized content
class GenerateRequest(BaseModel):
    topic: str
    content_type: Optional[str] = "thought_leadership"

# Model for sending post content to be optimized
class PostContent(BaseModel):
    text: str

# Model for requesting a content calendar
class ContentCalendarRequest(BaseModel):
    days: int = 7
    content_types: Optional[List[str]] = ["thought_leadership", "educational", "engagement"]

# Model for requesting analytics data for posts
class AnalyticsRequest(BaseModel):
    post_id: Optional[str] = None
    date_range: Optional[int] = 30

# Model for scheduling a post in the future
class SchedulePostRequest(BaseModel):
    content: str
    scheduled_time: str
    content_type: Optional[str] = "general"

# Model for a user's LinkedIn profile
class UserProfile(BaseModel):
    id: str
    name: str
    headline: str
    summary: str
    industry: str
    company: str
    position: str
    location: str
    skills: List[str]
    interests: List[str]
    experience: List[Dict[str, str]]
    education: List[Dict[str, str]]

# Model for analytics data of a LinkedIn post
class PostAnalytics(BaseModel):
    id: str
    content: str
    date: str
    likes: int
    comments: int
    shares: int
    impressions: int
    engagement_rate: float

# Model for a content strategy
class ContentStrategy(BaseModel):
    frequency: str
    topics: List[str]
    tone: str
