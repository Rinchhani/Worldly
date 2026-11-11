import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAtlas } from '../context/AtlasContext';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, login, register } = useAuth();
  const { showToast } = useAtlas();

  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isLoginView) {
        await login(email, password);
        showToast('Welcome back, Cartographer!');
      } else {
        await register(name, email, password);
        showToast('Atlas account created successfully!');
      }
      setAuthModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemo() {
    setEmail('explorer@worldly.atlas');
    setPassword('password123');
    setIsLoginView(true);
    setError('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors"
          title="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 mx-auto rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-secondary-container text-2xl">public</span>
          </div>
          <h2 className="text-headline-sm font-bold text-on-surface">
            {isLoginView ? 'Welcome to WORLDLY' : 'Create Explorer Account'}
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            {isLoginView
              ? 'Sign in to sync your bookmarks, research tasks, and quiz streaks.'
              : 'Join the global cartographic community and unlock custom expeditions.'}
          </p>
        </div>

        {/* Error message banner */}
        {error && (
          <div className="p-3 rounded-xl bg-red-100 text-red-900 text-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600 text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLoginView && (
            <div className="space-y-1">
              <label className="text-label-md font-semibold text-on-surface">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marco Polo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-label-md font-semibold text-on-surface">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. explorer@worldly.atlas"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-label-md font-semibold text-on-surface">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-primary-container text-on-primary font-semibold text-label-md hover:bg-secondary active:scale-98 transition-all shadow-sm"
          >
            {submitting ? 'Authenticating...' : isLoginView ? 'Sign In to Atlas' : 'Register Account'}
          </button>
        </form>

        {/* Demo Credentials Quick Button */}
        <div className="pt-2 text-center border-t border-outline-variant/20">
          <button
            type="button"
            onClick={fillDemo}
            className="text-label-md text-secondary font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">vpn_key</span>
            <span>Use Demo Account (explorer@worldly.atlas)</span>
          </button>
        </div>

        {/* Toggle Login/Register */}
        <div className="text-center text-body-sm text-on-surface-variant">
          {isLoginView ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsLoginView(false); setError(''); }}
                className="text-secondary font-semibold hover:underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setIsLoginView(true); setError(''); }}
                className="text-secondary font-semibold hover:underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

