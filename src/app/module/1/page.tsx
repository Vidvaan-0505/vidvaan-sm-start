'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Module1Page() {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text to evaluate');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/evaluate-english-levels-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          userId: currentUser?.uid,
          userEmail: currentUser?.email,
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();

             if (response.ok) {
         setMessage(`Your text has been successfully analyzed! Your English level: ${data.englishLevel}`);
         setText('');
       } else {
         setError(data.error || 'Failed to submit text. Please try again.');
       }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500">
                ← Back to Dashboard
              </Link>
              <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200">
                Vidvaan
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {currentUser?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Module Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">English Level Assessment</h2>
            <p className="text-gray-600 mb-6">
              Please write a paragraph about yourself, your interests, or any topic you'd like to discuss. 
              This will help us evaluate your English proficiency level and provide personalized recommendations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                Your Text (Minimum 50 words recommended)
              </label>
              <textarea
                id="text"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Write your paragraph here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Word count: {text.split(/\s+/).filter(word => word.length > 0).length}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                {message}
              </div>
            )}

            <div className="flex justify-between items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit for Evaluation'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 