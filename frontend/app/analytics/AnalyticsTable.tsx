
"use client";
import { useEffect, useState } from "react";

interface PostAnalytics {
  id: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  engagement_rate: number;
}


export default function AnalyticsTable() {
  const [analytics, setAnalytics] = useState<PostAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json();
      })
      .then((data) => {
        setAnalytics(data?.recent_posts || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
  <div className="w-full">
      {loading ? (
        <div className="text-gray-400 text-center py-8">Loading analytics...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : analytics.length === 0 ? (
        <div className="text-gray-400 text-center py-8">No analytics data available.</div>
      ) : (
        <table className="w-full text-left border-separate border-spacing-y-1">
          <thead>
            <tr className="bg-blue-50">
              <th className="py-3 px-4 text-gray-900 font-semibold rounded-l-xl">Date</th>
              <th className="py-3 px-4 text-gray-900 font-semibold">Content</th>
              <th className="py-3 px-4 text-gray-900 font-semibold">Likes</th>
              <th className="py-3 px-4 text-gray-900 font-semibold">Comments</th>
              <th className="py-3 px-4 text-gray-900 font-semibold">Shares</th>
              <th className="py-3 px-4 text-gray-900 font-semibold">Impressions</th>
              <th className="py-3 px-4 text-gray-900 font-semibold rounded-r-xl">Engagement Rate</th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((post, idx) => (
              <tr
                key={post.id}
                className={
                  (idx % 2 === 0 ? "bg-white" : "bg-gray-50") +
                  " hover:bg-blue-50 transition rounded-xl"
                }
              >
                <td className="py-2 px-4 whitespace-nowrap text-gray-800 font-medium rounded-l-xl">{post.date}</td>
                <td className="py-2 px-4 text-gray-700 max-w-md break-words" title={post.content}>{post.content}</td>
                <td className="py-2 px-4 text-blue-700 font-semibold">{post.likes}</td>
                <td className="py-2 px-4 text-blue-700 font-semibold">{post.comments}</td>
                <td className="py-2 px-4 text-blue-700 font-semibold">{post.shares}</td>
                <td className="py-2 px-4 text-blue-700 font-semibold">{post.impressions}</td>
                <td className="py-2 px-4 text-blue-700 font-semibold rounded-r-xl">{post.engagement_rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
