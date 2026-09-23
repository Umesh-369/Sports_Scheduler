import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield
} from 'lucide-react';
import signupGraphic from '../assets/signup_runner.jpg';

export const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Dynamic Password Strength Meter
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-200', text: 'text-slate-400' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 10) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500', text: 'text-blue-500' };
    return { score: 4, label: 'Strong & Secure', color: 'bg-emerald-500', text: 'text-emerald-500' };
  }, [password]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service to continue');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between relative overflow-hidden selection:bg-brand-red selection:text-white">
      {/* Dynamic Ambient Background Mesh (Light Theme) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-brand-blue-vibrant/10 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute -bottom-40 right-1/4 w-[450px] h-[450px] bg-emerald-400/10 rounded-full blur-[140px] animate-float-reverse" />
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Bar with Logo & Back Link */}
        <header className="flex items-center justify-between pb-8">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/80 shadow-soft">
            <Logo size="md" />
          </div>

          <Link
            to="/"
            className="group flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-all bg-white/90 hover:bg-white px-4 py-2 rounded-full border border-slate-200/80 hover:border-slate-300 shadow-soft backdrop-blur-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-brand-blue-vibrant" />
            <span>Back to Home</span>
          </Link>
        </header>

        {/* Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Form Section Card (Pristine Light Theme) */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-lg mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 relative overflow-hidden shadow-xl">
              {/* Top Accent Gradient */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-brand-blue-vibrant to-transparent opacity-80" />

              {/* Segmented Auth Switcher Tabs */}
              <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200/60 mb-8">
                <Link
                  to="/signin"
                  className="flex-1 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 rounded-xl text-center transition-all hover:bg-white/50"
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-white text-slate-900 shadow-sm transition-all"
                >
                  Create Account
                </button>
              </div>

              {/* Title & Badge */}
              <div className="space-y-1.5 mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-brand-blue-vibrant text-[11px] font-bold tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue-vibrant animate-ping" />
                  <span>Join The League</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Create your profile
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Register your account to join games, book slots, and lead matches.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-brand-red text-xs font-semibold animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{error}</span>
                </div>
              )}

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-blue-vibrant transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-blue-vibrant/10 focus:border-brand-blue-vibrant transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-blue-vibrant transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-blue-vibrant/10 focus:border-brand-blue-vibrant transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-blue-vibrant transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-blue-vibrant/10 focus:border-brand-blue-vibrant transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Strength:</span>
                        <span className={`font-bold ${passwordStrength.text}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 h-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-full rounded-full transition-all duration-300 ${
                              step <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Confirm Password
                    </label>
                    {confirmPassword && (
                      <span
                        className={`text-[10px] font-bold ${
                          passwordsMatch ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {passwordsMatch ? '✓ Passwords match' : '✕ Passwords mismatch'}
                      </span>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-blue-vibrant transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className={`w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-white focus:bg-white border rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all ${
                        confirmPassword && !passwordsMatch
                          ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                          : 'border-slate-200 focus:ring-brand-blue-vibrant/10 focus:border-brand-blue-vibrant'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Informative Player Notice */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100/80 flex items-start gap-3 text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-blue-vibrant flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="text-xs leading-relaxed">
                    <p className="font-semibold text-slate-900 mb-0.5">Player Account</p>
                    <p className="text-slate-500">
                      New accounts are created as Player accounts. Contact an administrator for administrative access.
                    </p>
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-blue-vibrant focus:ring-brand-blue-vibrant/30 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-500 leading-tight">
                      I agree to the{' '}
                      <span className="text-slate-900 font-semibold underline hover:text-brand-blue-vibrant">Terms of Service</span>{' '}
                      and{' '}
                      <span className="text-slate-900 font-semibold underline hover:text-brand-blue-vibrant">Privacy Policy</span>.
                    </span>
                  </label>
                </div>

                {/* Primary CTA Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-brand-blue-vibrant via-blue-600 to-brand-blue-vibrant hover:brightness-105 shadow-md shadow-brand-blue-vibrant/25 hover:shadow-brand-blue-vibrant/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-60 shimmer-effect cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Profile...</span>
                    </div>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Switch to Sign In */}
              <div className="pt-6 mt-6 border-t border-slate-200/80 text-center text-xs text-slate-500 font-medium">
                Already registered with us?{' '}
                <Link
                  to="/signin"
                  className="text-brand-blue-vibrant font-bold hover:underline transition-colors"
                >
                  Sign in here
                </Link>
              </div>
            </div>
          </div>

          {/* Right Showcase: 3D Athletic Runner Clean Light Showcase (No Mock Tags) */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col items-center justify-center p-4 relative">
            <div className="w-full max-w-xl bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
              {/* Ambient radial highlight */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-brand-blue-vibrant/10 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

              {/* Centerpiece 3D Runner Graphic with smooth float */}
              <div className="relative py-6 flex items-center justify-center z-10 animate-float">
                <img
                  src={signupGraphic}
                  alt="3D Athletic Runner"
                  className="relative z-10 w-full max-h-[440px] object-contain drop-shadow-[0_20px_35px_rgba(15,23,42,0.12)] rounded-2xl"
                />
              </div>

              {/* Clean Brand Motto Headline */}
              <div className="relative z-10 text-center mt-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Elevate Your Athletic Journey
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 max-w-sm mx-auto">
                  Join games, connect with fellow athletes, and track every match seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Footer Bar */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-slate-400">
        &copy; {new Date().getFullYear()} Sports Scheduler. All rights reserved.
      </footer>
    </div>
  );
};
