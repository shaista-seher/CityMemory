import React, { useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Map,
  Database,
  History,
  Wrench,
  BrainCircuit,
  ShieldAlert,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  Users,
  UserCheck
} from 'lucide-react';
import { useApp, NavigationPage } from '../../context/AppContext';

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeType?: 'danger' | 'warning' | 'neutral';
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    assets,
    complaints,
    currentOfficer,
    setIsAuthModalOpen,
    setCurrentUserRole,
    setCitizenActiveTab
  } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Complaints in officer's jurisdiction
  const officerComplaints = complaints.filter(c =>
    currentOfficer.assignedWards.some(w => c.location.ward.includes(w) || w.includes(c.location.ward))
  );
  const pendingOfficerComplaints = officerComplaints.filter(c => c.status !== 'Resolved').length;

  const criticalCount = assets.filter(a => a.riskLevel === 'Critical').length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'operations', label: 'Complaints', icon: ShieldAlert, badge: pendingOfficerComplaints, badgeType: 'danger' },
    { id: 'risk', label: 'Priority Queue', icon: Activity },
    { id: 'map', label: 'Infrastructure Map', icon: Map, badge: criticalCount, badgeType: 'danger' },
    { id: 'registry', label: 'Departments', icon: Database },
    { id: 'reports', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`relative shrink-0 flex flex-col border-r transition-all duration-300 z-20 bg-white dark:bg-[#111C2E] border-slate-200 dark:border-[#263449] ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-[#263449]">
        <button
          onClick={() => setActivePage('overview')}
          className="flex items-center gap-3 text-left overflow-hidden group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 dark:bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="text-base font-bold tracking-tight text-[#142B4A] dark:text-white block leading-none">
                CityMemory
              </span>
            </div>
          )}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-2.5 space-y-1 overflow-y-auto py-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeType === 'danger'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-semibold'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-semibold'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-slate-200 dark:border-[#263449] text-[11px] text-slate-500 dark:text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span>Jurisdiction</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {currentOfficer.assignedWards[0].split(' ')[0]} +{currentOfficer.assignedWards.length - 1}
            </span>
          </div>

          <button
            onClick={() => {
              setCurrentUserRole('citizen');
              setCitizenActiveTab('dashboard');
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold rounded-lg transition-colors cursor-pointer text-[11px]"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Switch to Citizen View →</span>
          </button>
        </div>
      ) : (
        <div className="p-2 border-t border-slate-200 dark:border-[#263449] flex justify-center">
          <button
            onClick={() => {
              setCurrentUserRole('citizen');
              setCitizenActiveTab('dashboard');
            }}
            title="Switch to Citizen View"
            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
          >
            <UserCheck className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
