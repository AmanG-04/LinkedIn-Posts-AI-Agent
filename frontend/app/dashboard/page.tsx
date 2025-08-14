
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="mb-6 text-gray-600">This page is under construction. Please use the main options on the home page.</p>
        <Link href="/" className="btn-secondary">Back to Home</Link>
      </div>
    </div>
  );
}
