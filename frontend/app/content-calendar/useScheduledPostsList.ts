import { useEffect, useState } from 'react';

export function useScheduledPostsList() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchScheduledPosts() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://linkedin-agent-backend.onrender.com';
        const res = await fetch(`${backendUrl}/scheduled-posts`);
        const data = await res.json();
        setPosts(data.scheduled_posts || []);
      } catch {
        setPosts([]);
      }
    }
    fetchScheduledPosts();
  }, []);

  return posts;
}
