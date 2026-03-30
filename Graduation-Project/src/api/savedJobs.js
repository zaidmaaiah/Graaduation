const API_URL = 'https://localhost:5000';

// Endpoint: POST api/{jobseeker_id}/jobs/{job_id}/save
export const saveJob = async (token, jobSeekerId, jobId) => {
  const response = await fetch(`${API_URL}/api/${jobSeekerId}/jobs/${jobId}/save`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to save job');
  }
  
  return response.json();
};

// Endpoint: DELETE api/{jobseeker_id}/jobs/{job_id}/unsave
export const unsaveJob = async (token, jobSeekerId, jobId) => {
  const response = await fetch(`${API_URL}/api/${jobSeekerId}/jobs/${jobId}/unsave`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to unsave job');
  }
  
  return response.json();
};

// Endpoint: GET api/{jobseeker_id}/saved-jobs
export const getSavedJobs = async (token, jobSeekerId) => {
  const response = await fetch(`${API_URL}/api/${jobSeekerId}/saved-jobs`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch saved jobs');
  }
  
  return response.json();
};