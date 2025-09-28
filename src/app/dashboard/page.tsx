'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';


export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else {
    }
  }, [currentUser, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200">
                Vidvaan
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <span className="text-gray-700">Welcome, {currentUser.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">English Assessment Dashboard</h2>
          <p className="text-gray-600">Improve your English skills with our comprehensive assessment tool</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border-2 border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <span className="text-4xl"></span>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              FREE
            </span>
          </div>
          
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">English Assessment</h3>
          <p className="text-gray-600 mb-6">
            Submit text up to 500 words for evaluation. View your analysis history and download results.
          </p>
          
          <Link
            href="/module/1"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white text-lg font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Start Assessment
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
