
"use client";
import React from 'react';
import { useScheduledPostsList } from './useScheduledPostsList';
import Link from 'next/link';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// Wrap your code in a React component
const ContentCalendarPage = () => {
  // Use backend in-memory scheduled posts for the list
  const scheduledPosts = useScheduledPostsList();
  // Dummy events for the calendar (not from backend)
  const now = new Date();
  const events = [
    {
      title: 'AI in 2025: Trends and Predictions',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0),
      allDay: false,
    },
    {
      title: 'How to Build a Personal Brand on LinkedIn',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 14, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 15, 0),
      allDay: false,
    },
    {
      title: 'Showcasing Your AI Projects: Tips for Engineers',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 9, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 10, 0),
      allDay: false,
    },
    {
      title: 'Career Growth: Lessons from 5 Years in Tech',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 16, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 17, 0),
      allDay: false,
    },
    {
      title: 'The Power of Networking: Building Meaningful Connections',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 13, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 14, 0),
      allDay: false,
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50 flex-1">
      {/* Navigation/Header (copied from dashboard) */}
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
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 mt-8">
        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-black">Content Calendar</h2>
          <p className="text-black mb-4">View and manage your scheduled LinkedIn posts here.</p>
          <div className="mb-4 w-full flex justify-center text-black">
            <div style={{ minWidth: 700, maxWidth: 1200, width: '100%' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                popup
              />
            </div>
          </div>
        </div>
        {/* Scheduled Posts List */}
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-left">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Scheduled Posts (In-Memory)</h3>
          {scheduledPosts.length === 0 ? (
            <p className="text-gray-500">No scheduled posts.</p>
          ) : (
            <ul className="space-y-4">
              {scheduledPosts.map(post => (
                <li key={post.id} className="border-b pb-2">
                  <div className="font-semibold text-gray-700">{post.content}</div>
                  <div className="text-sm text-gray-500">Scheduled for: {new Date(post.scheduled_time).toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Status: {post.status}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCalendarPage;