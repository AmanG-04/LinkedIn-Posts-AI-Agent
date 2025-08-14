"""
AI service for content generation using Gemini
Autonomous TLDR news fetcher and MongoDB integration
"""
import os
import feedparser
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import threading
import time
import google.generativeai as genai
from typing import Dict, Any
from config import Config

class AIService:
    """Handles AI-powered content generation"""
    
    def __init__(self):
        if Config.GEMINI_API_KEY:
            genai.configure(api_key=Config.GEMINI_API_KEY)
            self.model = genai.GenerativeModel(Config.GEMINI_MODEL)
        else:
            self.model = None
    
    def is_configured(self) -> bool:
        """Check if AI service is properly configured"""
        return self.model is not None
    def generate_personalized_post(self, topic: str, content_type: str, user_profile: Dict[str, Any]) -> str:
        """Generate personalized content based on user profile"""
        if not self.is_configured():
            raise Exception("AI service not configured. Please set GEMINI_API_KEY.")
        prompt = f"""
        Act as a LinkedIn content expert. You're writing for {user_profile['name']}, who is a {user_profile['headline']}.
        Add a hook to grab attention.
        User Background:
        - Industry: {user_profile['industry']}
        - Position: {user_profile['position']} at {user_profile['company']}
        - Skills: {', '.join(user_profile['skills'][:5])}
        - Interests: {', '.join(user_profile['interests'][:3])}
        - Summary: {user_profile['summary']}

        Generate a {content_type} LinkedIn post about '{topic}' that:
        1. Reflects their expertise and experience
        2. Uses their authentic voice and perspective
        3. Includes relevant insights from their background
        4. Encourages meaningful engagement
        5. Includes 5-7 relevant hashtags
        6. Use 3-4 emojis

        Keep it professional, engaging, and under 300 words.
        Do NOT use any Markdown formatting (such as ##, #, *, or other Markdown symbols) in the post. Write the post as plain text only, without headings or Markdown.
        """
        response = self.model.generate_content(prompt)
        if not response or not response.text:
            raise Exception("Empty response from AI model")
        return response.text
    def optimize_post(self, post_content: str) -> str:
        """Analyze and optimize a post for better engagement"""
        if not self.is_configured():
            raise Exception("AI service not configured. Please set GEMINI_API_KEY.")
        
        prompt = f"""
        Analyze this LinkedIn post and provide optimization suggestions:
        
        Post: "{post_content}"
        
        Provide:
        1. Engagement score (1-10)
        2. Specific improvement suggestions
        3. Optimized version of the post
        4. Best hashtags for this content
        5. Optimal posting time recommendations
        
        Focus on maximizing likes, comments, and shares while maintaining professionalism.
        """
        
        response = self.model.generate_content(prompt)
        if not response or not response.text:
            raise Exception("Empty response from AI model")
        
        return response.text
    def generate_news_post(self, title: str, user_profile: dict) -> str:
        """Generate a LinkedIn post based on a news item"""
        if not self.is_configured():
            raise Exception("AI service not configured. Please set GEMINI_API_KEY.")
        prompt = f'''
        Act as an expert LinkedIn content writer and news researcher.
        Add a hook to grab attention.
        Generate an engaging LinkedIn post based on the following news item:
        Title: "{title}"
        This title is from tldr newsletter so you need to read the tldr newsletter containing this topic online and then make the post.
        you can also look at other linkedin posts on the same topic for reference.
        The tone of the text should be professional and insightful.
        dont mention things like these explicitly : TLDR newsletter, **Call to Action:**
        Use 3-4 emojis,Do NOT use any Markdown formatting (such as ##, #, *, or other Markdown symbols) in the post.
        Include 3-5 relevant hashtags, a call to action, and keep it under 200 words.
        '''
        response = self.model.generate_content(prompt)
        if not response or not response.text:
            raise Exception("Empty response from AI model")
        return response.text

# Global AI service instance
ai_service = AIService()

# MongoDB setup with connection check
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Test connection
    client.admin.command('ping')
    db = client["linkedin_ai_agent"]
    tldr_collection = db["tldr_news"]
    MONGO_AVAILABLE = True
except ServerSelectionTimeoutError:
    print("Warning: Could not connect to MongoDB, TLDR news will be disabled.")
    client = None
    tldr_collection = None
    MONGO_AVAILABLE = False

# TLDR RSS Feed URL
TLDR_RSS_URL = "https://tldr.tech/rss"
# Function to fetch TLDR news and store in MongoDB
def fetch_and_store_tldr_news():
    """Fetch TLDR RSS feed, extract subtopics, and store new items in MongoDB."""
    if not MONGO_AVAILABLE:
        return
    try:
        feed = feedparser.parse(TLDR_RSS_URL)
        for entry in feed.entries:
            # Extract subtopics from the title
            subtopics = extract_subtopics(entry.title)
            # Filter out already used subtopics
            new_subtopics = [topic for topic in subtopics if not is_topic_used(topic)]

            for subtopic in new_subtopics:
                # Use link+subtopic as unique identifier
                if not tldr_collection.find_one({"link": entry.link, "subtopic": subtopic}):
                    tldr_collection.insert_one({
                        "title": entry.title,
                        "link": entry.link,
                        "subtopic": subtopic,
                        "published": entry.published,
                        "processed": False
                    })
    except ServerSelectionTimeoutError:
        # Could not reach MongoDB, skip this cycle
        print("Warning: MongoDB unavailable during TLDR fetch.")
# Function to extract subtopics from a title
def extract_subtopics(title: str) -> list:
    """Extract subtopics from a title."""
    # Split by comma, ignore empty/whitespace-only topics
    return [topic.strip() for topic in title.split(",") if topic.strip()]
# Function to check if a topic has already been used
def is_topic_used(topic: str) -> bool:
    """Check if a topic has already been used."""
    # Check MongoDB for used topics by 'subtopic' and 'posted' True
    return tldr_collection.find_one({"subtopic": topic, "posted": True}) is not None
# Function to fetch topics that have not been posted about
def fetch_non_posted_topics():
    """Fetch topics that have not been posted about."""
    if not MONGO_AVAILABLE:
        return []
    try:
        # Fetch topics where 'posted' is False or not set
        non_posted_topics = tldr_collection.find(
            {"posted": {"$ne": True}},
            {"_id": 0, "subtopic": 1}
        )
        # Each doc["subtopic"] is a string, not a list
        return [doc.get("subtopic") for doc in non_posted_topics if doc.get("subtopic")]
    except Exception as e:
        print(f"Error fetching non-posted topics: {e}")
        return []

def mark_topics_as_posted(topics: list):
    """Mark topics as posted."""
    if not MONGO_AVAILABLE:
        return
    try:
        for topic in topics:
            tldr_collection.update_many(
                {"subtopic": topic},
                {"$set": {"posted": True}}
            )
    except Exception as e:
        print(f"Error marking topics as posted: {e}")
# Function to run the autonomous TLDR fetcher
def autonomous_tldr_fetcher(interval=86400):
    """Background thread to fetch TLDR news every day."""
    while True:
        try:
            fetch_and_store_tldr_news()
            print("TLDR news fetched and stored successfully.")
        except Exception as e:
            # Log any unexpected errors and continue
            print(f"Error in TLDR fetcher: {e}")
        time.sleep(interval)
# Function to normalize existing titles
def normalize_existing_titles():
    """Normalize existing rows in MongoDB by extracting subtopics from titles."""
    if not MONGO_AVAILABLE:
        print("MongoDB is not available.")
        return

    # Deprecated: No longer needed with 'subtopic' standardization
    pass

# Start the background fetcher thread on import
fetcher_thread = threading.Thread(target=autonomous_tldr_fetcher, daemon=True)
fetcher_thread.start()
