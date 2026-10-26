import React, { useState } from 'react';
import {
  Settings,
  User,
  Globe,
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../locales';
import { api } from '../services/api';
import { Language } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { t, setLanguage: setAppLanguage } = useTranslation();

  // Profile Form state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [preferredLang, setPreferredLang] = useState<Language>(user?.preferred_language || 'en');
  const [profileMsg, setProfileMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMsg, setPassMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [passLoading, setPassLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileLoading(true);

    try {
      const updated = await api.put<any>('/auth/me', {
        full_name: fullName.trim(),
        preferred_language: preferredLang,
      });
      updateUser(updated);
      setAppLanguage(preferredLang);
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err: any) {
      setProfileMsg({
        text: err.detail || 'Failed to update profile.',
        type: 'error',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPassword !== confirmPassword) {
      setPassMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setPassMsg({ text: 'New password must be at least 6 characters long.', type: 'error' });
      return;
    }

    setPassLoading(true);
    try {
      await api.post('/auth/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      });
      setPassMsg({ text: 'Password updated successfully!', type: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassMsg({
        text: err.detail || 'Failed to change password. Verify your existing password.',
        type: 'error',
      });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest bg-sage-light px-2.5 py-1 rounded-full mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Account Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-agri-text">
          {t.profile}
        </h1>
        <p className="text-sm text-agri-muted mt-1">
          Manage your personal information, language preferences, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-agri-border shadow-xs space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-agri-border">
            <div className="w-12 h-12 rounded-2xl bg-forest text-white flex items-center justify-center font-bold text-lg">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-agri-text">{user?.full_name}</h2>
              <p className="text-xs text-agri-muted">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-forest bg-sage-light px-2 py-0.5 rounded-md">
                Role: {user?.role}
              </span>
            </div>
          </div>

          {profileMsg && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-agri-success'
                  : 'bg-red-50 border-red-200 text-agri-error'
              }`}
            >
              {profileMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Preferred Interface Language
              </label>
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value as Language)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full py-2.5 bg-forest hover:bg-forest-light text-white font-bold rounded-xl text-xs shadow-xs transition-colors disabled:opacity-50"
            >
              {profileLoading ? 'Saving changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-agri-border shadow-xs space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-agri-border">
            <Lock className="w-5 h-5 text-forest" />
            <h2 className="text-lg font-bold text-agri-text">Security & Password</h2>
          </div>

          {passMsg && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                passMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-agri-success'
                  : 'bg-red-50 border-red-200 text-agri-error'
              }`}
            >
              {passMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{passMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Current Password *
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                New Password *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-text mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-agri-border bg-agri-page text-sm text-agri-text focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            <button
              type="submit"
              disabled={passLoading}
              className="w-full py-2.5 bg-forest hover:bg-forest-light text-white font-bold rounded-xl text-xs shadow-xs transition-colors disabled:opacity-50"
            >
              {passLoading ? 'Updating password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="bg-white p-6 rounded-3xl border border-agri-border shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-agri-text">Session Management</h3>
          <p className="text-xs text-agri-muted">Sign out of this browser session securely.</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 border border-agri-border hover:bg-red-50 hover:text-agri-error text-agri-muted font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </div>
    </div>
  );
};
