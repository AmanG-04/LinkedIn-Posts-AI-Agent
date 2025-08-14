import { useEffect, useState } from 'react';
import { Event as RBCEvent } from 'react-big-calendar';

export function useScheduledPostsEvents() {
  const [events, setEvents] = useState<RBCEvent[]>([]);

  useEffect(() => {
    async function fetchScheduledPosts() {
      try {
        const res = await fetch('http://127.0.0.1:8000/scheduled-posts');
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
