'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createRequest, fetchRequests, fetchRequestById } from '@/services/api';

export default function Module1Page() {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  const [previousAnalyses, setPreviousAnalyses] = useState<
    { requestId: string; textPreview: string; date: string }[]
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const { currentUser } = useAuth();

  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
  const isOverLimit = wordCount > 500;

  // Submit text
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!text.trim()) {
      setError('Please enter some text to evaluate.');
      return;
    }
    if (isOverLimit) {
      setError('Text must be 500 words or less.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createRequest('ENG_WRITE_PARA', { text }, currentUser!);
      setMessage('✅ Your request was submitted successfully!');
      setText('');
      if (activeTab === 'history') fetchPreviousAnalyses();
    } catch (err: any) {
      setError(err.message || 'Failed to submit text.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch previous analyses
  const fetchPreviousAnalyses = async () => {
    setIsLoadingHistory(true);
    setError('');
    try {
      const data = await fetchRequests(currentUser!);
      const analyses = data.map((req: any) => ({
        requestId: req.request_id,
        textPreview: req.input_data?.text
          ? req.input_data.text.substring(0, 60) + '...'
          : '',
        date: req.created_at,
      }));
      setPreviousAnalyses(analyses);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch previous analyses.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Fetch single analysis and show alert
  const viewAnalysis = async (requestId: string) => {
    setError('');
    try {
      const data = await fetchRequestById(requestId, currentUser!);
      const analysis = data.data.analysis;

      if (!analysis) {
        alert('No Data available currently in the backend.');
        return;
      }

      const analysisText = `
Analysis for Request ID: ${data.data.requestId}

Assessed Level: ${analysis.assessed_level ?? 'No Data available currently in the backend'}
Word Count: ${analysis.word_count ?? 'No Data available currently in the backend'}
Grammar Score: ${analysis.grammar_score ?? 'No Data available currently in the backend'}

${analysis.analysis_pdf_url ? `PDF Report: ${analysis.analysis_pdf_url}` : ''}
      `;
      alert(analysisText);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analysis.');
    }
  };

  const handleTabChange = (tab: 'submit' | 'history') => {
    setActiveTab(tab);
    if (tab === 'history' && previousAnalyses.length === 0) {
      fetchPreviousAnalyses();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500">
                Back to Dashboard
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => handleTabChange('submit')}
                className={`px-6 py-4 text-lg font-medium border-b-2 ${
                  activeTab === 'submit'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Submit Text
              </button>
              <button
                onClick={() => handleTabChange('history')}
                className={`px-6 py-4 text-lg font-medium border-b-2 ${
                  activeTab === 'history'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Previous Analyses
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-8">
            {activeTab === 'submit' ? (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">English Assessment</h2>
                <p className="text-gray-600 mb-6">Submit text up to 500 words for evaluation.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Text (Maximum 500 words)
                    </label>
                    <textarea
                      id="text"
                      rows={10}
                      maxLength={500}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-none ${
                        isOverLimit ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Write your text here..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                    />
                    <div className="mt-2 flex justify-between">
                      <p className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
                        Word count: {wordCount}/500
                      </p>
                      {isOverLimit && <p className="text-sm text-red-600">Reduce by {wordCount - 500} words</p>}
                    </div>
                  </div>

                  {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{error}</div>}
                  {message && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">{message}</div>}

                  <div className="flex justify-between items-center">
                    <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting || isOverLimit}
                      className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit for Evaluation'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Previous Analyses</h2>
                <p className="text-gray-600 mb-6">View your submission history and analysis reports.</p>

                {isLoadingHistory ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading previous analyses...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Request ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Text Preview
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previousAnalyses.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                              No previous analyses found. Submit your first text assessment!
                            </td>
                          </tr>
                        ) : (
                          previousAnalyses.map((analysis) => (
                            <tr key={analysis.requestId}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {analysis.requestId.substring(0, 8)}...
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{analysis.textPreview}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(analysis.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => viewAnalysis(analysis.requestId)}
                                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                                >
                                  View Analysis
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
