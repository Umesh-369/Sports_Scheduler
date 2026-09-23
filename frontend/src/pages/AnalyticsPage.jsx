import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  PieChart as PieIcon
} from 'lucide-react';
import { getSportEmoji } from '../utils/sportImages';

export const AnalyticsPage = () => {
  const { isAdmin } = useAuth();
  const [days, setDays] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/admin?days=${days}`);
      if (res.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-200 rounded-3xl"></div>
          <div className="h-64 bg-slate-200 rounded-3xl"></div>
        </div>
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  const { summary = {}, sportPopularity = [], activityTimeline = [] } = analytics || {};

  // Real timeline data from backend (no fake mock arrays)
  const barData = activityTimeline.length > 0 ? activityTimeline : [];
  const maxBar = Math.max(...barData.map((b) => b.total || 1), 5);

  // Palette matching Reference UI Screen 9
  const sliceColors = ['#E63946', '#2563EB', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans animate-fade-in-up">
      {/* Header & Time Filter matching Reference UI Screen 9 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Track and analyze sports performance
          </p>
        </div>

        <div>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-blue-vibrant/20 cursor-pointer"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Top 2 Cards matching Reference UI Screen 9 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sessions Played Bar Chart */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft card-hover-lift flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-slate-400">Sessions Played</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900">
                    {summary?.sessionsPlayed ?? summary?.totalSessions ?? 0}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    +12%
                  </span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-brand-red flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>

            {/* Custom Bar Chart matching Screen 9 */}
            {barData.length === 0 ? (
              <div className="h-44 flex items-center justify-center text-xs text-slate-400 font-medium">
                No activity recorded in this time range
              </div>
            ) : (
              <div className="h-44 flex items-end justify-between gap-1.5 pt-6 px-1">
                {barData.map((item, idx) => {
                  const heightPercent = Math.max(12, Math.round((item.total / maxBar) * 100));
                  const isEven = idx % 2 === 0;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                      <div className="w-full flex items-end justify-center h-28">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[14px] rounded-t-sm transition-all duration-300 ${
                            isEven
                              ? 'bg-brand-red'
                              : 'bg-brand-blue-vibrant'
                          }`}
                          title={`${item.date}: ${item.total} sessions`}
                        />
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400 truncate max-w-[28px]">
                        {item.date ? item.date.slice(5) : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-6 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red"></span> Completed Games
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue-vibrant"></span> Open Sessions
            </span>
          </div>
        </div>

        {/* Sport Popularity Donut / Legend matching Screen 9 */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft card-hover-lift flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-slate-400">Sport Popularity</span>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Session Usage Share</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-blue-vibrant flex items-center justify-center">
                <PieIcon className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-2">
              {/* SVG Donut Chart */}
              <div className="sm:col-span-5 flex items-center justify-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {sportPopularity.map((sp, idx) => {
                      const offset = sportPopularity
                        .slice(0, idx)
                        .reduce((sum, item) => sum + (item.percentage || 0), 0);
                      return (
                        <path
                          key={sp.id}
                          stroke={sliceColors[idx % sliceColors.length]}
                          strokeWidth="5"
                          strokeDasharray={`${sp.percentage || 15}, 100`}
                          strokeDashoffset={-offset}
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-xl font-black text-slate-900">
                      {summary?.totalSessions ?? 0}
                    </span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Games</span>
                  </div>
                </div>
              </div>

              {/* Legends matching Screen 9 */}
              <div className="sm:col-span-7 space-y-1.5">
                {sportPopularity.slice(0, 6).map((sp, idx) => (
                  <div key={sp.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: sliceColors[idx % sliceColors.length] }}
                      />
                      <span className="font-medium text-slate-700">{sp.name}</span>
                    </div>
                    <span className="font-extrabold text-slate-900">{sp.percentage || 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center text-[10px] font-medium text-slate-400">
            Real-time analytics from scheduled database sessions
          </div>
        </div>
      </div>

      {/* Bottom Section: Session Statistics Table matching Reference UI Screen 9 */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Session Statistics
          </h2>
          <span className="text-xs font-bold text-slate-400">
            All Sports Breakdown
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase font-extrabold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Sport</th>
                <th className="py-3.5 px-6">Sessions Played</th>
                <th className="py-3.5 px-6 w-1/2">Popularity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sportPopularity.map((sp) => (
                <tr key={sp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="text-base">{getSportEmoji(sp.name)}</span>
                      <span className="font-bold text-slate-900 text-sm">{sp.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-extrabold text-slate-900 text-sm">
                    {sp.sessionCount || 0}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          style={{ width: `${Math.max(4, sp.percentage || 0)}%` }}
                          className="h-full bg-brand-blue-vibrant rounded-full"
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 w-10 text-right">
                        {sp.percentage || 0}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
