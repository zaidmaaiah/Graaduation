import { useState, useEffect } from 'react';
import { updateProfile, getProfile } from '../../api/profile';
import SkillsInput from '../../components/SkillsInput';
import CVUpload from '../../components/CVUpload';

const Profile = ({ user, token }) => {
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [cvFile, setCvFile] = useState(null);
  const [currentCV, setCurrentCV] = useState('');
  const [profileId, setProfileId] = useState(null);
  
  const [formData, setFormData] = useState({
    seekedJobTitle: '',
    experience: '',
    receiveNotifications: false
  });
  
  const [technicalSkills, setTechnicalSkills] = useState(['']);
  const [jobPositionSkills, setJobPositionSkills] = useState(['']);
  const [fieldSkills, setFieldSkills] = useState(['']);
  const [softSkills, setSoftSkills] = useState(['']);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfileId = localStorage.getItem('profileId');
        if (storedProfileId && user?.jobSeekerId) {
          const profile = await getProfile(token, storedProfileId);
          
          setProfileId(profile.id);
          setFormData({
            seekedJobTitle: profile.jobTitle?.[0] || '',
            experience: profile.experience || '',
            receiveNotifications: profile.receiveNotifications || false
          });
          setTechnicalSkills(profile.technicalSkills?.length > 0 ? profile.technicalSkills : ['']);
          setJobPositionSkills(profile.jobPositionSkills?.length > 0 ? profile.jobPositionSkills : ['']);
          setFieldSkills(profile.fieldSkills?.length > 0 ? profile.fieldSkills : ['']);
          setSoftSkills(profile.softSkills?.length > 0 ? profile.softSkills : ['']);
          
          if (profile.cvFileName) {
            setCurrentCV(profile.cvFileName);
          }
        }
      } catch (err) {
        console.log('No existing profile found');
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user?.jobSeekerId && token) {
      loadProfile();
    }
  }, [token, user]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCVSelect = (file) => {
    setCvFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const submitFormData = new FormData();
    submitFormData.append('seekedJobTitle', formData.seekedJobTitle);
    submitFormData.append('experience', formData.experience);
    submitFormData.append('receiveNotifications', formData.receiveNotifications ? 'on' : 'off');
    
    if (cvFile) {
      submitFormData.append('cv', cvFile);
    }
    
    submitFormData.append('technicalSkills', JSON.stringify(technicalSkills.filter(s => s.trim())));
    submitFormData.append('jobPositionSkills', JSON.stringify(jobPositionSkills.filter(s => s.trim())));
    submitFormData.append('fieldSkills', JSON.stringify(fieldSkills.filter(s => s.trim())));
    submitFormData.append('softSkills', JSON.stringify(softSkills.filter(s => s.trim())));

    try {
      const result = await updateProfile(submitFormData, token, user.jobSeekerId, profileId);

      if (!profileId && result.id) {
        setProfileId(result.id);
        localStorage.setItem('profileId', result.id);
      }
      
      if (result.cvFileName) {
        setCurrentCV(result.cvFileName);
      }
      
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <CVUpload onFileSelect={handleCVSelect} currentCV={currentCV} />

          <div>
            <label htmlFor="seekedJobTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Desired Job Title *
            </label>
            <input
              id="seekedJobTitle"
              name="seekedJobTitle"
              type="text"
              required
              value={formData.seekedJobTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Software Engineer"
            />
          </div>

          <SkillsInput 
            label="Technical Skills" 
            skills={technicalSkills} 
            setSkills={setTechnicalSkills} 
          />
          
          <SkillsInput 
            label="Job Position Skills" 
            skills={jobPositionSkills} 
            setSkills={setJobPositionSkills} 
          />
          
          <SkillsInput 
            label="Field Skills" 
            skills={fieldSkills} 
            setSkills={setFieldSkills} 
          />
          
          <SkillsInput 
            label="Soft Skills" 
            skills={softSkills} 
            setSkills={setSoftSkills} 
          />

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience *
            </label>
            <input
              id="experience"
              name="experience"
              type="text"
              required
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 3 years"
            />
          </div>

          <div className="flex items-center">
            <input
              id="receiveNotifications"
              name="receiveNotifications"
              type="checkbox"
              checked={formData.receiveNotifications}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="receiveNotifications" className="ml-2 text-sm text-gray-700">
              Receive job notifications via email
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;