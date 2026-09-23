import React, { useState } from 'react';
import { Search, Bell, Sun, Menu, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const TopNavbar = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/sessions?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Mobile Menu Button & Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sports, sessions..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-vibrant/20 focus:border-brand-blue-vibrant transition-all"
          />
        </form>
      </div>

      {/* Top right notification and user items matching Reference UI */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-red ring-2 ring-white"></span>
        </button>

        {/* User Avatar Link */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
            {user?.avatar && !isAdmin ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
            )}
          </div>
        </Link>
      </div>
    </header>
  );
};
