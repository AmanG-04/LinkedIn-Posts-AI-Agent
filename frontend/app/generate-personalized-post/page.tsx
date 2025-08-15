"use client";

import React, { useState } from 'react';
import Link from 'next/link';


export default function GeneratePersonalizedPostPage() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postStatus, setPostStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    setPostStatus(null);
    try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:8000'}/generate-personalized-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, content_type: contentType }),
      });
      const data = await res.json();
      if (res.ok && data.post) {
        setResult(data.post);
      } else {
        setError(data.detail || 'Failed to generate post.');
      }
    } catch (err) {
      setError('Error connecting to backend.');
    }
    setLoading(false);
  };

  const handlePostToLinkedIn = async () => {
    if (!result) return;
    setIsPosting(true);
    setPostStatus(null);
    try {
      const res = await fetch('/api/linkedin/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result }),
      });
      const data = await res.json();
      // Print the full response to the console for debugging
      //console.log('LinkedIn post API response:', data);
      if (res.ok && (data.postUrl || data.success)) {
        let msg = 'Successfully posted to LinkedIn!';
        if (data.postUrl) msg += ` View: ${data.postUrl}`;
        setPostStatus(msg + '\nRaw response: ' + JSON.stringify(data, null, 2));
      } else {
        setPostStatus('Failed to post to LinkedIn: ' + (data.error || 'Unknown error') + '\nRaw response: ' + JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setPostStatus('Error posting to LinkedIn.');
    }
    setIsPosting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center text-black">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Generate Personalized Post</h2>
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 text-left">
          <div>
            <label className="block font-semibold mb-1 text-gray-600">Topic</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-black placeholder-gray-400"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              required
              placeholder="e.g. AI in Healthcare"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-600">Content Type</label>
            <select
              className="w-full border rounded px-3 py-2 text-gray-500"
              value={contentType}
              onChange={e => setContentType(e.target.value)}
            >
              <option className="text-gray-600" value="professional">Professional</option>
              <option className="text-gray-600" value="thought_leadership">Thought Leadership</option>
              <option className="text-gray-600" value="educational">Educational</option>
              <option className="text-gray-600" value="personal_story">Personal Story</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Post'}
          </button>
        </form>
        {result && (
          <div className="bg-gray-100 rounded p-4 mb-4 text-left">
            <h3 className="font-bold mb-2">Generated Post:</h3>
            <pre className="whitespace-pre-wrap text-sm text-black">{result}</pre>
            <div className="flex flex-col md:flex-row gap-2 mt-4">
              <button
                className="btn-primary w-full md:w-auto"
                onClick={handlePostToLinkedIn}
                disabled={isPosting}
              >
                {isPosting ? 'Posting...' : 'Post to LinkedIn'}
              </button>
              <button
                className="btn-secondary w-full md:w-auto"
                onClick={async () => {
                  setLoading(true);
                  setResult(null);
                  setError(null);
                  setPostStatus(null);
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:8000'}/generate-personalized-content`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ topic, content_type: contentType }),
                    });
                    const data = await res.json();
                    if (res.ok && data.post) {
                      setResult(data.post);
                    } else {
                      setError(data.detail || 'Failed to generate post.');
                    }
                  } catch (err) {
                    setError('Error connecting to backend.');
                  }
                  setLoading(false);
                }}
              >
                Regenerate Post
              </button>
            </div>
            {postStatus && (
              <div className={postStatus.startsWith('Successfully') ? 'text-green-600 mt-2' : 'text-red-600 mt-2'}>
                {postStatus}
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="text-red-600 mb-4">{error}</div>
        )}
        <Link href="/" className="btn-secondary">Back to Home</Link>
      </div>
    </div>
  );
}
