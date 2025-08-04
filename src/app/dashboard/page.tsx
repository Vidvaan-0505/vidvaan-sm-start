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
    }
  }, [currentUser, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  const modules = [
    {
      id: 1,
      title: 'English Level Assessment',
      description: 'Evaluate your English proficiency through comprehensive testing',
      isFree: true,
      href: '/module/1',
      icon: '📝'
    },
    {
      id: 2,
      title: 'Career Interest Survey',
      description: 'Discover your career interests and personality traits',
      isFree: true,
      href: '/module/2',
      icon: '🎯'
    },
    {
      id: 3,
      title: 'Skill Gap Analysis',
      description: 'Identify skills you need to develop for your dream career',
      isFree: false,
      href: '#',
      icon: '📊'
    },
    {
      id: 4,
      title: 'Resume Builder Pro',
      description: 'Create professional resumes with AI-powered suggestions',
      isFree: false,
      href: '#',
      icon: '📄'
    },
    {
      id: 5,
      title: 'Interview Preparation',
      description: 'Practice interviews with AI and get personalized feedback',
      isFree: false,
      href: '#',
      icon: '🎤'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Dashboard</h2>
          <p className="text-gray-600">Choose a module to get started with your career development journey</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all duration-200 ${
                module.isFree 
                  ? 'border-green-200 hover:border-green-300 hover:shadow-lg cursor-pointer' 
                  : 'border-gray-200 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{module.icon}</span>
                {module.isFree ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    FREE
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    PREMIUM
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>
              
              {module.isFree ? (
                <Link
                  href={module.href}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200"
                >
                  Start Module
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed"
                >
                  Coming Soon
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 