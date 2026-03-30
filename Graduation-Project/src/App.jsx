import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Pages/auth/Login';
import Register from './Pages/auth/Register';
import AdminLogin from './Pages/admin/AdminLogin';
import UserLayout from './layouts/UserLayout';
import Profile from './Pages/user/Profile';
import Jobs from './Pages/user/Jobs';
import SavedJobs from './Pages/user/SavedJobs';
import TrendingSkills from './Pages/user/TrendingSkills';
import Dashboard from './Pages/admin/Dashboard';
import JobSources from './Pages/admin/JobSources';
import SystemLogs from './Pages/admin/SystemLogs';
import Analytics from './Pages/admin/Analytics';
import Settings from './Pages/admin/Settings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    const storedJobSeekerId = localStorage.getItem('jobSeekerId');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';

    if (storedToken && storedEmail) {
      setToken(storedToken);
      setIsAdmin(storedIsAdmin);
      
      if (storedIsAdmin) {
        setUser({ email: storedEmail });
      } else if (storedJobSeekerId) {
        setUser({
          email: storedEmail,
          jobSeekerId: parseInt(storedJobSeekerId)
        });
      }
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = (newToken, userData, adminFlag = false) => {
    setToken(newToken);
    setUser(userData);
    setIsAdmin(adminFlag);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('jobSeekerId');
    localStorage.removeItem('profileId');
    localStorage.removeItem('isAdmin');
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/register" element={<Register onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/admin/login" element={<AdminLogin onAuthSuccess={handleAuthSuccess} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : isAdmin ? (
          <Route element={<AdminLayout user={user} onLogout={handleLogout} />}>
            <Route path="/admin/dashboard" element={<Dashboard token={token} />} />
            <Route path="/admin/job-sources" element={<JobSources token={token} />} />
            <Route path="/admin/logs" element={<SystemLogs token={token} />} />
            <Route path="/admin/analytics" element={<Analytics token={token} />} />
            <Route path="/admin/settings" element={<Settings token={token} />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        ) : (
          <Route element={<UserLayout user={user} onLogout={handleLogout} />}>
            <Route path="/profile" element={<Profile user={user} token={token} />} />
            <Route path="/jobs" element={<Jobs user={user} token={token} />} />
            <Route path="/saved-jobs" element={<SavedJobs user={user} token={token} />} />
            <Route path="/trending-skills" element={<TrendingSkills user={user} token={token} />} />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;