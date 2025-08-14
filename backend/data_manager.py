"""
Data access layer for user profiles and analytics
"""
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
from config import Config

class DataManager:
    """Manages data loading and access"""
    def __init__(self):
        self._data = None
        self._scheduled_posts = []  # In-memory list for scheduled posts (for demo purposes)
        self._load_data()
    
    def _load_data(self) -> None:
        """Load data from JSON file"""
        try:
            with open(Config.USER_PROFILE_FILE, 'r', encoding='utf-8') as f:
                self._data = json.load(f)
        except FileNotFoundError:
            print(f"❌ Data file not found: {Config.USER_PROFILE_FILE}")
            self._data = {}
        except json.JSONDecodeError as e:
            print(f"❌ Error parsing JSON data: {e}")
            self._data = {}
    
    def get_user_profile(self) -> Dict[str, Any]:
        """Get user profile data"""
        return self._data.get("user_profile", {})
    
    def get_industry_trends(self, industry: str = None) -> Dict[str, Any]:
        """Get industry trends data"""
        trends = self._data.get("industry_trends", {})
        if industry:
            return {
                "industry": industry,
                "trends": trends.get(industry.title(), trends.get("Technology", [])),
                "available_industries": list(trends.keys())
            }
        return trends
    
    def get_content_strategies(self) -> Dict[str, Any]:
        """Get content strategies data"""
        return self._data.get("content_strategies", {})
    
    def get_post_analytics(self) -> Dict[str, Any]:
        """Get post analytics data"""
        return self._data.get("post_analytics", {})
    
    def get_post_by_id(self, post_id: str) -> Optional[Dict[str, Any]]:
        """Get specific post analytics by ID"""
        analytics = self.get_post_analytics()
        recent_posts = analytics.get("recent_posts", [])
        return next((post for post in recent_posts if post["id"] == post_id), None)
    
    def add_scheduled_post(self, post_data: Dict[str, Any]) -> str:
        """Add a scheduled post (in-memory for demo)"""
        post_id = f"scheduled_{len(self._scheduled_posts) + 1}"
        post_data["id"] = post_id
        post_data["status"] = "pending"
        self._scheduled_posts.append(post_data)
        return post_id
    
    def get_scheduled_posts(self) -> List[Dict[str, Any]]:
        """Get scheduled posts (in-memory)"""
        return self._scheduled_posts

# Global data manager instance
data_manager = DataManager()
