import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Trophy,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  User
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await logout();
    navigate('/signin');
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      to: '/sessions',
      label: 'My Sessions',
      icon: Calendar
    },
    {
      to: '/create-session',
      label: 'Create Session',
      icon: PlusCircle
    },
    {
      to: isAdmin ? '/admin/sports' : '/sports',
      label: 'Sports',
      icon: Trophy
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: BarChart3
    }
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Top Logo */}
      <div>
        <div className="h-20 px-6 flex items-center border-b border-slate-100">
          <Logo size="md" to="/dashboard" />
        </div>

        {/* Navigation Items matching Reference UI */}
        <nav className="p-3.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-red text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Card matching Reference UI */}
      <div className="p-3.5 border-t border-slate-100">
        <Link
          to="/profile"
          className="p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/60 flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-slate-400">
              {user?.avatar && !isAdmin ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
              )}
            </div>
            <div className="truncate text-left">
              <div className="text-xs font-bold text-slate-900 truncate">{user?.name || 'John Doe'}</div>
              <div className="text-[10px] text-slate-400 font-medium">
                {isAdmin ? 'Admin' : 'Player'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1 text-slate-400 hover:text-brand-red rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </div>
        </Link>
      </div>
    </aside>
  );
};
