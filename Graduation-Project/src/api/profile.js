import snakecaseKeys from "snakecase-keys";

const API_URL = 'https://localhost:5000';

// Endpoint: POST api/profile/{jobseeker_id}/save OR PUT api/profile/{profile_id}/update
export const updateProfile = async (formData, token, jobSeekerId, profileId = null) => {
  const seekedJobTitle = formData.get('seekedJobTitle');
  const experience = formData.get('experience');
  const notifications = formData.get('receiveNotifications') === 'on';
  const technicalSkills = JSON.parse(formData.get('technicalSkills') || '[]');
  const jobPositionSkills = JSON.parse(formData.get('jobPositionSkills') || '[]');
  const fieldSkills = JSON.parse(formData.get('fieldSkills') || '[]');
  const softSkills = JSON.parse(formData.get('softSkills') || '[]');

  const profileData = {
    profileName: 'Default Profile',
    jobTitle: [seekedJobTitle],
    technicalSkills: technicalSkills.filter(s => s.trim()),
    jobPositionSkills: jobPositionSkills.filter(s => s.trim()),
    fieldSkills: fieldSkills.filter(s => s.trim()),
    softSkills: softSkills.filter(s => s.trim()),
    experience: experience,
    education: '',
    receiveNotifications: notifications,
    customRules: ''
  };

  const url = profileId 
    ? `${API_URL}/api/profile/${profileId}/update` 
    : `${API_URL}/api/profile/${jobSeekerId}/save`;
  
  const method = profileId ? 'PUT' : 'POST';
  const snakedProfileData = snakecaseKeys(profileData);

  const response = await fetch(url, {
    method: method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(snakedProfileData)
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to update profile');
  }
  
  return response.json();
};

// Endpoint: GET api/profile/{profile_id}
export const getProfile = async (token, profileId) => {
  const response = await fetch(`${API_URL}/api/profile/${profileId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch profile');
  }
  
  return response.json();
};