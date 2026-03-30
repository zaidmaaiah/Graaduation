import { useState, useEffect } from 'react';
import { getSavedJobs } from '../../api/savedJobs';
import JobCard from '../../components/JobCard';

const SavedJobs = ({ user, token }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user?.jobSeekerId) {
        setError('Please log in to view saved jobs');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        const data = await getSavedJobs(token, user.jobSeekerId);
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [token, user]);

  const handleJobUnsaved = (jobId) => {
    setJobs(jobs.filter(job => job.jobId !== jobId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading saved jobs...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-sm text-gray-600 mt-1">
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} saved
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
          <p className="text-gray-600">
            Save jobs from the Jobs page to review them later
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard 
              key={job.jobId} 
              job={job} 
              isSaved={true}
              onUnsave={() => handleJobUnsaved(job.jobId)}
              token={token}
              jobSeekerId={user.jobSeekerId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;