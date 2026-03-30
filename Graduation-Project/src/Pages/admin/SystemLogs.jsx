import { useState, useEffect } from 'react';
import { getSystemLogs } from '../../api/admin';

const SystemLogs = ({ token }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError('');
      
      try {
        const data = await getSystemLogs(token, page, 50);
        setLogs(data.logs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token, page]);

  const getLogLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading system logs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor system activity and errors</p>
        </div>
        <button
          onClick={() => setPage(1)}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {logs.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-sm text-blue-800">
            No logs available. Connect the backend API endpoint: 
            <code className="bg-blue-100 px-2 py-1 rounded ml-1">GET /api/admin/logs</code>
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getLogLevelColor(log.level)}`}>
                    {log.level || 'INFO'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                  </span>
                </div>
                <p className="text-sm text-gray-900 mb-1">{log.message}</p>
                {log.details && (
                  <p className="text-xs text-gray-600">{log.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;