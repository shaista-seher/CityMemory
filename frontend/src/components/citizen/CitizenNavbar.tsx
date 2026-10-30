import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  PlusCircle,
  Clock,
  BarChart3,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  User,
  MapPin,
  CheckCircle2,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useApp, CitizenTab } from '../../context/AppContext';

export const CitizenNavbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    citizenActiveTab,
    setCitizenActiveTab,
    currentCitizen,
    complaints,
    setIsAuthModalOpen,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openComplaintDetail
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Filter complaints for current citizen
  const myComplaints = complaints.filter(c => c.citizenId === currentCitizen.id);
  const unreadNotifs = notifications.filter(n => !n.read);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks: { id: CitizenTab; label: string; icon?: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'report', label: 'Report Issue', icon: PlusCircle },
    { id: 'my-complaints', label: 'My Complaints', badge: myComplaints.length },
    { id: 'community', label: 'Community Insights' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111C2E]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#263449] transition-colors">
      {/* Top Demo Bar / Role Bar */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold uppercase tracking-wider text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">
            Citizen Mode
          </span>
          <span className="truncate hidden sm:inline">
            Logged in as <strong className="font-semibold">{currentCitizen.name}</strong> ({currentCitizen.ward})
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-md text-[11px] shadow-xs transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Switch to Municipal Officer →</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1 px-2.5 py-0.5 bg-blue-800/80 hover:bg-blue-900 text-white font-medium rounded-md text-[11px] border border-blue-400/40 transition-colors cursor-pointer"
            title="Log Out to Login Page"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCitizenActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#142B4A] dark:text-white block leading-none">
                CityMemory
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight block mt-0.5">
                Citizen Civic Portal
              </span>
            </div>
          </button>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-[#17243A] p-1 rounded-xl">
          {navLinks.map(link => {
            const isActive = citizenActiveTab === link.id;
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => setCitizenActiveTab(link.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? link.id === 'report'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : link.id === 'report'
                    ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-slate-700 dark:text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Report CTA for Mobile */}
          <button
            onClick={() => setCitizenActiveTab('report')}
            className="md:hidden flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-[#111C2E]" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-2xl shadow-2xl overflow-hidden z-50 text-xs animate-in fade-in duration-150">
                <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#17243A]/50">
                  <span className="font-semibold text-slate-900 dark:text-white">Citizen Updates</span>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.complaintId) openComplaintDetail(n.complaintId);
                        setIsNotifOpen(false);
                      }}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-slate-900 dark:text-white">{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Citizen Profile Pill */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#17243A] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {currentCitizen.name[0]}
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-semibold text-slate-900 dark:text-white block leading-none text-xs">
                {currentCitizen.name}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[110px]">
                {currentCitizen.ward}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            title="Log Out to Login Screen"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Links Row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-800 py-1.5 px-2 bg-slate-50/50 dark:bg-[#17243A]/50 text-xs">
        {navLinks.map(link => (
          <button
            key={link.id}
            onClick={() => setCitizenActiveTab(link.id)}
            className={`px-2.5 py-1 rounded-md font-medium ${
              citizenActiveTab === link.id
                ? 'text-blue-600 dark:text-blue-400 font-bold bg-white dark:bg-slate-800'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
