'use client';


import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [timer, setTimer] = useState(40);
  const [backendStatus, setBackendStatus] = useState<'starting' | 'running'>('starting');

  useEffect(() => {
    // Backend wake-up timer
    if (timer > 0 && backendStatus === 'starting') {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setBackendStatus('running');
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, backendStatus]);

  useEffect(() => {
    // Check authentication status from backend
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/linkedin/userinfo');
        const data = await res.json();
        setIsLoggedIn(!!data.authenticated);
        setUserName(data.name || null);
      } catch {
        setIsLoggedIn(false);
        setUserName(null);
      }
    };
    checkAuth();
  }, []);

  // Prevent auto-login: do not redirect to LinkedIn login automatically when not authenticated
  // Only show the login button and wait for user action

  const handleLinkedInLogin = () => {
    window.location.href = '/api/linkedin';
  };

  const features = [
    {
      title: "Profile Analysis",
      description: "AI-powered analysis of your LinkedIn profile to optimize content strategy",
      icon: "👤",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Content Generation",
      description: "Generate engaging LinkedIn posts tailored to your industry and expertise",
      icon: "✨",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Industry Research",
      description: "Stay updated with the latest trends and insights in your industry",
      icon: "📊",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Performance Analytics",
      description: "Track engagement metrics and optimize your posting strategy",
      icon: "📈",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Content Calendar",
      description: "Plan and schedule your content with AI-powered recommendations",
      icon: "📅",
      color: "from-indigo-500 to-blue-500"
    },
    {
      title: "Post Optimization",
      description: "AI analysis to maximize engagement and reach of your posts",
      icon: "🎯",
      color: "from-teal-500 to-cyan-500"
    }
  ];


  return (
    <div className="flex-1">
      {/* Backend Powering Up Timer */}
      {backendStatus === 'starting' ? (
        <div className="w-full text-center py-2 bg-yellow-50 text-yellow-700 font-semibold">
          Backend is powering up, please wait... ({timer}s)
        </div>
      ) : (
        <div className="w-full text-center py-2 bg-green-50 text-green-700 font-semibold">
          Backend is running!
        </div>
      )}
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="font-semibold text-3xl text-gray-600">LinkedIn AI Agent</span>
          </div>
          <div className="flex items-center space-x-4 text-lg">
            {!isLoggedIn ? (
              <button
                className="btn-primary"
                onClick={handleLinkedInLogin}
              >
                Login to LinkedIn
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-green-700 font-semibold">✅ {userName ? `Logged in as ${userName}` : 'Logged in with LinkedIn'}</span>
                <button
                  className="btn-secondary border border-green-700 text-green-700 px-3 py-1 rounded hover:bg-green-50 transition"
                  onClick={async () => {
                    await fetch('/api/linkedin/logout', { method: 'POST', credentials: 'include' });
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Supercharge Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              LinkedIn Presence
            </span>{' '}
            with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create engaging content, analyze performance, and grow your professional network 
            with our AI-powered LinkedIn content management platform.
          </p>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-10 text-gray-700">What would you like to do?</h2>
              <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
                <Link
                  href="/generate-personalized-post"
                  className="flex-1 max-w-xs min-w-[220px] h-24 px-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-semibold rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                >
                  Generate Personalized Post
                </Link>
                <Link
                  href="/optimize-post"
                  className="flex-1 max-w-xs min-w-[220px] h-24 px-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-semibold rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                >
                  Optimize Post
                </Link>
                <Link
                  href="/generate-news-post"
                  className="flex-1 max-w-xs min-w-[220px] h-24 px-3 2020 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-semibold rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                >
                  Generate News Post
                </Link>
                <Link
                  href="/content-calendar"
                  className="flex-1 max-w-xs min-w-[220px] h-24 px-3 2020 bg-gradient-to-r from-red-300 to-pink-500 text-white text-xl font-semibold rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                >
                  Content Calendar
                </Link>
                <Link
                  href="/analytics"
                  className="flex-1 max-w-xs min-w-[220px] h-24 px-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-xl font-semibold rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                >
                  Analytics
                </Link>
              </div>
            </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="px-6 py-20 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to succeed on LinkedIn
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools powered by AI to enhance your LinkedIn strategy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                <div key={index} className="card p-6 group hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mr-3`}>
                  <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Posts Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Engagement Increase</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to transform your LinkedIn strategy?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who are already using AI to enhance their LinkedIn presence.
          </p>
          <Link href="/dashboard" className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-200 shadow-lg">
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="font-semibold text-white">LinkedIn AI Agent</span>
          </div>
          <p className="text-gray-400">
            © 2025 LinkedIn AI Agent. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
