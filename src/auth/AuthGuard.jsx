import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';

export default function AuthGuard({ children }) {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl animate-pulse"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
          />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <LoginPage />;
  }

  return children;
}
