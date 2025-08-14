"""
Service layer for business logic
"""
from datetime import datetime, timedelta
from typing import Dict, List, Any
from data_manager import data_manager
from ai_service import ai_service
import os
import requests

class ProfileService:
    """Handles user profile analysis and recommendations"""
    
    @staticmethod
    def get_profile_analysis() -> Dict[str, Any]:
        """Get user profile with analysis insights"""
        profile = data_manager.get_user_profile()
        
        analysis = {
            "content_recommendations": [
                "Share technical insights about AI/ML implementations",
                "Discuss software architecture best practices",
                "Comment on latest tech industry trends",
                "Share career growth experiences"
            ],
            "target_audience": "Software engineers, tech leads, AI enthusiasts",
            "posting_frequency": "3-4 times per week",
            "optimal_content_mix": {
                "technical_insights": "40%",
                "industry_trends": "30%",
                "career_advice": "20%",
                "personal_experiences": "10%"
            }
        }
        
        return {
            "profile": profile,
            "analysis": analysis
        }

class IndustryService:
    """Handles industry research and trends"""
    
    @staticmethod
    def get_industry_trends(industry: str) -> Dict[str, Any]:
        """Get latest industry trends and news"""
        trends_data = data_manager.get_industry_trends(industry)
        
        return {
            "industry": industry,
            "trends": trends_data.get("trends", []),
            "last_updated": datetime.now().isoformat(),
            "sources": ["Industry Reports", "News APIs", "Social Media Analysis"],
            "available_industries": trends_data.get("available_industries", [])
        }

class ContentService:
    """Handles content strategy and generation"""
    
    @staticmethod
    def get_content_strategy() -> Dict[str, Any]:
        """Get personalized content strategy"""
        strategies = data_manager.get_content_strategies()
        
        return {
            "strategies": strategies,
            "recommendations": {
                "primary_strategy": "thought_leadership",
                "secondary_strategy": "educational",
                "content_pillars": ["Technical Expertise", "Industry Insights", "Career Growth", "Innovation"],
                "posting_schedule": {
                    "monday": "Industry insights",
                    "wednesday": "Technical how-to",
                    "friday": "Personal experience/reflection"
                }
            }
        }
    
    @staticmethod
    def generate_content_calendar(days: int, content_types: List[str]) -> Dict[str, Any]:
        """Generate a content calendar"""
        calendar = []
        for i in range(days):
            date = datetime.now() + timedelta(days=i)
            content_type = content_types[i % len(content_types)]
            
            calendar.append({
                "date": date.strftime("%Y-%m-%d"),
                "content_type": content_type,
                "suggested_topic": f"Topic for {content_type} on {date.strftime('%A')}",
                "optimal_time": "1:00 PM PST",
                "hashtags": ["#TechLeadership", "#AI", "#SoftwareEngineering"]
            })
        
        return {"calendar": calendar, "total_days": days}
    
    @staticmethod
    def generate_basic_post(role: str, industry: str) -> Dict[str, Any]:
        """Generate a basic LinkedIn post"""
        try:
            post_content = ai_service.generate_basic_post(role, industry)
            return {"post": post_content, "status": "success"}
        except Exception as e:
            raise Exception(f"Failed to generate post: {str(e)}")
    
    @staticmethod
    def generate_personalized_content(topic: str, content_type: str) -> Dict[str, Any]:
        """Generate personalized content based on user profile"""
        try:
            user_profile = data_manager.get_user_profile()
            post_content = ai_service.generate_personalized_post(topic, content_type, user_profile)
            
            return {
                "post": post_content,
                "content_type": content_type,
                "topic": topic,
                "user_context": {
                    "name": user_profile.get('name'),
                    "headline": user_profile.get('headline'),
                    "industry": user_profile.get('industry')
                },
                "status": "success"
            }
        except Exception as e:
            raise Exception(f"Failed to generate personalized content: {str(e)}")
    
    @staticmethod
    def optimize_post(post_content: str) -> Dict[str, Any]:
        """Analyze and optimize a post for better engagement"""
        try:
            optimization_analysis = ai_service.optimize_post(post_content)
            
            return {
                "original_post": post_content,
                "optimization_analysis": optimization_analysis,
                "suggestions": [
                    "Add a compelling hook in the first line",
                    "Include a call-to-action",
                    "Use relevant hashtags",
                    "Post during peak engagement hours"
                ],
                "best_posting_times": ["9:00 AM", "1:00 PM", "5:00 PM PST"]
            }
        except Exception as e:
            raise Exception(f"Failed to optimize post: {str(e)}")

class AnalyticsService:
    """Handles performance analytics"""
    
    @staticmethod
    def get_analytics() -> Dict[str, Any]:
        """Get post performance analytics"""
        return data_manager.get_post_analytics()
    
    @staticmethod
    def get_post_analytics(post_id: str) -> Dict[str, Any]:
        """Get analytics for a specific post"""
        post = data_manager.get_post_by_id(post_id)
        if not post:
            raise Exception("Post not found")
        
        return {
            "post": post,
            "insights": {
                "performance_vs_average": "+12% above average engagement",
                "best_performing_element": "Technical insights resonated well",
                "audience_demographics": "Primarily software engineers (65%), tech leads (25%)",
                "engagement_timeline": "Peak engagement at 2:30 PM PST"
            }
        }

class SchedulingService:

    @staticmethod
    def schedule_post(content: str, scheduled_time: str) -> Dict[str, Any]:
        """Schedule a post for future publishing"""
        post_data = {
            "content": content,
            "scheduled_time": scheduled_time,
        }
        post_id = data_manager.add_scheduled_post(post_data)
        return {
            "message": "Post scheduled successfully",
            "post_id": post_id,
            "content": content,
            "scheduled_time": scheduled_time,
            "status": "scheduled"
        }

    @staticmethod
    def get_scheduled_posts() -> Dict[str, Any]:
        """Get all scheduled posts"""
        scheduled_posts = data_manager.get_scheduled_posts()
        return {"scheduled_posts": scheduled_posts}

# Standalone function to post content to LinkedIn
def post_to_linkedin(content: str, access_token: str, user_id: str) -> dict:
    """Post content to LinkedIn using the REST API."""
    url = "https://api.linkedin.com/rest/posts"
    post_body = {
        "author": f"urn:li:person:{user_id}",
        "commentary": content,
        "visibility": "PUBLIC",
        "distribution": {
            "feedDistribution": "MAIN_FEED",
            "targetEntities": [],
            "thirdPartyDistributionChannels": []
        },
        "lifecycleState": "PUBLISHED",
        "isReshareDisabledByAuthor": False
    }
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "LinkedIn-Version": "202306",
        "X-Restli-Protocol-Version": "2.0.0",
    }
    response = requests.post(url, json=post_body, headers=headers)
    try:
        data = response.json()
    except Exception:
        data = response.text
    return {
        "ok": response.ok,
        "status": response.status_code,
        "data": data,
        "postIdHeader": response.headers.get("x-restli-id"),
    }
    """Handles post scheduling"""
    

    @staticmethod
    def schedule_post(content: str, scheduled_time: str) -> Dict[str, Any]:
        """Schedule a post for future publishing"""
        post_data = {
            "content": content,
            "scheduled_time": scheduled_time,
        }
        post_id = data_manager.add_scheduled_post(post_data)
        return {
            "message": "Post scheduled successfully",
            "post_id": post_id,
            "content": content,
            "scheduled_time": scheduled_time,
            "status": "scheduled"
        }

    @staticmethod
    def get_scheduled_posts() -> Dict[str, Any]:
        """Get all scheduled posts"""
        scheduled_posts = data_manager.get_scheduled_posts()
    return {"scheduled_posts": scheduled_posts}



    """Post content to LinkedIn using the REST API."""
    url = "https://api.linkedin.com/rest/posts"
    post_body = {
        "author": f"urn:li:person:{user_id}",
        "commentary": content,
        "visibility": "PUBLIC",
        "distribution": {
            "feedDistribution": "MAIN_FEED",
            "targetEntities": [],
            "thirdPartyDistributionChannels": []
        },
        "lifecycleState": "PUBLISHED",
        "isReshareDisabledByAuthor": False
    }
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "LinkedIn-Version": "202306",
        "X-Restli-Protocol-Version": "2.0.0",
    }
    response = requests.post(url, json=post_body, headers=headers)
    try:
        data = response.json()
    except Exception:
        data = response.text
    return {
        "ok": response.ok,
        "status": response.status_code,
        "data": data,
        "postIdHeader": response.headers.get("x-restli-id"),
    }
