import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import api from '../utils/api';
import { Search, LogOut, Download, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Track whether we're in search mode or list mode
  const [activeQuery, setActiveQuery] = useState('');

  const fetchProfiles = async (searchQuery = '', targetPage = 1) => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (searchQuery) {
        res = await api.get('/api/profiles/search', {
          params: { q: searchQuery, page: targetPage, limit },
        });
      } else {
        res = await api.get('/api/profiles', {
          params: { page: targetPage, limit },
        });
      }
      setProfiles(res.data.data || []);
      setPage(res.data.page || targetPage);
      setTotalPages(res.data.total_pages || 1);
      setTotal(res.data.total || 0);
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
    setActiveQuery(query);
    setPage(1);
    fetchProfiles(query, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchProfiles(activeQuery, newPage);
  };

  const handleExport = async () => {
    setExporting(true);
    setError('');
    try {
      // FIX: must include format=csv — backend requires it
      const res = await api.get('/api/profiles/export', {
        params: { format: 'csv' },
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profiles_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleRowClick = (profileId: string) => {
    navigate(`/profiles/${profileId}`);
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
          <button onClick={handleExport} className="btn btn-outline" disabled={exporting}>
            <Download size={18} /> {exporting ? 'Exporting...' : 'Export CSV'}
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

        {/* Stats bar */}
        {!loading && total > 0 && (
          <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
            {activeQuery ? `Found ${total} result${total !== 1 ? 's' : ''} for "${activeQuery}"` : `${total} profiles total`}
            {' · '}Page {page} of {totalPages}
          </p>
        )}

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
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted" style={{ padding: '3rem' }}>
                    Loading...
                  </td>
                </tr>
              ) : profiles.length > 0 ? (
                profiles.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => handleRowClick(p.id)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                  >
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted" style={{ padding: '3rem' }}>
                    No profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4" style={{ marginTop: '1.5rem' }}>
            <button
              className="btn btn-outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || loading}
              style={{ padding: '0.4rem 0.8rem' }}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-outline"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || loading}
              style={{ padding: '0.4rem 0.8rem' }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;