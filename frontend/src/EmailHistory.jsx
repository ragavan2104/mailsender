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
    if (successRate >= 90) return 'text-green-400';
    if (successRate >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading && emails.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">📧 Email History</h2>
        <button
          onClick={fetchEmailHistory}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          🔄 Refresh
        </button>
      </div>

      {emails.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Email History</h3>
          <p className="text-gray-400">You haven't sent any campaigns yet. Start your first campaign!</p>
        </div>
      ) : (
        <>
          {/* Email List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600/50 to-pink-600/50">
                    <th className="px-6 py-4 text-left text-white font-semibold">Subject</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Recipients</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Success Rate</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Sent Date</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email) => (
                    <tr key={email._id} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{email.subject}</div>
                        <div className="text-gray-400 text-sm truncate max-w-xs">{email.body}</div>
                      </td>
                      <td className="px-6 py-4 text-white">{email.totalRecipients}</td>
                      <td className="px-6 py-4">
                        <div className={`font-semibold ${getStatusColor(email.successfulSends, email.totalRecipients)}`}>
                          {Math.round((email.successfulSends / email.totalRecipients) * 100)}%
                        </div>
                        <div className="text-gray-400 text-sm">
                          {email.successfulSends}/{email.totalRecipients}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {formatDate(email.sentAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => fetchEmailDetails(email._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                        >
                          👁️ Details
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
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                ← Previous
              </button>
              
              <span className="text-white">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Email Details Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-white">📧 Email Campaign Details</h3>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-white/70 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm">Subject</label>
                    <div className="text-white font-semibold">{selectedEmail.subject}</div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm">Sent Date</label>
                    <div className="text-white">{formatDate(selectedEmail.sentAt)}</div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm">Sent By</label>
                    <div className="text-white">{selectedEmail.sentBy}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-400">{selectedEmail.totalRecipients}</div>
                    <div className="text-blue-300 text-sm">Total</div>
                  </div>
                  <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">{selectedEmail.successfulSends}</div>
                    <div className="text-green-300 text-sm">Success</div>
                  </div>
                  <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400">{selectedEmail.failedSends}</div>
                    <div className="text-red-300 text-sm">Failed</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Email Body</label>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-white whitespace-pre-wrap">{selectedEmail.body}</div>
                </div>
              </div>

              {/* Recipients List */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Recipients ({selectedEmail.recipients.length})</label>
                <div className="bg-white/5 rounded-xl border border-white/10 max-h-64 overflow-y-auto">
                  {selectedEmail.recipients.map((recipient, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border-b border-white/5 last:border-b-0">
                      <span className="text-white">{recipient.email}</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        recipient.status === 'success' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {recipient.status === 'success' ? '✅ Sent' : '❌ Failed'}
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
