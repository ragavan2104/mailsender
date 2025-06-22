import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_ENDPOINTS } from './config/api';

function EmailHistory() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    fetchEmailHistory();
  }, [currentPage]);

  const fetchEmailHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.EMAIL_HISTORY}?page=${currentPage}&limit=10`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (response.ok) {
        setEmails(data.emails);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching email history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailDetails = async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.EMAIL_HISTORY}/${id}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (response.ok) {
        setSelectedEmail(data);
      }
    } catch (error) {
      console.error('Error fetching email details:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (successfulSends, totalRecipients) => {
    const successRate = (successfulSends / totalRecipients) * 100;
    if (successRate >= 90) return 'text-green-600';
    if (successRate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (successfulSends, totalRecipients) => {
    const successRate = (successfulSends / totalRecipients) * 100;
    if (successRate >= 90) return 'bg-green-100 text-green-800';
    if (successRate >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading && emails.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading email history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email History</h1>
          <p className="text-gray-600 mt-1">View and manage your sent email campaigns</p>
        </div>
        <button
          onClick={fetchEmailHistory}
          className="gradient-primary text-white px-4 py-2 rounded-lg transition-smooth btn-hover-lift flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>

      {emails.length === 0 ? (
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Email History</h3>
          <p className="text-gray-600 mb-6">You haven't sent any campaigns yet. Start your first campaign!</p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'compose' }))}
            className="gradient-primary text-white px-6 py-3 rounded-lg font-medium transition-smooth btn-hover-lift"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <>
          {/* Email List */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Recipients</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Success Rate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sent Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email) => (
                    <tr key={email._id} className="border-b border-gray-100 hover:bg-gray-50 transition-smooth">
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">{email.subject}</div>
                        <div className="text-gray-500 text-sm truncate max-w-xs">{email.body}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">{email.totalRecipients}</div>
                        <div className="text-gray-500 text-sm">Total sent</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-semibold ${getStatusColor(email.successfulSends, email.totalRecipients)}`}>
                          {Math.round((email.successfulSends / email.totalRecipients) * 100)}%
                        </div>
                        <div className="text-gray-500 text-sm">
                          {email.successfulSends}/{email.totalRecipients} delivered
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 text-sm">
                          {formatDate(email.sentAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => fetchEmailDetails(email._id)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium transition-smooth"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 disabled:text-gray-400 px-4 py-2 rounded-lg border border-gray-300 transition-smooth font-medium"
              >
                ← Previous
              </button>
              
              <span className="text-gray-700 font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 disabled:text-gray-400 px-4 py-2 rounded-lg border border-gray-300 transition-smooth font-medium"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Email Details Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-elegant max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Email Campaign Details</h3>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-smooth"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <div className="text-gray-900 font-semibold">{selectedEmail.subject}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sent Date</label>
                    <div className="text-gray-900">{formatDate(selectedEmail.sentAt)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sent By</label>
                    <div className="text-gray-900">{selectedEmail.sentBy}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedEmail.totalRecipients}</div>
                    <div className="text-blue-700 text-sm font-medium">Total</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedEmail.successfulSends}</div>
                    <div className="text-green-700 text-sm font-medium">Success</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200 text-center">
                    <div className="text-2xl font-bold text-red-600">{selectedEmail.failedSends}</div>
                    <div className="text-red-700 text-sm font-medium">Failed</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Body</label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-gray-900 whitespace-pre-wrap">{selectedEmail.body}</div>
                </div>
              </div>

              {/* Recipients List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients ({selectedEmail.recipients.length})
                </label>
                <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                  {selectedEmail.recipients.map((recipient, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-900">{recipient.email}</span>
                      <span className={`px-2 py-1 rounded-lg text-sm font-medium ${
                        recipient.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {recipient.status === 'success' ? 'Delivered' : 'Failed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailHistory;
