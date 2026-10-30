import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  MapPin,
  Check,
  User,
  Sliders,
  ExternalLink,
  ShieldAlert,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopNav: React.FC = () => {
  const {
    activePage,
    setActivePage,
    theme,
    toggleTheme,
    selectedWard,
    setSelectedWard,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openAssetDetail,
    setIsCommandPaletteOpen,
    currentOfficer,
    setCurrentUserRole,
    setCitizenActiveTab,
    setIsAuthModalOpen,
    logout
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageTitles: Record<string, string> = {
    operations: 'Complaints',
    overview: 'Dashboard',
    map: 'Infrastructure Map',
    registry: 'Departments & Assets',
    detail: 'Asset Details',
    maintenance: 'Maintenance History',
    prediction: 'Failure Predictions',
    risk: 'Priority Queue',
    reports: 'Analytics',
    settings: 'Settings'
  };

  const currentTitle = pageTitles[activePage] || 'Dashboard';

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-[#263449] bg-white dark:bg-[#111C2E] shrink-0 z-10 transition-colors">
      {/* Left: Clean Page Title */}
      <div className="flex items-center gap-2 truncate">
        <h1 className="text-base font-bold text-[#142B4A] dark:text-white truncate tracking-tight">
          {currentTitle}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search Button / Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/80 dark:bg-[#17243A] dark:hover:bg-[#1b2b45] text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer w-44 lg:w-60"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate text-left flex-1">Search assets, wards...</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Ward / Location Selector */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-[#17243A] rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <select
            value={selectedWard}
            onChange={e => setSelectedWard(e.target.value)}
            className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
          >
            <option value="All Wards">All BBMP Wards</option>
            <option value="Ward 12 (Indiranagar)">Ward 12 (Indiranagar)</option>
            <option value="Ward 15 (Koramangala)">Ward 15 (Koramangala)</option>
            <option value="Ward 08 (Malleshwaram)">Ward 08 (Malleshwaram)</option>
            <option value="Ward 04 (Hebbal)">Ward 04 (Hebbal)</option>
            <option value="Ward 22 (Whitefield)">Ward 22 (Whitefield)</option>
            <option value="Ward 31 (Jayanagar)">Ward 31 (Jayanagar)</option>
          </select>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Infrastructure Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-xl shadow-2xl overflow-hidden z-50 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#17243A]/50">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">Live Civic Alerts</span>
                  {unreadCount > 0 && (
                    <span className="font-mono text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 rounded-full font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      markNotificationRead(item.id);
                      if (item.assetId) openAssetDetail(item.assetId);
                      setIsNotifOpen(false);
                    }}
                    className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                      !item.read ? 'bg-blue-50/20 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                        {item.type === 'critical' ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        )}
                        <span>{item.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                      {item.message}
                    </p>
                    {item.assetId && (
                      <div className="mt-2 flex items-center text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                        <span>View Asset Digital Memory →</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Switch to Citizen Mode Quick Pill */}
        <button
          onClick={() => {
            setCurrentUserRole('citizen');
            setCitizenActiveTab('dashboard');
          }}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-900 transition-colors cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span>Citizen Portal →</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* User Profile */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentOfficer.name.split(' ').slice(1).map(n => n[0]).join('') || 'KR'}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <span className="font-semibold text-slate-900 dark:text-white block leading-none">
                {currentOfficer.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate max-w-[130px]">
                {currentOfficer.designation}
              </span>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-xl shadow-2xl py-1 z-50 text-xs animate-in fade-in duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white">{currentOfficer.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">ID: {currentOfficer.employeeId}</div>
                <div className="mt-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  Wards: {currentOfficer.assignedWards.join(', ')}
                </div>
              </div>

              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left font-semibold"
              >
                <User className="w-3.5 h-3.5" />
                <span>Switch Role / Officer Profile</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('settings');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>Jurisdiction Settings</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out to Login Screen</span>
              </button>
            </div>
          )}
        </div>

        {/* Dedicated Quick Log Out Icon */}
        <button
          onClick={logout}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium transition-colors cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
          title="Log Out to Login Page"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Log Out</span>
        </button>
      </div>
    </header>
  );
};
