import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Zap,
  Star,
  Shield,
  X
} from 'lucide-react';
import signinGraphic from '../assets/signin_ribbon_balls.jpg';

export const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user?.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-slate-800 flex flex-col justify-between relative overflow-hidden selection:bg-brand-red selection:text-white">
      {/* Dynamic Ambient Background Mesh (Light Theme) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-brand-blue-vibrant/10 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] bg-amber-400/10 rounded-full blur-[140px] animate-float-reverse" />
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Bar with Logo & Back Link */}
        <header className="flex items-center justify-between pb-8">
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/80 shadow-soft">
            <Logo size="md" />
          </div>

          <Link
            to="/"
            className="group flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-all bg-white/80 hover:bg-white px-4 py-2 rounded-full border border-slate-200/80 hover:border-slate-300 shadow-soft backdrop-blur-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-brand-red" />
            <span>Back to Home</span>
          </Link>
        </header>

        {/* Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Form Section Card (Ultra-Premium Light Theme) */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-lg mx-auto">
            <div className="glass-card-light rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-slate-200/80 shadow-xl">
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-80" />

              {/* Segmented Auth Switcher Tabs */}
              <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200/60 mb-8">
                <button
                  type="button"
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-white text-slate-900 shadow-sm transition-all"
                >
                  Sign In
                </button>
                <Link
                  to="/signup"
                  className="flex-1 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 rounded-xl text-center transition-all hover:bg-white/50"
                >
                  Create Account
                </Link>
              </div>

              {/* Title & Badge */}
              <div className="space-y-1.5 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-brand-red text-[11px] font-bold tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-ping" />
                  <span>Welcome Back</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Sign in to your arena
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Access your scheduled matches, book courts, and track your athletic stats.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-brand-red text-xs font-semibold animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{error}</span>
                </div>
              )}

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-red transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-red/10 focus:border-brand-red transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setShowForgotModal(true);
                      }}
                      className="text-[11px] font-bold text-brand-red hover:text-brand-red-dark transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-red transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-red/10 focus:border-brand-red transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-brand-red focus:ring-brand-red/30 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-600 text-xs">Keep me signed in</span>
                  </label>
                </div>

                {/* Primary CTA Submit Button with Shimmer */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-red via-brand-red-dark to-brand-red hover:brightness-105 shadow-md shadow-brand-red/25 hover:shadow-brand-red/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-60 shimmer-effect cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Switch to Register */}
              <div className="pt-6 mt-6 border-t border-slate-200/80 text-center text-xs text-slate-500 font-medium">
                Don't have an account yet?{' '}
                <Link
                  to="/signup"
                  className="text-brand-red font-bold hover:underline transition-colors"
                >
                  Create free account
                </Link>
              </div>
            </div>
          </div>

          {/* Right Showcase: 3D Visual Experience Card (Clean Light Theme) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col items-center justify-center p-4 relative">
            <div className="w-full max-w-xl bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
              {/* Radial backdrop highlight */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-brand-red/10 to-brand-blue-vibrant/10 rounded-full blur-3xl pointer-events-none" />

              {/* Centerpiece 3D Graphics with floating animation */}
              <div className="relative py-6 flex items-center justify-center z-10 animate-float">
                <img
                  src={signinGraphic}
                  alt="Sports Scheduler 3D Dynamic Athletic Scene"
                  className="relative z-10 w-full max-h-[440px] object-contain drop-shadow-[0_20px_35px_rgba(15,23,42,0.12)] rounded-2xl"
                />
              </div>

              {/* Clean Brand Motto Headline */}
              <div className="relative z-10 text-center mt-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Welcome to Your Sports Arena
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 max-w-sm mx-auto">
                  Instant scheduling, real-time match tracking, and effortless team management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (Light Theme) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSubmitted(false);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-50 text-brand-red flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1.5">Reset Your Password</h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter your account's email address and we'll send you verification steps to restore access.
            </p>

            {forgotSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-sm font-bold text-emerald-800">Reset Link Dispatched</div>
                <p className="text-xs text-slate-600">
                  If an account exists for <span className="font-semibold text-slate-900">{forgotEmail}</span>, instructions have been sent.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="mt-3 w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-red/10 focus:border-brand-red"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-brand-red hover:bg-brand-red-dark text-white transition-all shadow-md shadow-brand-red/20"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Subtle Footer Bar */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-slate-400">
        &copy; {new Date().getFullYear()} Sports Scheduler. All rights reserved.
      </footer>
    </div>
  );
};
