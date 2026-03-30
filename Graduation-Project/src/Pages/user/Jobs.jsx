import { useState, useEffect } from 'react';
import { getRecommendedJobs } from '../../api/jobs';
import JobCard from '../../components/JobCard';

const Jobs = ({ user, token }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    if (!user?.jobSeekerId) {
      setError('Please log in to view jobs');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const profileId = localStorage.getItem('profileId');
      if (!profileId) {
        setError('Please complete your profile first');
        setJobs([]);
        return;
      }
      
      const data = await getRecommendedJobs(token, user.jobSeekerId, profileId);
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token, user]);

  const handleReRunMatching = () => {
    fetchJobs();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recommended Jobs</h1>
          <p className="text-sm text-gray-600 mt-1">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} matched to your profile
          </p>
        </div>
        <button
          onClick={handleReRunMatching}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Jobs'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {loading && jobs.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Loading jobs...</div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">
            {error ? error : 'Complete your profile to start receiving job recommendations'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <JobCard 
              key={job.jobId || index} 
              job={job} 
              token={token}
              jobSeekerId={user.jobSeekerId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;