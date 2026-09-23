import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Plus
} from 'lucide-react';
import { getSportImage } from '../utils/sportImages';

export const SessionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentTab = searchParams.get('view') || 'available'; // 'created', 'joined', 'available', 'all'
  const sportParam = searchParams.get('sportId') || '';
  const dateParam = searchParams.get('date') || '';
  const searchParam = searchParams.get('search') || '';

  const [sessions, setSessions] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParam);

  const fetchSports = async () => {
    try {
      const res = await api.get('/sports');
      if (res.success) setSports(res.data);
    } catch (err) {
      console.error('Failed to load sports:', err);
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (currentTab !== 'all') params.view = currentTab;
      if (sportParam) params.sportId = sportParam;
      if (dateParam) params.date = dateParam;

      const res = await api.get('/sessions', { params });
      if (res.success) {
        let list = res.data;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          list = list.filter(
            (s) =>
              s.sport?.name?.toLowerCase().includes(q) ||
              s.venue?.toLowerCase().includes(q) ||
              s.creator?.name?.toLowerCase().includes(q)
          );
        }
        setSessions(list);
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [currentTab, sportParam, dateParam]);

  const handleTabChange = (view) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('view', view);
    setSearchParams(nextParams);
  };

  const handleSportFilter = (sportId) => {
    const nextParams = new URLSearchParams(searchParams);
    if (sportId) nextParams.set('sportId', sportId);
    else nextParams.delete('sportId');
    setSearchParams(nextParams);
  };

  const handleDateFilter = (date) => {
    const nextParams = new URLSearchParams(searchParams);
    if (date) nextParams.set('date', date);
    else nextParams.delete('date');
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSessions();
  };

  const handleJoin = async (e, sessionId) => {
    e.stopPropagation();
    setJoiningId(sessionId);
    try {
      await api.post(`/sessions/${sessionId}/join`);
      await fetchSessions();
    } catch (err) {
      alert(err.message || 'Could not join session');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Tabs matching Reference UI Screen 7 */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-8">
          {[
            { id: 'created', label: 'Created by Me' },
            { id: 'joined', label: 'Joined by Me' },
            { id: 'available', label: 'Available' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-3.5 text-xs sm:text-sm font-bold transition-all relative ${
                currentTab === tab.id
                  ? 'text-brand-blue-vibrant'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {currentTab === tab.id && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-blue-vibrant rounded-full" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/create-session')}
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs text-white bg-brand-red hover:bg-brand-red-dark shadow-xs transition-colors mb-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Session</span>
        </button>
      </div>

      {/* Filter and Search Bar matching Reference UI Screen 7 */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-wrap items-center gap-3">
        {/* Sport Dropdown */}
        <select
          value={sportParam}
          onChange={(e) => handleSportFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue-vibrant/20"
        >
          <option value="">All Sports</option>
          {sports.map((sp) => (
            <option key={sp.id} value={sp.id}>
              {sp.name}
            </option>
          ))}
        </select>

        {/* Date Filter */}
        <input
          type="date"
          value={dateParam}
          onChange={(e) => handleDateFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue-vibrant/20"
        />

        {/* Search query input with blue Search button */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px] flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-vibrant/20"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-brand-blue-vibrant hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Sessions Grid matching Reference UI Screen 7 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No sessions found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your filters or switch tabs to view other available matches.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => navigate(`/sessions/${session.id}`)}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-soft card-hover-lift cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Visual Photographic Sport Banner matching Reference UI Screen 7 */}
                <div className="h-32 w-full overflow-hidden relative">
                  <img
                    src={getSportImage(session.sport?.name)}
                    alt={session.sport?.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs backdrop-blur-md ${
                        session.status === 'OPEN'
                          ? 'bg-emerald-500 text-white'
                          : session.status === 'FULL'
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {session.status === 'OPEN' ? 'Open' : session.status}
                    </span>
                  </div>
                </div>

                {/* Details Section matching Screen 7 */}
                <div className="p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-red transition-colors">
                    {session.sport?.name}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{session.date} • {session.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{session.venue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer matching Screen 7 */}
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    <strong className="text-slate-900 font-bold">{session.currentParticipantsCount}</strong>/
                    {session.totalSlots} players
                  </span>
                </div>

                {session.hasJoined ? (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                    Joined
                  </span>
                ) : session.isCreator ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-slate-600 bg-slate-100">
                    Host
                  </span>
                ) : session.status === 'OPEN' && session.slotsRemaining > 0 && !session.isPast ? (
                  <button
                    onClick={(e) => handleJoin(e, session.id)}
                    disabled={joiningId === session.id}
                    className="px-4 py-1.5 rounded-full font-bold text-xs text-white bg-brand-blue-vibrant hover:bg-blue-700 shadow-xs hover:shadow-glow-blue transition-all disabled:opacity-60"
                  >
                    {joiningId === session.id ? 'Joining...' : 'Join'}
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400">
                    {session.isPast ? 'Passed' : 'Full'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
