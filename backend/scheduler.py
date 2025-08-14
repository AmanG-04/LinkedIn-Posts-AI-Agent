"""
Background scheduler for posting scheduled LinkedIn posts.
"""
import threading
import time
from datetime import datetime, timezone

from data_manager import data_manager
import os
from services import post_to_linkedin

def process_scheduled_posts():
    while True:
        now = datetime.now(timezone.utc)
        for post in data_manager.get_scheduled_posts():
            if post.get("status") == "pending":
                scheduled_time = post.get("scheduled_time")
                if scheduled_time:
                    try:
                        scheduled_dt = datetime.fromisoformat(scheduled_time)
                    except Exception:
                        continue
                    if scheduled_dt <= now:
                        # --- Call real LinkedIn posting logic ---
                        access_token = os.environ.get("LINKEDIN_ACCESS_TOKEN")
                        user_id = os.environ.get("LINKEDIN_USER_ID")
                        if not access_token or not user_id:
                            print("[Scheduler] Missing LinkedIn access token or user id in environment.")
                            continue
                        result = post_to_linkedin(post["content"], access_token, user_id)
                        print(f"[Scheduler] Posted scheduled post: {post['id']} at {now.isoformat()} | Result: {result}")
                        post["status"] = "posted"
                        post["posted_at"] = now.isoformat()
                        post["linkedin_result"] = result
        time.sleep(60)  # Check every minute

# Start the scheduler in a background thread
scheduler_thread = threading.Thread(target=process_scheduled_posts, daemon=True)
scheduler_thread.start()
