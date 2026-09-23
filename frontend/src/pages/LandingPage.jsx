import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import {
  Trophy,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';
import heroImage from '../assets/hero_sports_equipment.jpg';
import footballImg from '../assets/sports/football.jpg';
import basketballImg from '../assets/sports/basketball.jpg';
import tennisImg from '../assets/sports/tennis.jpg';
import cricketImg from '../assets/sports/cricket.jpg';
import volleyballImg from '../assets/sports/volleyball.jpg';
import badmintonImg from '../assets/sports/badminton.jpg';

export const LandingPage = () => {
  const sportsList = [
    { name: 'Football', image: footballImg, desc: '11-a-side & turf matches', emoji: '⚽' },
    { name: 'Basketball', image: basketballImg, desc: 'Indoor & outdoor 5v5 pickups', emoji: '🏀' },
    { name: 'Tennis', image: tennisImg, desc: 'Singles & doubles rallies', emoji: '🎾' },
    { name: 'Cricket', image: cricketImg, desc: 'T20 tournaments & practice', emoji: '🏏' },
    { name: 'Volleyball', image: volleyballImg, desc: 'Indoor & sand court games', emoji: '🏐' },
    { name: 'Badminton', image: badmintonImg, desc: 'Fast-paced doubles action', emoji: '🏸' }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800 selection:bg-brand-red selection:text-white">
      {/* Navigation Header matching Reference UI Screen 1 */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 sm:h-24 flex items-center justify-between">
          <Logo size="lg" />

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-bold">
            <Link to="/" className="text-brand-red transition-colors">
              Home
            </Link>
            <a href="#sports" className="text-slate-600 hover:text-slate-900 transition-colors">
              Sports
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
              How It Works
            </a>
          </nav>

          {/* Right Auth Action Buttons */}
          <div className="flex items-center gap-5">
            <Link
              to="/signin"
              className="text-sm font-bold text-slate-700 hover:text-brand-red transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-brand-red hover:bg-brand-red-dark shadow-sm hover:shadow-glow-red transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section — Large, Beautiful & Expansive */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100 bg-gradient-to-b from-white via-slate-50/40 to-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-6 space-y-7">

              <div className="space-y-2">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.08]">
                  Play Together
                </h1>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-brand-red leading-[1.08]">
                  Stay Active
                </h1>
              </div>

              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl leading-relaxed">
                Find, create and join sports sessions near you. Connect with passionate players, coordinate teams seamlessly, and make every match count!
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/signup"
                  className="px-8 py-4 rounded-full font-extrabold text-sm sm:text-base text-white bg-brand-red hover:bg-brand-red-dark shadow-md hover:shadow-glow-red transition-all duration-200 flex items-center gap-2 group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#sports"
                  className="px-8 py-4 rounded-full font-bold text-sm sm:text-base text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all duration-200 shadow-2xs"
                >
                  Learn More
                </a>
              </div>

              {/* 3 Feature Cards matching Reference UI Screen 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {/* Feature 1 */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue-vibrant flex items-center justify-center mb-3">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">Multiple Sports</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">Choose from a variety of sports</p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center mb-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">Join Sessions</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">Find & create sessions</p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue-vibrant flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">Meet Players</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">Build your sports community</p>
                </div>
              </div>
            </div>

            {/* Right Column: Large, Beautiful 3D Sports Equipment Illustration */}
            <div className="lg:col-span-6 flex items-center justify-center relative">
              <div className="relative w-full max-w-xl lg:max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                <img
                  src={heroImage}
                  alt="3D Sports Equipment on Stadium Turf"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Showcase Section */}
      <section id="sports" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
              Explore Disciplines
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Supported Sports
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Join open games or host your own match across top recreational and competitive sports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sportsList.map((sport) => (
              <div
                key={sport.name}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-soft card-hover-lift flex flex-col justify-between group"
              >
                <div>
                  <div className="h-44 w-full overflow-hidden relative">
                    <img
                      src={sport.image}
                      alt={sport.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-base shadow-xs">
                      {sport.emoji}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-brand-red transition-colors">
                      {sport.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{sport.desc}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Available Daily</span>
                  <Link
                    to="/signup"
                    className="text-xs font-bold text-brand-blue-vibrant hover:underline flex items-center gap-1"
                  >
                    <span>Browse Sessions</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-brand-blue-vibrant uppercase tracking-wider">
              Simple Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How Sports Scheduler Works
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Say goodbye to messy messaging threads. Organize games in three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-soft text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-brand-red font-black text-lg mx-auto flex items-center justify-center">
                01
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Discover Matches</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Browse nearby games filtered by sport, venue, and date with real-time available capacity.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-soft text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue-vibrant font-black text-lg mx-auto flex items-center justify-center">
                02
              </div>
              <h3 className="text-base font-extrabold text-slate-900">One-Click Join</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Reserve your spot with a single click. Automatic capacity management prevents overbooking.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-soft text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-black text-lg mx-auto flex items-center justify-center">
                03
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Play & Track Stats</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Meet your squad at the venue, play your heart out, and review session stats on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-brand-blue to-slate-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-card">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Step onto the Field?
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto font-medium">
              Create your account in seconds, schedule a game, or jump into open games in your city.
            </p>
            <div className="pt-2">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-extrabold text-sm text-white bg-brand-red hover:bg-brand-red-dark shadow-md hover:shadow-glow-red transition-all duration-200"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Logo size="sm" to="/" />
            <span className="text-slate-300">|</span>
            <span>© 2025 Sports Scheduler Inc.</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/signin" className="hover:text-slate-700 transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-slate-700 transition-colors">Sign Up</Link>
            <a href="#sports" className="hover:text-slate-700 transition-colors">Sports Directory</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
