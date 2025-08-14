
"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function OptimizePostPage() {
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/optimize-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: postContent }),
      });
      const data = await res.json();
      if (res.ok && data.optimization_analysis) {
        setResult(data.optimization_analysis);
      } else {
        setError(data.detail || 'Failed to optimize post.');
      }
    } catch (err) {
      setError('Error connecting to backend.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center text-black">
        <h2 className="text-2xl font-bold mb-4 text-black">Optimize Post</h2>
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 text-left">
          <div>
            <label className="block font-semibold mb-1 text-black">Your LinkedIn Post</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-black placeholder-black"
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              required
              placeholder="Paste your LinkedIn post here..."
              rows={6}
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Optimizing...' : 'Optimize Post'}
          </button>
        </form>
        {result && (
          <div className="bg-gray-100 rounded p-4 mb-4 text-left">
            <h3 className="font-bold mb-2">Optimization Result:</h3>
            <pre className="whitespace-pre-wrap text-sm text-black">{result}</pre>
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
