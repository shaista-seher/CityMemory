import React, { useState } from 'react';
import {
  User,
  Building,
  Bell,
  Sliders,
  CheckCircle2,
  Save,
  Moon,
  Sun,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useApp();

  const [name, setName] = useState('Er. K. Raghavan');
  const [role, setRole] = useState('Chief Municipal Engineer');
  const [email, setEmail] = useState('chief.engineer@bbmp.gov.in');
  const [phone, setPhone] = useState('+91 98450 12890');
  const [jurisdiction, setJurisdiction] = useState('BBMP Bengaluru Metropolitan Core');

  const [criticalSmsAlerts, setCriticalSmsAlerts] = useState(true);
  const [morningDigest, setMorningDigest] = useState(true);
  const [sensorAnomalyAlerts, setSensorAnomalyAlerts] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState('80');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    } catch (e) { /* ignore */ }
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Officer Profile Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Officer Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Official Designation</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Municipal Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Emergency Mobile (SMS Dispatch)</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Organization Information */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Organization &amp; Jurisdiction</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Public Authority</label>
              <input
                type="text"
                disabled
                value="Bruhat Bengaluru Mahanagara Palike (BBMP)"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Monitored Jurisdiction</label>
              <input
                type="text"
                value={jurisdiction}
                onChange={e => setJurisdiction(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Alert Preferences</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#17243A] cursor-pointer">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Critical Risk SMS Dispatch</div>
                <div className="text-[11px] text-slate-500">Send immediate SMS warnings when an asset breaches 80+ hazard threshold.</div>
              </div>
              <input
                type="checkbox"
                checked={criticalSmsAlerts}
                onChange={e => setCriticalSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#17243A] cursor-pointer">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Daily 07:00 AM Command Digest</div>
                <div className="text-[11px] text-slate-500">Daily summary email containing pre-monsoon waterlogging hazard and high-risk roads.</div>
              </div>
              <input
                type="checkbox"
                checked={morningDigest}
                onChange={e => setMorningDigest(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#17243A] cursor-pointer">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">IoT Sensor Anomaly Alerts</div>
                <div className="text-[11px] text-slate-500">Instant notification when acoustic hydrophones or drain flow meters detect surge deviations.</div>
              </div>
              <input
                type="checkbox"
                checked={sensorAnomalyAlerts}
                onChange={e => setSensorAnomalyAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Display & AI Thresholds */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Theme &amp; Model Calibration</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Visual Theme Mode</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { if (theme !== 'light') toggleTheme(); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    theme === 'light'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Emergency Work Order AI Confidence Threshold ({confidenceThreshold}%)
              </label>
              <input
                type="range"
                min="60"
                max="95"
                value={confidenceThreshold}
                onChange={e => setConfidenceThreshold(e.target.value)}
                className="w-full accent-blue-600 cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>60% (Sensitive)</span>
                <span>80% (Default)</span>
                <span>95% (Conservative)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          {savedSuccess ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preferences saved successfully!</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500">Settings will apply immediately to your active session.</span>
          )}

          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
