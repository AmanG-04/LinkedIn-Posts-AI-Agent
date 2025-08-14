"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TopicList from './TopicList';
import UsedTopicList from './UsedTopicList';
import PostOverlay from './PostOverlay';

export default function ClientDashboard() {
  const [tldrNews, setTldrNews] = useState<string[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [contentType, setContentType] = useState('professional');
  const [post, setPost] = useState('AI Generated post will appear here...');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [newsPosts, setNewsPosts] = useState<{ [key: number]: string }>({});
  const [isNewsPostLoading, setIsNewsPostLoading] = useState(false);
  const [selectedNewsIndex, setSelectedNewsIndex] = useState<number | null>(null);
  const [usedTopics, setUsedTopics] = useState<string[]>([]);
  const [overlayPost, setOverlayPost] = useState<string>('');

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateTopic, setRegenerateTopic] = useState<string | null>(null);
  const [isPostingToLinkedIn, setIsPostingToLinkedIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [linkedinPostUrl, setLinkedinPostUrl] = useState<string | null>(null);
  const [linkedinApiResponse, setLinkedinApiResponse] = useState<any>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  // Handler to schedule a post (must access overlayPost and setOverlayPost)
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

  useEffect(() => {
    // Check authentication by calling /api/linkedin/userinfo
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/linkedin/userinfo');
        const data = await res.json();
        setIsAuthenticated(!!data.authenticated);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchNonPostedTopics = async () => {
      setIsNewsLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/non-posted-topics');
        const data = await res.json();
        setTldrNews(data.topics || []);
      } catch (e) {
        setTldrNews([]);
      }
      setIsNewsLoading(false);
    };
    const fetchUsedTopics = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/used-topics');
        const data = await res.json();
        setUsedTopics(data.topics || []);
      } catch (e) {
        setUsedTopics([]);
      }
    };
    fetchNonPostedTopics();
    fetchUsedTopics();
  }, [isAuthenticated]);

  const markTopicAsPosted = async (topic: string) => {
    try {
      await fetch('http://127.0.0.1:8000/mark-topic-posted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
    } catch {}
  };

  const saveGeneratedPost = async (topic: string, post: string, linkedin_post_url?: string) => {
    try {
      await fetch('http://127.0.0.1:8000/save-generated-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, post, linkedin_post_url }),
      });
    } catch {}
  };

  const generateNewsPost = async (topic: string, idx: number) => {
    setIsNewsPostLoading(true);
    setSelectedNewsIndex(idx);
    setRegenerateTopic(topic);
    try {
      const res = await fetch('http://127.0.0.1:8000/generate-news-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: topic }),
      });
      const data = await res.json();
      setOverlayPost(data.post);
      saveGeneratedPost(topic, data.post);
      setUsedTopics((prev) => [...prev, topic]);
      setTldrNews((prev) => prev.filter((t, i) => t !== topic || i !== idx));
      markTopicAsPosted(topic);
      setTimeout(() => {
        setIsNewsPostLoading(false);
        setSelectedNewsIndex(null);
      }, 500);
    } catch {
      setOverlayPost('Error generating post.');
      setIsNewsPostLoading(false);
      setSelectedNewsIndex(null);
    }
  };

  const regenerateOverlayPost = async () => {
    if (!regenerateTopic) return;
    setIsRegenerating(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/generate-news-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: regenerateTopic }),
      });
      const data = await res.json();
      setOverlayPost(data.post);
      saveGeneratedPost(regenerateTopic, data.post);
    } catch {
      setOverlayPost('Error generating post.');
    }
    setIsRegenerating(false);
  };

  const handleCloseOverlay = () => {
    setOverlayPost('');
    setLinkedinPostUrl(null);
    setLinkedinApiResponse(null);
  };
  const handlePostToLinkedIn = async () => {
    setIsPostingToLinkedIn(true);
    try {
      const res = await fetch('/api/linkedin/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: overlayPost }),
      });
      const data = await res.json();
      setLinkedinApiResponse(data);
      if (res.ok && data.postUrl) {
        setLinkedinPostUrl(data.postUrl);
        // Save the LinkedIn post URL in MongoDB for this topic
        if (selectedNewsIndex !== null) {
          const topic = tldrNews[selectedNewsIndex];
          saveGeneratedPost(topic, overlayPost, data.postUrl);
        }
      } else if (res.ok) {
        setLinkedinPostUrl('');
      } else {
        alert('Failed to post to LinkedIn: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error posting to LinkedIn.');
    } finally {
      setIsPostingToLinkedIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPost('Generating your post, please wait...');

    try {
      const response = await fetch('http://127.0.0.1:8000/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, industry, content_type: contentType }),
      });

      const data = await response.json();
      setPost(data.post || 'Failed to generate post. Please try again.');
    } catch (error) {
      setPost('Error generating post. Please check your connection and try again.');
    }
    setIsLoading(false);
  };

  const fetchProfileAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/profile/analysis');
      const data = await response.json();
      setPost(JSON.stringify(data, null, 2));
    } catch (error) {
      setPost('Error fetching profile analysis.');
    }
    setIsLoading(false);
  };

  const fetchIndustryTrends = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/industry/trends?industry=${industry || 'technology'}`);
      const data = await response.json();
      setPost(JSON.stringify(data, null, 2));
    } catch (error) {
      setPost('Error fetching industry trends.');
    }
    setIsLoading(false);
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/analytics/summary');
      const data = await response.json();
      setPost(JSON.stringify(data, null, 2));
    } catch (error) {
      setPost('Error fetching analytics.');
    }
    setIsLoading(false);
  };

  const handleLinkedInLogin = () => {
    window.location.href = '/api/linkedin';
  };

  const tabs = [
    { id: 'generate', label: 'Generate Content', icon: '✨' },
    { id: 'profile', label: 'Profile Analysis', icon: '👤' },
    { id: 'trends', label: 'Industry Trends', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'calendar', label: 'Content Calendar', icon: '📅' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-black">Sign in with LinkedIn to continue</h2>
          <p className="mb-6 text-black">Please login with your LinkedIn account to access content generation features.</p>
          <button
            onClick={handleLinkedInLogin}
            className="btn-primary w-full"
          >
            Login with LinkedIn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-xl text-gray-900">LinkedIn AI Agent</span>
          </Link>
        </div>
      </nav>


      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Non-Posted Topics Section */}
        <TopicList
          topics={tldrNews}
          isLoading={isNewsLoading}
          selectedNewsIndex={selectedNewsIndex}
          isNewsPostLoading={isNewsPostLoading}
          newsPosts={newsPosts}
          onGenerate={generateNewsPost}
        />
        {/* Used Topics Section */}
        <UsedTopicList topics={usedTopics} />
      </div>
      <PostOverlay
        post={overlayPost}
        onClose={handleCloseOverlay}
        onPostToLinkedIn={handlePostToLinkedIn}
        isLoading={isPostingToLinkedIn}
        linkedinPostUrl={linkedinPostUrl}
        linkedinApiResponse={linkedinApiResponse}
        onRegenerate={regenerateOverlayPost}
        isRegenerating={isRegenerating}
        onSchedulePost={handleSchedulePost}
        isScheduling={isScheduling}
      />
    </div>
  );
}
