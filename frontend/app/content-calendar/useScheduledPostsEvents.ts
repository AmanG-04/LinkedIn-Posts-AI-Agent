import { useEffect, useState } from 'react';
import { Event as RBCEvent } from 'react-big-calendar';

export function useScheduledPostsEvents() {
  const [events, setEvents] = useState<RBCEvent[]>([]);

  useEffect(() => {
    async function fetchScheduledPosts() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://linkedin-agent-backend.onrender.com';
        const res = await fetch(`${backendUrl}/scheduled-posts`);
        const data = await res.json();
        if (data.scheduled_posts) {
          const mapped = data.scheduled_posts.map((post: any) => ({
            title: post.content,
            start: new Date(post.scheduled_time),
            end: new Date(post.scheduled_time),
            allDay: false,
          }));
          setEvents(mapped);
        }
      } catch (e) {
        setEvents([]);
      }
    }
    fetchScheduledPosts();
  }, []);

  return events;
}
