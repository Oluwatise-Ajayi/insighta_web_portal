import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import api from '../utils/api';
import { Search, LogOut, Download, ShieldAlert } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  gender: string;
  age: number;
  age_group: string;
  country_name: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfiles = async (searchQuery = '') => {
    setLoading(true);
    setError('');
    try {
      const endpoint = searchQuery ? `/api/profiles/search?q=${encodeURIComponent(searchQuery)}` : '/api/profiles';
      const res = await api.get(endpoint);
      setProfiles(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfiles(query);
  };

  const handleExport = async () => {
    try {
      const endpoint = query ? `/api/profiles/export?q=${encodeURIComponent(query)}` : '/api/profiles/export';
      const res = await api.get(endpoint);
      
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'profiles_export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Export failed');
    }
  };

  return (
    <div>
      <nav style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', padding: '1rem 0' }}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 style={{ color: 'var(--accent-primary)', margin: 0 }}>Insighta</h2>
            <span className={`badge badge-${user?.role}`}>{user?.role}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={user?.avatar_url} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>{user?.username}</span>
            </div>
            <button onClick={logout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mt-8">
        <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Demographic Intelligence</h1>
            <p className="text-muted">Query, analyze, and export profiles.</p>
          </div>
          
          <button onClick={handleExport} className="btn btn-outline">
            <Download size={18} /> Export CSV
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSearch} className="flex gap-4 items-center">
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="input" 
                placeholder="Search using natural language (e.g. 'young females from nigeria')" 
                style={{ paddingLeft: '3rem' }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Analyze'}
            </button>
          </form>
          {error && (
            <div className="flex items-center gap-2 mt-4" style={{ color: 'var(--danger)', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
              <ShieldAlert size={18} /> {error}
            </div>
          )}
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Age Group</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {profiles.length > 0 ? profiles.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td>
                    <span style={{ color: p.gender === 'male' ? '#60a5fa' : '#f472b6' }}>
                      {p.gender}
                    </span>
                  </td>
                  <td>{p.age}</td>
                  <td>{p.age_group}</td>
                  <td>{p.country_name}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted" style={{ padding: '3rem' }}>
                    No profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
