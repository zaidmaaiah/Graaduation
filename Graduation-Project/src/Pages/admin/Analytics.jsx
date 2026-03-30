import { useState, useEffect } from 'react';
import { getAnalytics } from '../../api/admin';

const Analytics = ({ token }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      
      try {
        const data = await getAnalytics(token);
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-600 mt-1">Platform insights and trends</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {!analytics ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-sm text-blue-800">
            No analytics data available. Connect the backend API endpoint: 
            <code className="bg-blue-100 px-2 py-1 rounded ml-1">GET /api/admin/analytics</code>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="text-lg font-bold text-gray-900">{analytics.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users (30d)</span>
                <span className="text-lg font-bold text-gray-900">{analytics.activeUsers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Users (7d)</span>
                <span className="text-lg font-bold text-gray-900">{analytics.newUsers || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Jobs</span>
                <span className="text-lg font-bold text-gray-900">{analytics.totalJobs || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Matches (30d)</span>
                <span className="text-lg font-bold text-gray-900">{analytics.totalMatches || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Saved Jobs</span>
                <span className="text-lg font-bold text-gray-900">{analytics.savedJobs || 0}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Skills</h3>
            {analytics.trendingSkills && analytics.trendingSkills.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.trendingSkills.map((skill, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-gray-900 mb-1">{skill.name}</p>
                    <p className="text-xs text-gray-600">{skill.count} mentions</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No trending skills data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;