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
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Monitor your email campaign performance and analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Campaigns */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6 btn-hover-lift transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
              </svg>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</div>
              <div className="text-sm text-gray-600 font-medium">Total Campaigns</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            All email campaigns sent
          </div>
        </div>

        {/* Total Emails Sent */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6 btn-hover-lift transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.totalEmailsSent.toLocaleString()}</div>
              <div className="text-sm text-gray-600 font-medium">Emails Sent</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Successfully delivered emails
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6 btn-hover-lift transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.successRate}%</div>
              <div className="text-sm text-gray-600 font-medium">Success Rate</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Overall delivery success
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6 btn-hover-lift transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.recentCampaigns}</div>
              <div className="text-sm text-gray-600 font-medium">This Week</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm">
            Campaigns sent in last 7 days
          </div>
        </div>
      </div>

      {/* Performance Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Success Rate Visualization */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
            </svg>
            Delivery Performance
          </h3>
          
          <div className="space-y-4">
            {/* Success Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 font-medium">Successful Deliveries</span>
                <span className="text-green-600 font-semibold">{stats.totalEmailsSent}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.successRate}%` }}
                ></div>
              </div>
            </div>

            {/* Failed Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 font-medium">Failed Deliveries</span>
                <span className="text-red-600 font-semibold">{stats.totalEmailsFailed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${100 - stats.successRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-1">
                {(stats.totalEmailsSent + stats.totalEmailsFailed).toLocaleString()}
              </div>
              <div className="text-gray-600 text-sm">Total Emails Processed</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Quick Actions
          </h3>
          
          <div className="space-y-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'compose' }))}
              className="w-full gradient-primary text-white py-3 px-4 rounded-lg font-medium transition-smooth btn-hover-lift flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create New Campaign
            </button>
            
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'history' }))}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-smooth btn-hover-lift flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              View Email History
            </button>
            
            <button
              onClick={fetchDashboardStats}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-smooth btn-hover-lift flex items-center justify-center"
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
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          Pro Tips for Better Email Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-base font-semibold text-gray-900 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Subject Lines
            </div>
            <p className="text-gray-600 text-sm">Keep subject lines under 50 characters for better open rates</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-base font-semibold text-gray-900 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Personalization
            </div>
            <p className="text-gray-600 text-sm">Use recipient names and relevant content to improve engagement</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="text-base font-semibold text-gray-900 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Timing
            </div>
            <p className="text-gray-600 text-sm">Send emails during business hours for higher open rates</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
