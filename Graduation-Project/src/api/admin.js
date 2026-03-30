const API_URL = 'https://localhost:5000';

// Endpoint: POST api/admin/login
export const adminLogin = async (email, password) => {
  const response = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Admin login failed');
  }
  
  return response.json();
};

// Endpoint: GET api/admin/job-sources
export const getJobSources = async (token) => {
  const response = await fetch(`${API_URL}/api/admin/job-sources`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch job sources');
  }
  
  return response.json();
};

// Endpoint: PUT api/admin/job-sources/{source_id}/toggle
export const toggleJobSource = async (token, sourceId, enabled) => {
  const response = await fetch(`${API_URL}/api/admin/job-sources/${sourceId}/toggle`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ enabled })
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to toggle job source');
  }
  
  return response.json();
};

// Endpoint: GET api/admin/logs
export const getSystemLogs = async (token, page = 1, limit = 50) => {
  const response = await fetch(`${API_URL}/api/admin/logs?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch logs');
  }
  
  return response.json();
};

// Endpoint: GET api/admin/analytics
export const getAnalytics = async (token) => {
  const response = await fetch(`${API_URL}/api/admin/analytics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch analytics');
  }
  
  return response.json();
};

// Endpoint: GET api/admin/settings
export const getSystemSettings = async (token) => {
  const response = await fetch(`${API_URL}/api/admin/settings`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch settings');
  }
  
  return response.json();
};

// Endpoint: PUT api/admin/settings
export const updateSystemSettings = async (token, settings) => {
  const response = await fetch(`${API_URL}/api/admin/settings`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to update settings');
  }
  
  return response.json();
};