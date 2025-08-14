import { useState } from 'react';

// Handler to schedule a post (must access overlayPost and setOverlayPost)
const [isScheduling, setIsScheduling] = useState(false);

// Add these lines to define overlayPost and setOverlayPost state
const [overlayPost, setOverlayPost] = useState<string>('');

const handleSchedulePost = async (scheduledTime: string) => {
  setIsScheduling(true);
  try {
    const res = await fetch('http://127.0.0.1:8000/schedule-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: overlayPost, scheduled_time: scheduledTime }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('Post scheduled successfully!');
      setOverlayPost('');
    } else {
      alert('Failed to schedule post: ' + (data.detail || 'Unknown error'));
    }
  } catch (e) {
    alert('Error scheduling post.');
  }
  setIsScheduling(false);
};
