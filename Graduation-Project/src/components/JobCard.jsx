import { useState } from 'react';
import { saveJob, unsaveJob } from '../api/savedJobs';

const JobCard = ({ job, isSaved = false, onUnsave, token, jobSeekerId }) => {
  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async () => {
    if (!token || !jobSeekerId) return;
    
    setSaving(true);
    try {
      if (saved) {
        await unsaveJob(token, jobSeekerId, job.jobId);
        setSaved(false);
        if (onUnsave) onUnsave(job.jobId);
      } else {
        await saveJob(token, jobSeekerId, job.jobId);
        setSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-gray-600 text-sm">{job.company}</p>
        </div>
        <div className="flex items-start gap-3 ml-4">
          {job.matchPercentage && (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{Math.round(job.matchPercentage)}%</div>
              <div className="text-xs text-gray-500">Match</div>
            </div>
          )}
          {token && jobSeekerId && (
            <button
              onClick={handleSaveToggle}
              disabled={saving}
              className={`p-2 rounded-lg transition ${
                saved 
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title={saved ? 'Unsave job' : 'Save job'}
            >
              <svg className="w-6 h-6" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {job.description && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.description}</p>
      )}

      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
        {job.location && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </div>
        )}
        {job.employmentType && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {job.employmentType}
          </div>
        )}
        {job.experienceLevel && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.experienceLevel}
          </div>
        )}
      </div>

      {job.technicalSkills && job.technicalSkills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {job.technicalSkills.slice(0, 6).map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
            {job.technicalSkills.length > 6 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{job.technicalSkills.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        {job.externalUrl && (
          <a
            href={job.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg text-center transition"
          >
            Apply Now
          </a>
        )}
        {job.postedDate && (
          <span className="text-xs text-gray-500">
            Posted {new Date(job.postedDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobCard;