import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import api from '../utils/api';
import { ArrowLeft, LogOut, User, Globe, Users, Calendar } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  gender: string;
  gender_probability: number;
  age: number;
  age_group: string;
  country_id: string;
  country_name: string;
  country_probability: number;
  created_at: string;
}

const ProfileDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/profiles/${id}`);
        setProfile(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const formatProbability = (val: number) =>
    val != null ? `${(val * 100).toFixed(1)}%` : '—';

  const formatDate = (val: string) =>
    val ? new Date(val).toLocaleString() : '—';

  return (
    <div>
      {/* Nav */}
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
        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline"
          style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={16} /> Back to Profiles
        </button>

        {loading && (
          <div className="flex items-center justify-center" style={{ padding: '4rem' }}>
            <p className="text-muted">Loading profile...</p>
          </div>
        )}

        {error && (
          <div style={{ color: 'var(--danger)', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {profile && !loading && (
          <div>
            {/* Header */}
            <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                backgroundColor: profile.gender === 'male' ? 'rgba(96,165,250,0.15)' : 'rgba(244,114,182,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <User size={32} color={profile.gender === 'male' ? '#60a5fa' : '#f472b6'} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{profile.name}</h1>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>ID: {profile.id}</p>
              </div>
            </div>

            {/* Detail cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>

              {/* Gender */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                  <Users size={18} color="var(--accent-primary)" />
                  <h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Gender</h3>
                </div>
                <p style={{ fontSize: '1.4rem', fontWeight: 600, margin: '0 0 0.25rem', color: profile.gender === 'male' ? '#60a5fa' : '#f472b6' }}>
                  {profile.gender}
                </p>
                <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
                  Confidence: {formatProbability(profile.gender_probability)}
                </p>
              </div>

              {/* Age */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                  <Calendar size={18} color="var(--accent-primary)" />
                  <h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Age</h3>
                </div>
                <p style={{ fontSize: '1.4rem', fontWeight: 600, margin: '0 0 0.25rem' }}>
                  {profile.age ?? '—'}
                </p>
                <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
                  Group: {profile.age_group}
                </p>
              </div>

              {/* Country */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
                  <Globe size={18} color="var(--accent-primary)" />
                  <h3 style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Country</h3>
                </div>
                <p style={{ fontSize: '1.4rem', fontWeight: 600, margin: '0 0 0.25rem' }}>
                  {profile.country_name || profile.country_id || '—'}
                </p>
                <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
                  Code: {profile.country_id} · Confidence: {formatProbability(profile.country_probability)}
                </p>
              </div>

            </div>

            {/* Created at */}
            <div className="card" style={{ padding: '1rem 1.5rem', marginTop: '1rem' }}>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>
                Created: {formatDate(profile.created_at)}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfileDetail;