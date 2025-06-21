import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_ENDPOINTS } from './config/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalEmailsSent: 0,
    totalEmailsFailed: 0,
    recentCampaigns: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.DASHBOARD_STATS, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 mb-4">
          📊 Dashboard
        </h1>
        <p className="text-xl text-gray-300">
          Monitor your email campaign performance and analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Campaigns */}
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-lg rounded-3xl border border-blue-500/30 p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">🚀</div>
            <div className="text-right">
              <div className="text-3xl font-black text-blue-400">{stats.totalCampaigns}</div>
              <div className="text-sm text-blue-300 font-medium">Total Campaigns</div>
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            All email campaigns sent
          </div>
        </div>

        {/* Total Emails Sent */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-3xl border border-green-500/30 p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">📧</div>
            <div className="text-right">
              <div className="text-3xl font-black text-green-400">{stats.totalEmailsSent.toLocaleString()}</div>
              <div className="text-sm text-green-300 font-medium">Emails Sent</div>
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            Successfully delivered emails
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl border border-purple-500/30 p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">🎯</div>
            <div className="text-right">
              <div className="text-3xl font-black text-purple-400">{stats.successRate}%</div>
              <div className="text-sm text-purple-300 font-medium">Success Rate</div>
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            Overall delivery success
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl border border-yellow-500/30 p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">⚡</div>
            <div className="text-right">
              <div className="text-3xl font-black text-yellow-400">{stats.recentCampaigns}</div>
              <div className="text-sm text-yellow-300 font-medium">This Week</div>
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            Campaigns sent in last 7 days
          </div>
        </div>
      </div>

      {/* Performance Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Success Rate Visualization */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
            </svg>
            Delivery Performance
          </h3>
          
          <div className="space-y-4">
            {/* Success Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-green-300">Successful Deliveries</span>
                <span className="text-green-300">{stats.totalEmailsSent}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.successRate}%` }}
                ></div>
              </div>
            </div>

            {/* Failed Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-red-300">Failed Deliveries</span>
                <span className="text-red-300">{stats.totalEmailsFailed}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${100 - stats.successRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {(stats.totalEmailsSent + stats.totalEmailsFailed).toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Total Emails Processed</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Quick Actions
          </h3>
          
          <div className="space-y-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'compose' }))}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create New Campaign
            </button>
            
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'history' }))}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              View Email History
            </button>
            
            <button
              onClick={fetchDashboardStats}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl border border-indigo-500/30 p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          💡 Pro Tips for Better Email Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-lg font-semibold text-white mb-2">📝 Subject Lines</div>
            <p className="text-gray-400 text-sm">Keep subject lines under 50 characters for better open rates</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-lg font-semibold text-white mb-2">🎯 Personalization</div>
            <p className="text-gray-400 text-sm">Use recipient names and relevant content to improve engagement</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-lg font-semibold text-white mb-2">⏰ Timing</div>
            <p className="text-gray-400 text-sm">Send emails during business hours for higher open rates</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
