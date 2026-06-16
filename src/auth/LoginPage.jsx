import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const { login, brandName } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // brief UX delay
    const ok = login(email.trim(), password);
    if (!ok) {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  const initials = brandName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 40%, #ddd6fe 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full blur-3xl opacity-30"
          style={{ top: '-10%', right: '-8%', width: 520, height: 520, background: 'radial-gradient(circle, #7c3aed, #4f46e5)' }}
        />
        <div className="absolute rounded-full blur-3xl opacity-20"
          style={{ bottom: '-10%', left: '-8%', width: 440, height: 440, background: 'radial-gradient(circle, #818cf8, #a78bfa)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-violet-200/40 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
            >
              {initials}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{brandName}</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your editor</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
                placeholder="admin@canvas.studio"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all placeholder-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all placeholder-gray-300"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs select-none"
                  onClick={() => setShowPw(!showPw)}
                  tabIndex={-1}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="px-8 pb-6 text-center">
            <p className="text-xs text-gray-400">
              Restricted to authorized users only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
