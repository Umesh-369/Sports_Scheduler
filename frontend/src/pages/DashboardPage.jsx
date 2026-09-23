import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  Calendar,
  Users,
  Trophy,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Plus,
  Activity,
  AlertCircle
} from 'lucide-react';
import { getSportEmoji } from '../utils/sportImages';

export const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [playerStats, setPlayerStats] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [error, setError] = useState('');
  const [joiningId, setJoiningId] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      if (isAdmin) {
        const [adminRes, sessionsRes] = await Promise.all([
          api.get('/analytics/admin?days=30'),
          api.get('/sessions?view=all')
        ]);
        if (adminRes.success) setAdminStats(adminRes.data);
        if (sessionsRes.success) setUpcomingSessions(sessionsRes.data.slice(0, 5));
      } else {
        const [playerRes, sessionsRes] = await Promise.all([
          api.get('/analytics/player'),
          api.get('/sessions?view=available')
        ]);
        if (playerRes.success) setPlayerStats(playerRes.data);
        if (sessionsRes.success) setUpcomingSessions(sessionsRes.data.slice(0, 3));
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAdmin]);

  const handleJoinSession = async (e, sessionId) => {
    e.stopPropagation();
    setJoiningId(sessionId);
    try {
      await api.post(`/sessions/${sessionId}/join`);
      await fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Could not join session');
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  // Admin Dashboard View matching Reference UI Screen 11
  if (isAdmin && adminStats) {
    const { summary, recentSessions = [] } = adminStats;
    const sessionList = recentSessions.length > 0 ? recentSessions : upcomingSessions;

    return (
      <div className="space-y-8 font-sans">
        {/* Top Greeting Header matching Screen 11 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome, Admin!
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Here's what's happening with your sports community.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/sports"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-brand-red hover:bg-brand-red-dark shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sport</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-brand-red text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 4 Admin Stat Cards matching Screen 11 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Total Users */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft card-hover-lift">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">Total Users</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-blue-vibrant flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{summary.totalUsers}</div>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="bg-emerald-50 px-1.5 py-0.5 rounded">+5%</span>
            </div>
          </div>

          {/* Total Sports */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft card-hover-lift">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">Total Sports</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{summary.totalSports}</div>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="bg-emerald-50 px-1.5 py-0.5 rounded">+2%</span>
            </div>
          </div>

          {/* Total Sessions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft card-hover-lift">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">Total Sessions</span>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-brand-red flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{summary.totalSessions}</div>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="bg-emerald-50 px-1.5 py-0.5 rounded">+12%</span>
            </div>
          </div>

          {/* Active Players */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft card-hover-lift">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">Active Players</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{summary.activePlayers}</div>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="bg-emerald-50 px-1.5 py-0.5 rounded">+8%</span>
            </div>
          </div>
        </div>

        {/* Recent Sessions Table matching Screen 11 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Recent Sessions</h2>
            <Link
              to="/sessions?view=all"
              className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Sport</th>
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6">Venue</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sessionList.map((session) => (
                  <tr
                    key={session.id}
                    onClick={() => navigate(`/sessions/${session.id}`)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-base">{getSportEmoji(session.sport?.name)}</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {session.sport?.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {session.date} • {session.time}
                    </td>
                    <td className="py-4 px-6 text-slate-600 truncate max-w-xs">
                      {session.venue}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          session.status === 'OPEN'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : session.status === 'FULL'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-red-50 text-brand-red border border-red-200'
                        }`}
                      >
                        {session.status === 'OPEN' ? 'Open' : session.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-xs font-bold text-brand-blue-vibrant hover:underline">
                        View
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Player Dashboard View matching Reference UI Screen 4
  const firstName = user?.name ? user.name.split(' ')[0] : 'John';

  return (
    <div className="space-y-8 font-sans">
      {/* Top Greeting Header matching Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Good Morning, {firstName}!
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Keep playing, keep growing!
          </p>
        </div>

        <Link
          to="/create-session"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-brand-red hover:bg-brand-red-dark shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Session</span>
        </Link>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-brand-red text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Stat Cards matching Screen 4 */}
      {playerStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Total Sessions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft card-hover-lift">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">Total Sessions</span>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-brand-red flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{playerStats.totalSessions}</div>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="bg-emerald-50 px-1.5 py-0.5 rounded">+2 this week</span>
            </div>
          </div>

          {/* Joined Sessions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft card-hover-lift">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">Joined Sessions</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{playerStats.joinedSessions}</div>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="bg-emerald-50 px-1.5 py-0.5 rounded">+1 this week</span>
            </div>
          </div>

          {/* Created Sessions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft card-hover-lift">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">Created Sessions</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{playerStats.createdSessions}</div>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="bg-emerald-50 px-1.5 py-0.5 rounded">+1 this week</span>
            </div>
          </div>

          {/* Available Sessions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft card-hover-lift">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">Available Sessions</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-blue-vibrant flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">{playerStats.availableSessions}</div>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span className="bg-emerald-50 px-1.5 py-0.5 rounded">+3 this week</span>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Sessions Section matching Screen 4 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">Upcoming Sessions</h2>
          <Link
            to="/sessions?view=available"
            className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No open upcoming sessions</h3>
            <p className="text-xs text-slate-400 mt-1">Check back later or schedule your own match.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => navigate(`/sessions/${session.id}`)}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                      {getSportEmoji(session.sport?.name)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {session.sport?.name}
                      </h3>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {session.date} • {session.time}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{session.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {session.currentParticipantsCount}/{session.totalSlots} players
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end">
                  {session.hasJoined ? (
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                      Joined
                    </span>
                  ) : session.isCreator ? (
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 bg-slate-100">
                      Host
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleJoinSession(e, session.id)}
                      disabled={joiningId === session.id}
                      className="px-5 py-1.5 rounded-full font-bold text-xs text-white bg-brand-blue-vibrant hover:bg-blue-700 shadow-xs hover:shadow-glow-blue transition-all disabled:opacity-60"
                    >
                      {joiningId === session.id ? 'Joining...' : 'Join'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
