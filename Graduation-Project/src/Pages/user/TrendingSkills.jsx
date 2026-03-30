import { useState, useEffect } from 'react';

const TrendingSkills = ({ user, token }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Note: This endpoint needs to be implemented in backend
    // Based on Chapter 3: "The user should be able to view trending skills relevant to their job title"
    const fetchTrendingSkills = async () => {
      setLoading(true);
      setError('');
      
      try {
        const profileId = localStorage.getItem('profileId');
        if (!profileId) {
          setError('Please complete your profile first');
          setLoading(false);
          return;
        }

        // TODO: Replace with actual API endpoint when backend implements it
        // Expected endpoint: GET /api/{jobseeker_id}/trending-skills?profileId={profileId}
        const API_URL = 'https://localhost:5000';
        const response = await fetch(`${API_URL}/api/${user.jobSeekerId}/trending-skills?profileId=${profileId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trending skills');
        }

        const data = await response.json();
        setSkills(data.skills || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.jobSeekerId && token) {
      fetchTrendingSkills();
    }
  }, [user, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading trending skills...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Trending Skills</h1>
        <p className="text-sm text-gray-600 mt-1">
          Skills currently in demand for your job title
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {skills.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trending data available</h3>
          <p className="text-gray-600">
            Trending skills analysis is being processed. Check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-300 transition">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Trending
                </span>
              </div>
              
              {skill.count && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Appears in {skill.count} job postings
                </div>
              )}
              
              {skill.trend && (
                <div className="text-xs text-gray-500">
                  {skill.trend > 0 ? `+${skill.trend}%` : `${skill.trend}%`} this month
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingSkills;