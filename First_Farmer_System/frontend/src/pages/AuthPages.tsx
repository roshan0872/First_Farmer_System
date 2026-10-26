import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sprout, LogIn, UserPlus, AlertCircle, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../locales';

interface AuthPagesProps {
  initialMode?: 'login' | 'register';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin) {
      if (!fullName) {
        setError('Please provide your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
        navigate(from, { replace: true });
      } else {
        await register({
          full_name: fullName,
          email,
          password,
          confirm_password: confirmPassword,
          preferred_language: language,
        });
        setSuccessMsg('Account registered successfully! Redirecting...');
        setTimeout(() => navigate('/dashboard', { replace: true }), 800);
      }
    } catch (err: any) {
      setError(err.detail || err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = (type: 'student' | 'admin') => {
    if (type === 'student') {
      setEmail('student@firstfarmer.org');
      setPassword('Student@123');
    } else {
      setEmail('admin@firstfarmer.org');
      setPassword('Admin@123');
    }
    setIsLogin(true);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto my-6 bg-white p-8 rounded-3xl border border-agri-border shadow-sm">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-forest text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
          <Sprout className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-agri-text">
          {isLogin ? 'Sign In to First Farmer' : 'Create Student Account'}
        </h1>
        <p className="text-xs text-agri-muted mt-1">
          {isLogin
            ? 'Access your saved crops, learning progress, and recommendations.'
            : 'Join the agricultural learning community and track your learning journey.'}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-sage-light p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true);
            setError(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            isLogin ? 'bg-white text-forest shadow-xs' : 'text-agri-muted hover:text-forest'
          }`}
        >
          {t.login}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsLogin(false);
            setError(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            !isLogin ? 'bg-white text-forest shadow-xs' : 'text-agri-muted hover:text-forest'
          }`}
        >
          {t.register}
        </button>
      </div>

      {/* Error / Success Alerts */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-agri-error">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2 text-xs text-agri-success">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-xs font-bold text-agri-text mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-agri-text mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="farmer@example.com"
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-agri-text mb-1">
            Password *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </div>

        {!isLogin && (
          <>
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-forest hover:bg-forest-light text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-sm mt-2 flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isLogin ? (
            <>
              <LogIn className="w-4 h-4" />
              <span>{t.login}</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>{t.register}</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Login Credentials (Convenient for evaluators) */}
      <div className="mt-8 pt-6 border-t border-agri-border">
        <span className="text-[11px] font-bold text-agri-muted uppercase tracking-wider block text-center mb-2">
          Development Demo Credentials
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleFillDemo('student')}
            className="p-2.5 rounded-xl border border-agri-border bg-sage-light/50 hover:bg-sage-light text-forest text-left transition-colors flex items-center space-x-2"
          >
            <User className="w-4 h-4 flex-shrink-0" />
            <div>
              <p className="font-bold">Student Demo</p>
              <p className="text-[10px] text-agri-muted">Fill student</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleFillDemo('admin')}
            className="p-2.5 rounded-xl border border-agri-border bg-amber-50/60 hover:bg-amber-50 text-agri-warning text-left transition-colors flex items-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <div>
              <p className="font-bold">Admin Demo</p>
              <p className="text-[10px] text-agri-muted">Fill admin</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
