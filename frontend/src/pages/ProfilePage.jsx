import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Shield,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, changePassword, isAdmin } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Profile
        </h1>
      </div>

      {/* Profile Overview Card matching Reference UI Screen 10 */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 card-hover-lift animate-fade-in-up">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-tr from-brand-red to-brand-blue-vibrant p-0.5 shadow-md flex items-center justify-center shrink-0">
            {user?.avatar && !isAdmin ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <User className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{user?.name || 'Player'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-brand-blue-vibrant border border-blue-200">
                {isAdmin ? 'ADMIN' : 'PLAYER'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Member</span>
        </div>
      </div>

      {/* 2-Column Section matching Reference UI Screen 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Personal Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                readOnly
                value={user?.name || 'John Doe'}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                value={user?.email || 'john.doe@example.com'}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Role
              </label>
              <input
                type="text"
                readOnly
                value={user?.role || 'Player'}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Change Password Form matching Reference UI Screen 10 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Change Password
          </h3>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-brand-red text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-brand-red hover:bg-brand-red-dark shadow-xs transition-colors disabled:opacity-60"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
