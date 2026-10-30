import React, { useState } from 'react';
import {
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ArrowRight,
  MapPin,
  Sparkles,
  X,
  Calendar,
  User,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CitizenComplaint } from '../../types';

export const CitizenDashboard: React.FC = () => {
  const { currentCitizen, complaints, setCitizenActiveTab } = useApp();

  const [selectedComplaint, setSelectedComplaint] = useState<CitizenComplaint | null>(null);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

  const myComplaints = complaints.filter(c => c.citizenId === currentCitizen.id);
  const totalCount = myComplaints.length;
  const resolvedCount = myComplaints.filter(c => c.status === 'Resolved').length;
  const inProgressCount = myComplaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const pendingCount = myComplaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review' || c.status === 'Acknowledged').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Welcome Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#142B4A] via-blue-800 to-indigo-900 text-white p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-200 font-semibold uppercase tracking-wider font-mono">
            {currentCitizen.ward}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
            Hello, {currentCitizen.name}
          </h1>
        </div>

        <button
          onClick={() => setCitizenActiveTab('report')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Issue</span>
        </button>
      </div>

      {/* 2. Primary KPI Cards - Numbers & Headlines Only */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Complaints */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Reported</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {totalCount}
            </span>
          </div>
        </div>

        {/* Resolved */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Resolved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {resolvedCount}
            </span>
          </div>
        </div>

        {/* In Progress */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
              {inProgressCount}
            </span>
          </div>
        </div>

        {/* Pending */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {pendingCount}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Clean Complaints List + Clean Ward Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Your Reports (8 cols) - Minimal & Clean */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Your Reports ({myComplaints.length})
            </h2>

            <button
              onClick={() => setCitizenActiveTab('my-complaints')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myComplaints.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-xs text-slate-400">No issues reported yet.</p>
              <button
                onClick={() => setCitizenActiveTab('report')}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-xs cursor-pointer"
              >
                Report Civic Issue
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {myComplaints.slice(0, 4).map(complaint => (
                <div
                  key={complaint.id}
                  onClick={() => setSelectedComplaint(complaint)}
                  className="py-3 group cursor-pointer hover:bg-slate-50 dark:hover:bg-[#17243A]/50 -mx-2 px-3 rounded-xl transition-all flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {complaint.id}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="font-medium text-slate-500 dark:text-slate-400 truncate">
                        {complaint.category}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {complaint.title}
                    </h3>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-xs">{complaint.location.address}</span>
                      <span>·</span>
                      <span>{complaint.dateSubmitted.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        complaint.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : complaint.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : complaint.status === 'Assigned'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {complaint.status}
                    </span>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Ward Status (4 cols) - Clean Snapshot */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {currentCitizen.ward}
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Avg. Resolution:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">42 Hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Resolution Rate:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Active Crews:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">3 Crews</span>
              </div>
            </div>

            <button
              onClick={() => setCitizenActiveTab('community')}
              className="w-full py-2.5 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 rounded-xl transition-colors cursor-pointer"
            >
              Community Insights →
            </button>
          </div>
        </div>
      </div>

      {/* ================= CLICK-TO-VIEW COMPLAINT DETAIL MODAL ================= */}
      {selectedComplaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-xs max-h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-[#17243A]/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                    {selectedComplaint.id}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {selectedComplaint.category}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {selectedComplaint.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Status & Priority Row */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#17243A]">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    {selectedComplaint.status}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Priority Score</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                    {selectedComplaint.priorityScore}/100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date Filed</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-xs">
                    {selectedComplaint.dateSubmitted}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">Location</span>
                <p className="text-xs text-slate-800 dark:text-slate-200">
                  {selectedComplaint.location.address} ({selectedComplaint.location.ward})
                </p>
              </div>

              {/* Description */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">Problem Description</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#17243A] p-3 rounded-xl">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Photo Evidence */}
              {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Attached Photo Proof</span>
                  <div className="flex gap-2">
                    {selectedComplaint.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Civic issue proof"
                        className="w-24 h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Officer Notes if Available */}
              {selectedComplaint.officerRemarks && (
                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-xl">
                  <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block mb-0.5">
                    Municipal Field Update:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {selectedComplaint.officerRemarks}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-[#17243A]/50">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HOW IT WORKS MODAL (Accessible on click, not polluting dashboard) ================= */}
      {showHowItWorksModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowHowItWorksModal(false)}
        >
          <div
            className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-2xl shadow-2xl max-w-md w-full p-6 text-xs space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                How CityMemory Works
              </h2>
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Snap &amp; Submit</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Take a photo with GPS location and select the issue category.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Intelligent Clustering</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">CityMemory automatically groups duplicate complaints to escalate urgency.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Engineer Dispatch</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Assigned ward engineer dispatches repair crew and logs repair updates.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">4</span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Resolution &amp; Photo Proof</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">Receive immediate notification and verified resolution photo evidence.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowHowItWorksModal(false)}
                className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
