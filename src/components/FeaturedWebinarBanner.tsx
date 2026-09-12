import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Bell, 
  Mail, 
  Download, 
  Users, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { WebinarConfig, WebinarRegistration } from '../types/assessment';
import { useAuth } from '../context/AuthContext';
import { getUserWebinarRegistration } from '../services/firebase';
import { getGoogleCalendarUrl, downloadIcsFile } from '../services/calendarService';

interface FeaturedWebinarBannerProps {
  webinarConfig: WebinarConfig | null;
  onOpenRegisterModal: () => void;
  onOpenEmailHub: () => void;
  userRegistration: WebinarRegistration | null;
}

export const FeaturedWebinarBanner: React.FC<FeaturedWebinarBannerProps> = ({
  webinarConfig,
  onOpenRegisterModal,
  onOpenEmailHub,
  userRegistration
}) => {
  const { user } = useAuth();
  const [activeReg, setActiveReg] = useState<WebinarRegistration | null>(userRegistration);

  // Live countdown ticker to October 15, 2026 18:00 IST
  const targetDate = new Date('2026-10-15T12:30:00Z').getTime();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    setActiveReg(userRegistration);
  }, [userRegistration]);

  useEffect(() => {
    // Check if user is registered in local storage or remote
    const checkReg = async () => {
      if (user?.email || user?.uid) {
        const found = await getUserWebinarRegistration(user.email || user.uid);
        if (found) setActiveReg(found);
      }
    };
    checkReg();
  }, [user]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!webinarConfig || !webinarConfig.ctaEnabled) return null;

  return (
    <section className="relative overflow-hidden border-y border-blue-500/20 bg-gradient-to-r from-[#070c18] via-[#0d162d] to-[#080d1a] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      {/* Specular Radial Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Column: Event Details & Copy */}
          <div className="space-y-4 max-w-2xl">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                Featured Executive Masterclass
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium text-slate-300 bg-slate-800/80 border border-slate-700/60">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>{webinarConfig.date} • {webinarConfig.time}</span>
              </span>

              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Weekly Reminders Active</span>
              </span>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {webinarConfig.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
                {webinarConfig.description}
              </p>
            </div>

            {/* Key Value Bullets & Host */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span><strong>1,428+</strong> Registered (Google, Meta, Microsoft cohort)</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Host: <strong>Kapil Narula</strong> (Global AI Architect)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 1-Click Action & Live Countdown Box */}
          <div className="w-full lg:w-auto lg:min-w-[340px] bg-[#0c1426]/90 border border-blue-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
            {/* Live Countdown Grid */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <span className="flex items-center gap-1 text-blue-400">
                  <Clock className="w-3.5 h-3.5" />
                  Live Event Countdown
                </span>
                <span className="text-emerald-400">Oct 15, 2026</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg">
                  <span className="text-xl font-bold text-white">{timeLeft.days}</span>
                  <span className="block text-[9px] text-slate-400 uppercase">Days</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg">
                  <span className="text-xl font-bold text-white">{timeLeft.hours}</span>
                  <span className="block text-[9px] text-slate-400 uppercase">Hours</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg">
                  <span className="text-xl font-bold text-white">{timeLeft.minutes}</span>
                  <span className="block text-[9px] text-slate-400 uppercase">Mins</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg">
                  <span className="text-xl font-bold text-white">{timeLeft.seconds}</span>
                  <span className="block text-[9px] text-slate-400 uppercase">Secs</span>
                </div>
              </div>
            </div>

            {/* Registration Action Buttons */}
            {activeReg ? (
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>You're Registered!</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">Pass #CONFIRMED</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Google Cal</span>
                  </a>

                  <button
                    onClick={() => downloadIcsFile()}
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.ICS File</span>
                  </button>
                </div>

                <button
                  onClick={onOpenEmailHub}
                  className="w-full py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>View Weekly Reminders Schedule</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  id="one-click-register-hero-btn"
                  onClick={onOpenRegisterModal}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer group"
                >
                  <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>1-Click One-Click Register</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span className="flex items-center gap-1">
                    <Bell className="w-3 h-3 text-blue-400" />
                    Instant Push & Weekly Reminders
                  </span>
                  <button
                    onClick={onOpenEmailHub}
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2 cursor-pointer"
                  >
                    Email preview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
