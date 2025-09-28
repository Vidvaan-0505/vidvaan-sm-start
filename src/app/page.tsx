'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';


// Lazy load the FeaturesSection component
const FeaturesSection = dynamic(() => import('@/components/FeaturesSection'), {
  loading: () => (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-16"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: false
});

export default function HomePage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Vidvaan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Vidvaan</h1>
            </div>
            <div className="flex items-center space-x-8">
              <Link 
                href="/"
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <Link 
                href="#about"
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium"
              >
                About Us
              </Link>
              <Link 
                href="#testimonials"
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium"
              >
                Testimonials
              </Link>
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/dashboard"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await logout();
                        router.push('/');
                      } catch (error) {
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Your Perfect Career Path
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get personalized career guidance, skill assessments, and expert advice to help you make informed decisions about your professional future.
          </p>
          <div className="flex justify-center space-x-4">
            {currentUser ? (
              <Link 
                href="/dashboard"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/signup"
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
                >
                  Get Started
                </Link>
                <Link 
                  href="/login"
                  className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Vidvaan</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are dedicated to helping individuals discover their true potential and find the perfect career path that aligns with their skills, interests, and aspirations.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Our comprehensive assessments and expert advice help you make informed career decisions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Learning</h3>
              <p className="text-gray-600">Tailored recommendations based on your unique skills, interests, and personality traits.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Results</h3>
              <p className="text-gray-600">Thousands of users have successfully found their dream careers through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from individuals who have transformed their careers with Vidvaan&apos;s guidance.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-semibold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Software Developer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                &ldquo;Vidvaan helped me discover my passion for coding. The English assessment was eye-opening and the career guidance was spot-on!&rdquo;
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-semibold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                  <p className="text-sm text-gray-600">Marketing Manager</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                &ldquo;The career interest survey revealed aspects of my personality I never considered. Now I&apos;m in a role that truly fits me!&rdquo;
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-semibold">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Aisha Patel</h4>
                  <p className="text-sm text-gray-600">Data Analyst</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                &ldquo;From career confusion to clarity! Vidvaan&apos;s assessments gave me the confidence to pursue data science.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Lazy Loaded */}
      <FeaturesSection />
    </div>
  );
}
