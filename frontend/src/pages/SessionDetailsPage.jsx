import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { getSportImage } from '../utils/sportImages';

export const SessionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Cancellation modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  const fetchSessionDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/sessions/${id}`);
      if (res.success) {
        setSession(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load session details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionDetails();
  }, [id]);

  const handleJoin = async () => {
    setActionLoading(true);
    setError('');
    try {
      await api.post(`/sessions/${id}/join`);
      await fetchSessionDetails();
    } catch (err) {
      setError(err.message || 'Could not join session');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    if (!cancellationReason.trim()) {
      setCancelError('Please specify a cancellation reason');
      return;
    }

    setActionLoading(true);
    setCancelError('');
    try {
      await api.post(`/sessions/${id}/cancel`, { cancellationReason });
      setShowCancelModal(false);
      await fetchSessionDetails();
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel session');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse font-sans">
        <div className="h-6 bg-slate-200 rounded w-20"></div>
        <div className="h-72 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 font-sans">
        <AlertCircle className="w-10 h-10 text-brand-red mx-auto mb-2" />
        <h2 className="text-base font-bold text-slate-800">Error Loading Session</h2>
        <p className="text-xs text-slate-500 mt-1">{error || 'Session not found'}</p>
        <button
          onClick={() => navigate('/sessions')}
          className="mt-4 px-4 py-2 rounded-full font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          Back to Sessions
        </button>
      </div>
    );
  }

  const canCancel = (session.isCreator || isAdmin) && session.status !== 'CANCELLED';

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans animate-fade-in-up">
      {/* Back button matching Reference UI Screen 8 */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </button>

      {/* Main Container Card matching Screen 8 */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {/* Top Header Row with Title */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Session Details
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-base font-black text-slate-900">
              {session.sport?.name} Session
            </span>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                session.status === 'OPEN'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : session.status === 'FULL'
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-red-50 text-brand-red border border-red-200'
              }`}
            >
              {session.status === 'OPEN' ? 'Open' : session.status}
            </span>
          </div>
        </div>

        {/* Hero Photographic Banner matching Screen 8 */}
        <div className="w-full h-56 sm:h-64 overflow-hidden relative">
          <img
            src={getSportImage(session.sport?.name)}
            alt={session.sport?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-6 text-white space-y-1">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{session.date} • {session.time}</span>
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{session.venue}</span>
            </div>
            <div className="text-[11px] text-slate-300">
              Created by <span className="font-bold text-white">{session.creator?.name}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row matching Screen 8 */}
        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center gap-3">
          {session.status === 'OPEN' && !session.hasJoined && !session.isPast && session.slotsRemaining > 0 && (
            <button
              onClick={handleJoin}
              disabled={actionLoading}
              className="flex-1 py-2.5 px-6 rounded-full font-bold text-xs text-white bg-brand-blue-vibrant hover:bg-blue-700 shadow-xs hover:shadow-glow-blue transition-all disabled:opacity-60"
            >
              {actionLoading ? 'Joining...' : 'Join Session'}
            </button>
          )}

          {session.hasJoined && (
            <div className="flex-1 py-2 px-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>You are confirmed for this session</span>
            </div>
          )}

          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="py-2.5 px-6 rounded-full font-bold text-xs text-brand-red bg-white hover:bg-red-50 border border-brand-red/30 transition-colors"
            >
              Cancel Session
            </button>
          )}
        </div>

        {/* 2-Column Section below matching Screen 8 */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Players Stack, Description & Extra Slots */}
          <div className="space-y-6">
            {/* Players Avatar Stack */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  Players ({session.currentParticipantsCount}/{session.totalSlots})
                </span>
                <span className="text-xs font-bold text-brand-blue-vibrant hover:underline cursor-pointer">
                  View All
                </span>
              </div>
              <div className="flex items-center -space-x-2 overflow-hidden py-1">
                {session.participants?.slice(0, 6).map((p, idx) => (
                  <div
                    key={p.id || idx}
                    title={p.name}
                    className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden flex items-center justify-center text-[10px] font-bold text-slate-700 shadow-2xs"
                  >
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      p.name?.charAt(0) || 'P'
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 mb-1">Description</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {session.description || 'Friendly match. All skill levels welcome!'}
              </p>
            </div>

            {/* Players Needed */}
            <div>
              <div className="text-xs font-bold text-slate-800">Players Needed</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {session.slotsRemaining}
              </div>
            </div>
          </div>

          {/* Right Column: Participants List matching Screen 8 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800">Participants</span>
              <span className="text-xs font-bold text-brand-blue-vibrant hover:underline cursor-pointer">
                View All
              </span>
            </div>

            <div className="space-y-2">
              {session.participants?.map((participant) => (
                <div
                  key={participant.id}
                  className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {participant.avatar ? (
                        <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
                      ) : (
                        participant.name?.charAt(0) || 'P'
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-900">
                      {participant.name}
                    </span>
                  </div>

                  {participant.id === session.creatorId && (
                    <span className="text-[10px] font-bold text-slate-400">
                      (Creator)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 text-brand-red">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Cancel Session</h3>
            </div>
            <p className="text-xs text-slate-500">
              Are you sure you want to cancel this match? All participants will be notified and this action cannot be undone.
            </p>

            {cancelError && (
              <div className="p-3 rounded-xl bg-red-50 text-brand-red text-xs font-semibold">
                {cancelError}
              </div>
            )}

            <form onSubmit={handleCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Cancellation Reason (Required)
                </label>
                <textarea
                  required
                  rows={3}
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="e.g. Bad weather, venue unavailable"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Keep Session
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-red hover:bg-brand-red-dark shadow-xs disabled:opacity-60"
                >
                  {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
