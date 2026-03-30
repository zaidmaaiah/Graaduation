import { useState, useEffect } from 'react';
import { getSystemSettings, updateSystemSettings } from '../../api/admin';

const Settings = ({ token }) => {
  const [settings, setSettings] = useState({
    embeddingModel: '',
    scrapingInterval: '',
    minSimilarityThreshold: '',
    matchingStyle: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError('');
      
      try {
        const data = await getSystemSettings(token);
        setSettings({
          embeddingModel: data.embeddingModel || '',
          scrapingInterval: data.scrapingInterval || '',
          minSimilarityThreshold: data.minSimilarityThreshold || '',
          matchingStyle: data.matchingStyle || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [token]);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateSystemSettings(token, settings);
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Configure system parameters</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {!settings.embeddingModel && !error ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-800 mb-2">
            No settings configured. Connect the backend API endpoints:
          </p>
          <code className="block bg-blue-100 px-3 py-2 rounded text-xs mb-1">GET /api/admin/settings</code>
          <code className="block bg-blue-100 px-3 py-2 rounded text-xs">PUT /api/admin/settings</code>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="embeddingModel" className="block text-sm font-medium text-gray-700 mb-2">
                Embedding Model
              </label>
              <input
                id="embeddingModel"
                name="embeddingModel"
                type="text"
                value={settings.embeddingModel}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="e.g., all-MiniLM-L6-v2"
              />
              <p className="mt-1 text-xs text-gray-500">
                The embedding model used for semantic matching
              </p>
            </div>

            <div>
              <label htmlFor="scrapingInterval" className="block text-sm font-medium text-gray-700 mb-2">
                Scraping Interval (hours)
              </label>
              <input
                id="scrapingInterval"
                name="scrapingInterval"
                type="number"
                value={settings.scrapingInterval}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="e.g., 24"
              />
              <p className="mt-1 text-xs text-gray-500">
                How often to scrape job sources (in hours)
              </p>
            </div>

            <div>
              <label htmlFor="minSimilarityThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Similarity Threshold (%)
              </label>
              <input
                id="minSimilarityThreshold"
                name="minSimilarityThreshold"
                type="number"
                min="0"
                max="100"
                value={settings.minSimilarityThreshold}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="e.g., 70"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum match percentage to show jobs to users (0-100)
              </p>
            </div>

            <div>
              <label htmlFor="matchingStyle" className="block text-sm font-medium text-gray-700 mb-2">
                Matching Style
              </label>
              <select
                id="matchingStyle"
                name="matchingStyle"
                value={settings.matchingStyle}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Select matching style...</option>
                <option value="semantic">Semantic Matching</option>
                <option value="keyword">Keyword Matching</option>
                <option value="hybrid">Hybrid Matching</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                The algorithm used for matching jobs to user profiles
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;