import React, { useState, useEffect } from 'react';

import SchedulePostOverlay from './SchedulePostOverlay';

interface UsedTopicListProps {
  topics: string[];
}

interface TopicData {
  post: string | null;
  linkedin_post_url: string | null;
}

const UsedTopicList: React.FC<UsedTopicListProps> = ({ topics }) => {
  const [topicData, setTopicData] = useState<{ [topic: string]: TopicData }>({});
  const [viewedPost, setViewedPost] = useState<string | null>(null);
  const [viewedTopic, setViewedTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  // Handler to schedule a post
  const handleSchedulePost = async (scheduledTime: string) => {
    if (!viewedPost) return;
    setIsScheduling(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/schedule-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: viewedPost, scheduled_time: scheduledTime }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Post scheduled successfully!');
        setShowSchedule(false);
      } else {
        alert('Failed to schedule post: ' + (data.detail || 'Unknown error'));
      }
    } catch (e) {
      alert('Error scheduling post.');
    }
    setIsScheduling(false);
  };

  // When fetching all topic data, use a fresh object to avoid stale closures
  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      const data: { [topic: string]: TopicData } = {};
      await Promise.all(
        topics.map(async (topic) => {
          try {
            const res = await fetch(`http://127.0.0.1:8000/get-generated-post/${encodeURIComponent(topic)}`);
            const json = await res.json();
            data[topic] = { post: json.post || null, linkedin_post_url: json.linkedin_post_url || null };
          } catch {
            data[topic] = { post: null, linkedin_post_url: null };
          }
        })
      );
      if (isMounted) setTopicData(data);
    };
    if (topics.length > 0) fetchAll();
    return () => { isMounted = false; };
  }, [topics]);

  const handleView = async (topic: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/get-generated-post/${encodeURIComponent(topic)}`);
      const data = await res.json();
      setViewedPost(data.post || 'No post found.');
      setViewedTopic(topic);
    } catch {
      setViewedPost('Error fetching post.');
      setViewedTopic(topic);
    }
    setIsLoading(false);
  };

  // When posting to LinkedIn, always refresh only the correct topic's data after posting
  const handlePostToLinkedIn = async (post: string, topic: string) => {
    setIsPosting(true);
    try {
      const res = await fetch('/api/linkedin/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: post }),
      });
      const data = await res.json();
      if (res.ok && data.postUrl) {
        // Save the LinkedIn post URL in MongoDB for this topic
        await fetch('http://127.0.0.1:8000/save-generated-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, post, linkedin_post_url: data.postUrl }),
        });
        // Refresh only this topic's data
        const res2 = await fetch(`http://127.0.0.1:8000/get-generated-post/${encodeURIComponent(topic)}`);
        const json = await res2.json();
        setTopicData((prev) => ({ ...prev, [topic]: { post: json.post || null, linkedin_post_url: json.linkedin_post_url || null } }));
        alert('Successfully posted to LinkedIn!');
      } else {
        alert('Failed to post to LinkedIn: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error posting to LinkedIn.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-black">
        <span role="img" aria-label="used">✅</span> Used Topics
      </h2>
      {topics.length === 0 ? (
        <div className="text-gray-500">No used topics.</div>
      ) : (
        <ul className="space-y-3">
          {topics.map((topic, idx) => (
            <li
              key={`used-topic-${idx}`}
              className="bg-gray-200 rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <span className="font-semibold text-black">{topic}</span>
              <div className="flex flex-col md:flex-row gap-2 mt-2">
                <button
                  onClick={() => handleView(topic)}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'View'}
                </button>
                {topicData[topic]?.linkedin_post_url ? (
                  <a
                    href={topicData[topic].linkedin_post_url || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    View LinkedIn Post
                  </a>
                ) : (
                  <button
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const res = await fetch(`http://127.0.0.1:8000/get-generated-post/${encodeURIComponent(topic)}`);
                        const data = await res.json();
                        if (data.post) {
                          // Always use the full generated post from MongoDB
                          await handlePostToLinkedIn(data.post, topic);
                        } else {
                          alert('No post found for this topic.');
                        }
                      } catch {
                        alert('Error fetching post.');
                      }
                      setIsLoading(false);
                    }}
                    className="btn-primary"
                    disabled={isLoading || isPosting}
                  >
                    {isPosting ? 'Posting...' : 'Post to LinkedIn'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {viewedPost && !showSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 max-w-2xl w-full relative max-h-[60vh] min-h-[150px] flex flex-col">
            <button
              onClick={() => setViewedPost(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl z-10"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">Saved LinkedIn Post</h2>
            <div className="mb-6 flex-1">
              <div className="text-black whitespace-pre-line max-h-[35vh] overflow-auto p-2 border border-gray-200 rounded">
                {viewedPost}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full">
              {topicData[viewedTopic || '']?.linkedin_post_url ? (
                <a
                  href={topicData[viewedTopic || ''].linkedin_post_url || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
                  View LinkedIn Post
                </a>
              ) : (
                <button
                  onClick={async () => {
                    // Always fetch the full generated post for the overlay as well
                    if (viewedTopic) {
                      setIsPosting(true);
                      try {
                        const res = await fetch(`http://127.0.0.1:8000/get-generated-post/${encodeURIComponent(viewedTopic)}`);
                        const data = await res.json();
                        if (data.post) {
                          await handlePostToLinkedIn(data.post, viewedTopic);
                        } else {
                          alert('No post found for this topic.');
                        }
                      } catch {
                        alert('Error fetching post.');
                      }
                      setIsPosting(false);
                    }
                  }}
                  className="btn-primary w-full"
                  disabled={isPosting}
                >
                  {isPosting ? 'Posting...' : 'Post to LinkedIn'}
                </button>
              )}
              <button
                onClick={() => setShowSchedule(true)}
                className="btn-accent w-full"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
      {viewedPost && showSchedule && (
        <SchedulePostOverlay
          post={viewedPost}
          onClose={() => setShowSchedule(false)}
          onSchedule={handleSchedulePost}
          isScheduling={isScheduling}
        />
      )}
    </div>
  );
};

export default UsedTopicList;
