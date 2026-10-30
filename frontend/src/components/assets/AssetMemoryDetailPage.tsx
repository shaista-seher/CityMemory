import React, { useState } from 'react';
import {
  History,
  AlertTriangle,
  Clock,
  Sparkles,
  Calendar,
  Wrench,
  CheckCircle2,
  FileText,
  MapPin,
  Building,
  TrendingDown,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Printer,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddMaintenanceModal } from '../common/Modals';

export const AssetMemoryDetailPage: React.FC = () => {
  const { assets, selectedAssetId, setSelectedAssetId, setActivePage } = useApp();

  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<string>('All');

  const asset = assets.find(a => a.id === selectedAssetId) || assets[0];

  if (!asset) {
    return (
      <div className="p-8 text-center text-slate-500">
        Asset not found.{' '}
        <button onClick={() => setActivePage('registry')} className="text-blue-600 underline">
          Return to Registry
        </button>
      </div>
    );
  }

  // Filter timeline
  const filteredHistory = asset.history.filter(event => {
    if (historyFilter === 'All') return true;
    return event.type === historyFilter;
  });

  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case 'Installation': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400';
      case 'Inspection': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400';
      case 'Maintenance': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400';
      case 'Complaint': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400';
      case 'Failure': return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400';
      case 'Repair': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Asset Selector */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                {asset.id}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{asset.category}</span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{asset.ward}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {asset.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Responsible: {asset.responsibleDepartment} · Coordinates: {asset.coordinates[0].toFixed(4)}, {asset.coordinates[1].toFixed(4)}
            </p>
          </div>

          {/* Asset Switcher & Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative">
              <select
                value={asset.id}
                onChange={e => setSelectedAssetId(e.target.value)}
                className="pl-3 pr-8 py-2 text-xs font-medium bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              >
                {assets.map(a => (
                  <option key={a.id} value={a.id}>
                    [{a.id}] {a.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsAddMaintenanceOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Log Maintenance</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#17243A] dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Print Asset Digital Record"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Risk Score</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span
                className={`text-xl font-bold font-mono tabular-nums ${
                  asset.riskScore >= 80 ? 'text-rose-600 dark:text-rose-400' :
                  asset.riskScore >= 60 ? 'text-orange-600 dark:text-orange-400' :
                  asset.riskScore >= 35 ? 'text-amber-600 dark:text-amber-400' :
                  'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {asset.riskScore}
              </span>
              <span className="text-[11px] font-medium text-slate-500">/ 100 ({asset.riskLevel})</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Condition Health</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {asset.conditionScore}
              </span>
              <span className="text-[11px] font-medium text-slate-500">({asset.currentCondition})</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Failure Probability</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 tabular-nums">
                {asset.failureProbability || 15}%
              </span>
              <span className="text-[11px] text-slate-500">in {asset.estimatedFailureWindow || '180+ days'}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lifecycle Timeline</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {asset.history.length}
              </span>
              <span className="text-[11px] text-slate-500">Logged Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Left Column Timeline (7 cols) + Right Column AI Memory Diagnosis (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Digital Memory Chronological Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Asset History
                </h3>
              </div>

              {/* Event Type Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                {['All', 'Inspection', 'Maintenance', 'Complaint', 'Failure'].map(type => (
                  <button
                    key={type}
                    onClick={() => setHistoryFilter(type)}
                    className={`px-2.5 py-1 text-[11px] rounded-md transition-colors cursor-pointer ${
                      historyFilter === type
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Stream */}
            <div className="relative mt-6 pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {filteredHistory.map((item, idx) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#111C2E] ${
                      item.type === 'Failure' ? 'bg-rose-500 ring-4 ring-rose-100 dark:ring-rose-950/50' :
                      item.type === 'Complaint' ? 'bg-amber-500' :
                      item.type === 'Maintenance' ? 'bg-emerald-500' :
                      item.type === 'Installation' ? 'bg-blue-600' : 'bg-indigo-500'
                    }`}
                  />

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#17243A] border border-slate-200/60 dark:border-slate-700/60 space-y-1.5 transition-all hover:border-slate-300 dark:hover:border-slate-600">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${getEventBadgeClass(item.type)}`}>
                          {item.type}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                        {item.date}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {item.evidenceNotes && (
                      <div className="p-2 rounded bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300">
                        <span className="font-semibold">Observation: </span>
                        {item.evidenceNotes}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-200/40 dark:border-slate-700/40">
                      <span>Dept: {item.department}</span>
                      {item.cost && (
                        <span className="font-mono font-medium text-slate-600 dark:text-slate-300">
                          Cost: ₹{(item.cost).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Intelligence & Digital Memory Diagnosis */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Memory Diagnostics Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Failure Diagnostics
                </h3>
              </div>
            </div>

            {/* Recurring Failure Patterns */}
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Identified Recurring Failure Patterns
              </span>
              <div className="space-y-1.5">
                {asset.recurringFailurePatterns.map((pattern, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950 text-xs text-rose-900 dark:text-rose-300"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{pattern}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vulnerability & Weakness Factors */}
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Contributing Weakness Breakdown
              </span>
              <div className="space-y-2.5">
                {asset.weaknessFactors.map((factor, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-600 dark:text-slate-400">{factor.factor}</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                        {factor.impact}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          factor.impact >= 75 ? 'bg-rose-500' : factor.impact >= 50 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${factor.impact}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial ROI: Preventive vs Reactive Cost */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-[#17243A] border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-800 dark:text-emerald-400 block mb-2">
                Preventive ROI &amp; Cost Avoidance
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Proactive Cost:</span>
                  <div className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    ₹{(asset.estimatedPreventiveCost / 100000).toFixed(2)} Lakhs
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Reactive Disaster Cost:</span>
                  <div className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5">
                    ₹{(asset.estimatedReactiveFailureCost / 100000).toFixed(2)} Lakhs
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-emerald-200/40 dark:border-emerald-900/30 font-semibold text-emerald-700 dark:text-emerald-300 text-[11px]">
                Net Municipal Savings: ₹{((asset.estimatedReactiveFailureCost - asset.estimatedPreventiveCost) / 100000).toFixed(2)} Lakhs
              </div>
            </div>

            {/* Recommended Action */}
            <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-blue-900 dark:text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Recommended Preventive Action</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                {asset.recommendedAction}
              </p>
              <button
                onClick={() => setIsAddMaintenanceOpen(true)}
                className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Dispatch Maintenance Crew</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Modal */}
      <AddMaintenanceModal
        isOpen={isAddMaintenanceOpen}
        onClose={() => setIsAddMaintenanceOpen(false)}
        preselectedAssetId={asset.id}
      />
    </div>
  );
};
