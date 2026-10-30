import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DonutChart } from '../common/Charts';

export const CommunityInsightsPage: React.FC = () => {
  const { currentCitizen, complaints, setCitizenActiveTab } = useApp();

  // Category breakdown for current citizen's ward
  const wardComplaints = complaints.filter(c => c.location.ward.includes(currentCitizen.ward) || currentCitizen.ward.includes(c.location.ward));

  const statusDonutData = [
    { name: 'Resolved', value: 38, color: '#10B981' },
    { name: 'In Progress / Assigned', value: 14, color: '#F59E0B' },
    { name: 'Under Review', value: 6, color: '#3B82F6' },
    { name: 'Newly Submitted', value: 4, color: '#8B5CF6' }
  ];

  const categoryBreakdown = [
    { category: 'Road Damage & Potholes', count: 28, pct: 45, icon: '🛣️' },
    { category: 'Drainage & Stormwater', count: 18, pct: 29, icon: '🌊' },
    { category: 'Streetlight Outages', count: 9, pct: 14, icon: '💡' },
    { category: 'Water Pipeline Leaks', count: 5, pct: 8, icon: '💧' },
    { category: 'Garbage & Sanitation', count: 3, pct: 4, icon: '🗑️' }
  ];

  const monthlyTrend = [
    { month: 'Jun', count: 14 },
    { month: 'Jul', count: 22 },
    { month: 'Aug', count: 31 },
    { month: 'Sep', count: 26 },
    { month: 'Oct (Curr)', count: 19 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Community Insights ({currentCitizen.ward})
        </h1>
      </div>

      {/* Community Insights Highlights Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Resolution Rate</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
            78%
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg. Resolution Time</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums mt-1">
            42 Hours
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Most Reported Issue</span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
            Roads &amp; Potholes (45%)
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Distribution (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Complaint Status Breakdown
            </h2>

            <div className="py-2">
              <DonutChart data={statusDonutData} totalLabel="62" totalSub="Locality Reports" size={180} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#17243A] rounded-xl text-center text-xs text-slate-600 dark:text-slate-300 mt-3">
            Average turnaround time: <strong className="font-mono text-blue-600 dark:text-blue-400">42 Hours</strong>
          </div>
        </div>

        {/* Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Most Frequently Reported Civic Problems
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Distribution across civic infrastructure categories in {currentCitizen.ward}
            </p>

            <div className="space-y-3.5">
              {categoryBreakdown.map(cat => (
                <div key={cat.category} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>{cat.icon}</span>
                      <span>{cat.category}</span>
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {cat.count} reports ({cat.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Bar Trend */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Complaints Reported Over Time (Last 5 Months)
            </span>
            <div className="flex items-end justify-between gap-3 h-20 pt-2">
              {monthlyTrend.map(item => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300 font-bold">
                    {item.count}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-blue-500/80 hover:bg-blue-600 rounded-t-md transition-all"
                    style={{ height: `${(item.count / 35) * 50}px` }}
                  />
                  <span className="text-[10px] text-slate-400">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#17243A] border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Citizen Privacy Protected:</strong> Only aggregated civic trends and infrastructure health ratings are displayed. Individual citizen identities and private contact numbers are strictly confidential.
          </span>
        </div>

        <button
          onClick={() => setCitizenActiveTab('report')}
          className="text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0"
        >
          Report an Issue Now →
        </button>
      </div>
    </div>
  );
};
