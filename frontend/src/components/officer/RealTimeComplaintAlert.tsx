import React from 'react';
import { ShieldAlert, X, ArrowRight, BellRing, MapPin, AlertTriangle, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RealTimeComplaintAlert: React.FC = () => {
  const { officerNewComplaintAlert, dismissOfficerAlert, openComplaintDetail, currentOfficer } = useApp();

  if (!officerNewComplaintAlert) return null;

  const complaint = officerNewComplaintAlert;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white dark:bg-[#111C2E] border-2 border-rose-500 rounded-2xl shadow-2xl p-5 text-xs animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 animate-pulse">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              NEW CIVIC ISSUE IN YOUR JURISDICTION
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {complaint.category}
            </h3>
          </div>
        </div>

        <button
          onClick={dismissOfficerAlert}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 space-y-2 text-xs">
        <p className="text-slate-700 dark:text-slate-300 font-medium leading-normal line-clamp-2">
          "{complaint.title}"
        </p>

        <div className="p-3 bg-slate-50 dark:bg-[#17243A] rounded-xl space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Complaint ID:</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
              {complaint.id}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Location:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {complaint.location.ward}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Priority Score:</span>
            <span className="font-mono font-bold text-rose-600">
              {complaint.priorityScore}/100 ({complaint.severity})
            </span>
          </div>

          {complaint.similarReportsCount && complaint.similarReportsCount > 1 && (
            <div className="flex items-center justify-between text-amber-600 font-semibold pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>Similar Grievances Nearby:</span>
              </span>
              <span className="font-mono">{complaint.similarReportsCount} Citizen Reports</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          onClick={dismissOfficerAlert}
          className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
        >
          Dismiss
        </button>

        <button
          onClick={() => {
            openComplaintDetail(complaint.id);
            dismissOfficerAlert();
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <span>View &amp; Assign Complaint</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
