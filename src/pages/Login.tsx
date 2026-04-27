import React from 'react';
import { useAuth } from '../components/AuthProvider';
import { Navigate } from 'react-router-dom';
import { Fingerprint } from 'lucide-react';

const Login: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;


  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <Fingerprint size={48} color="var(--accent-primary)" />
          </div>
        </div>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>Insighta Labs+</h1>
        <p className="text-muted" style={{ marginBottom: '2.5rem' }}>Secure demographic intelligence.</p>
        
        <a href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/auth/github?source=web`} className="btn btn-primary w-full" style={{ padding: '0.8rem' }}>
          Continue with GitHub
        </a>
      </div>
    </div>
  );
};

export default Login;
