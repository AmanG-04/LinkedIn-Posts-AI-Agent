"use client";

import Link from "next/link";
import AnalyticsTable from "./AnalyticsTable";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header/Nav at the very top */}
      <nav className="w-full px-6 py-4 bg-white/80 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="font-semibold text-2xl text-gray-600">LinkedIn AI Agent</span>
          </div>
          <div className="flex items-center space-x-4 text-lg">
            <Link href="/" className="btn-accent px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition font-semibold">&#8592; Back</Link>
          </div>
        </div>
      </nav>
      {/* Centered analytics card below header */}
      <main className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-80px)] py-8 px-2">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 md:p-16 flex flex-col items-center mx-auto mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight text-center">Performance Analytics</h1>
          <p className="text-lg md:text-xl mb-10 text-gray-600 text-center max-w-2xl">
            Track your LinkedIn post engagement, audience demographics, and optimize your strategy with AI-powered analytics.
          </p>
          <div className="w-full">
            <AnalyticsTable />
          </div>
        </div>
      </main>
    </div>
  );
}
