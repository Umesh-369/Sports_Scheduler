import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { getSportEmoji } from '../utils/sportImages';

export const AdminSportsPage = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingSport, setEditingSport] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchSports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sports');
      if (res.success) {
        setSports(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch sports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  const openAddModal = () => {
    setEditingSport(null);
    setName('');
    setDescription('');
    setModalError('');
    setShowModal(true);
  };

  const openEditModal = (sport) => {
    setEditingSport(sport);
    setName(sport.name);
    setDescription(sport.description || '');
    setModalError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);

    try {
      if (editingSport) {
        await api.put(`/sports/${editingSport.id}`, { name, description, icon: name.toLowerCase() });
        setSuccessMsg(`Sport "${name}" updated successfully.`);
      } else {
        await api.post('/sports', { name, description, icon: name.toLowerCase() });
        setSuccessMsg(`Sport "${name}" added successfully.`);
      }
      setShowModal(false);
      await fetchSports();
    } catch (err) {
      setModalError(err.message || 'Failed to save sport');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (sport) => {
    if (!window.confirm(`Are you sure you want to delete sport "${sport.name}"?`)) return;

    setError('');
    setSuccessMsg('');
    try {
      const res = await api.delete(`/sports/${sport.id}`);
      setSuccessMsg(res.data?.message || 'Sport deleted successfully.');
      await fetchSports();
    } catch (err) {
      setError(err.message || 'Could not delete sport');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans animate-fade-in-up">
      {/* Header matching Reference UI Screen 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manage Sports
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Add and manage sports available on the platform
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-brand-red hover:bg-brand-red-dark shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sport</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-brand-red text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sports Table matching Reference UI Screen 5 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Sport</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-slate-400 animate-pulse">
                    Loading sports directory...
                  </td>
                </tr>
              ) : sports.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-slate-400">
                    No sports found. Click "+ Add Sport" to add one.
                  </td>
                </tr>
              ) : (
                sports.map((sport) => (
                  <tr key={sport.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getSportEmoji(sport.name)}</span>
                        <span className="font-bold text-sm text-slate-900">{sport.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-md">
                      {sport.description || 'No description'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(sport)}
                          title="Edit Sport"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-blue-vibrant hover:bg-blue-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sport)}
                          title="Delete Sport"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-red hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-brand-red/80 hover:text-brand-red" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Sport Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingSport ? 'Edit Sport' : 'Add New Sport'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 text-brand-red text-xs font-semibold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Sport Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Football, Basketball"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Team sport, 11 players"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-brand-red hover:bg-brand-red-dark shadow-xs disabled:opacity-60"
                >
                  {modalLoading ? 'Saving...' : 'Save Sport'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
