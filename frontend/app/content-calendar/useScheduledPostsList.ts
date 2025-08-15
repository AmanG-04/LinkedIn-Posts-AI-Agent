import { useEffect, useState } from 'react';

export function useScheduledPostsList() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchScheduledPosts() {
      try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:8000'}/scheduled-posts`);
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
