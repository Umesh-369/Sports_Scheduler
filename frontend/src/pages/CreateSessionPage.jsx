import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Plus,
  Minus,
  Trophy,
  CheckCircle2,
  Users,
  X,
  ArrowRight
} from 'lucide-react';
import { getSportEmoji } from '../utils/sportImages';

export const CreateSessionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sports, setSports] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [sportId, setSportId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [extraPlayersNeeded, setExtraPlayersNeeded] = useState(2);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [description, setDescription] = useState('');

  // Success state matching Reference UI Screen 12
  const [createdSession, setCreatedSession] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sportsRes, usersRes] = await Promise.all([
          api.get('/sports'),
          api.get('/users')
        ]);
        if (sportsRes.success) {
          setSports(sportsRes.data);
          if (sportsRes.data.length > 0) setSportId(sportsRes.data[0].id);
        }
        if (usersRes.success) {
          setUsersList(usersRes.data.filter((u) => u.id !== user?.id));
        }
      } catch (err) {
        console.error('Failed to load initial form data:', err);
      }
    };
    fetchData();
  }, [user]);

  const handleMemberToggle = (memberId) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleDecrement = () => {
    setExtraPlayersNeeded((prev) => Math.max(0, prev - 1));
  };

  const handleIncrement = () => {
    setExtraPlayersNeeded((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!sportId) {
      setError('Please select a sport');
      return;
    }
    if (!date) {
      setError('Please select a session date');
      return;
    }
    if (!time) {
      setError('Please enter a start time');
      return;
    }
    if (!venue.trim()) {
      setError('Please provide a venue or location');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/sessions', {
        sportId: parseInt(sportId, 10),
        date,
        time,
        venue,
        extraPlayersNeeded: parseInt(extraPlayersNeeded, 10),
        teamMemberIds: selectedMemberIds,
        description
      });

      if (res.success) {
        setCreatedSession(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans animate-fade-in-up">
      {/* Title Header matching Reference UI Screen 6 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Create New Session
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
          Fill in the details to create a new sports session.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-brand-red text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2-Column Form matching Reference UI Screen 6 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Core Schedule Details */}
          <div className="space-y-4">
            {/* Select Sport */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Sport
              </label>
              <select
                value={sportId}
                onChange={(e) => setSportId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              >
                <option value="">Choose sport</option>
                {sports.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Time
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Select time (e.g. 5:00 PM)"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              />
            </div>

            {/* Venue */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Venue
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Enter venue"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              />
            </div>
          </div>

          {/* Right Column: Team Members, Extra Players, & Description */}
          <div className="space-y-4">
            {/* Team Members (optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Team Members <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl max-h-36 overflow-y-auto space-y-1">
                {usersList.length === 0 ? (
                  <p className="text-xs text-slate-400 p-2">Select existing players</p>
                ) : (
                  usersList.map((u) => {
                    const selected = selectedMemberIds.includes(u.id);
                    return (
                      <div
                        key={u.id}
                        onClick={() => handleMemberToggle(u.id)}
                        className={`p-2 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition-colors ${
                          selected
                            ? 'bg-red-50 text-brand-red font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{u.name}</span>
                        <input
                          type="checkbox"
                          checked={selected}
                          readOnly
                          className="rounded border-slate-300 text-brand-red focus:ring-brand-red"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Players Needed stepper (- 2 +) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Players Needed
              </label>
              <div className="inline-flex items-center border border-slate-200 rounded-xl p-1 bg-white">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-900 select-none">
                  {extraPlayersNeeded}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Description (optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Description <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any additional details..."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions matching Reference UI Screen 6 */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-full font-bold text-xs text-slate-600 hover:bg-slate-100 border border-slate-200 bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-2.5 rounded-full font-bold text-xs text-white bg-brand-red hover:bg-brand-red-dark shadow-xs disabled:opacity-60 transition-colors"
          >
            {loading ? 'Creating...' : 'Create Session'}
          </button>
        </div>
      </form>

      {/* Success Modal in 100% Light Theme via React Portal */}
      {createdSession && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Light-Theme Frosted Glass Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-md animate-backdrop-fade transition-opacity"
            onClick={() => setCreatedSession(null)}
          />

          {/* Ambient soft glow light blooms (Light Theme) */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-blue-vibrant/10 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl animate-pulse-glow" />
          </div>

          {/* Centered Card in Pristine Light Theme */}
          <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border border-slate-200/90 text-center space-y-5 animate-modal-pop overflow-hidden">
            {/* Top Accent Gradient Stripe */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-red via-amber-400 to-brand-blue-vibrant" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setCreatedSession(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Celebratory Trophy & Sparks in Light Theme */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center pt-2">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping opacity-60 pointer-events-none" />
              <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-100 via-amber-50 to-orange-100 border border-amber-200 shadow-md flex items-center justify-center text-amber-500">
                <Trophy className="w-8 h-8 text-amber-500 drop-shadow-sm" />
              </div>
            </div>

            {/* Badge & Headings */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold tracking-wide uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Match Scheduled Successfully</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Session Created! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Your sports session has been created and is open for players to join.
              </p>
            </div>

            {/* Match Summary Card in Clean Light Theme */}
            <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 text-left space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sport</span>
                <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <span>{getSportEmoji(createdSession.sport?.name)}</span>
                  <span>{createdSession.sport?.name || 'Match'}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-red" /> Date & Time
                </span>
                <span className="font-bold text-slate-800">
                  {createdSession.date} • {createdSession.time}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-blue-vibrant" /> Venue
                </span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]" title={createdSession.venue}>
                  {createdSession.venue}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" /> Players Needed
                </span>
                <span className="font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full text-[11px]">
                  {createdSession.extraPlayersNeeded} slots open
                </span>
              </div>
            </div>

            {/* Action Buttons in Light Theme */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => navigate('/sessions?view=created')}
                className="w-full py-3 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-red via-red-600 to-brand-red hover:brightness-105 shadow-md shadow-brand-red/25 hover:shadow-brand-red/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View My Sessions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-soft transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
