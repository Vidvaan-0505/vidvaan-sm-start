'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Module2Page() {
  const [interests, setInterests] = useState<string[]>([]);
  const [personality, setPersonality] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();

  const interestOptions = [
    'Technology and Programming',
    'Healthcare and Medicine',
    'Business and Finance',
    'Education and Teaching',
    'Arts and Design',
    'Science and Research',
    'Marketing and Sales',
    'Engineering',
    'Law and Legal Services',
    'Environmental Science',
    'Psychology and Counseling',
    'Media and Communications'
  ];

  const personalityOptions = [
    'Introverted - I prefer working alone or in small groups',
    'Extroverted - I enjoy working with people and being social',
    'Analytical - I like solving complex problems and analyzing data',
    'Creative - I enjoy coming up with new ideas and being innovative',
    'Organized - I prefer structured environments and planning',
    'Adaptable - I enjoy variety and can work in changing environments'
  ];

  const handleInterestChange = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (interests.length === 0 || !personality) {
      setMessage('Please select at least one interest and your personality type');
      return;
    }

    setIsSubmitting(true);
    setMessage('Survey submitted successfully! Thank you for your responses.');

    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Career Interest Survey</h2>
            <p className="text-gray-600 mb-6">
              This survey will help us understand your interests and personality to provide 
              better career recommendations. Please answer all questions honestly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Interests Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                What are your main interests? (Select all that apply)
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {interestOptions.map((interest) => (
                  <label key={interest} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Personality Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Which personality type best describes you?
              </h3>
              <div className="space-y-3">
                {personalityOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="personality"
                      value={option}
                      checked={personality === option}
                      onChange={(e) => setPersonality(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {message && (
              <div className={`px-4 py-3 rounded-md ${
                message.includes('successfully') 
                  ? 'bg-green-50 border border-green-200 text-green-600'
                  : 'bg-yellow-50 border border-yellow-200 text-yellow-600'
              }`}>
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
                {isSubmitting ? 'Submitting...' : 'Submit Survey'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 