import React, { useState } from 'react';
import {
  Layers,
  AlertTriangle,
  BrainCircuit,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Clock,
  Sparkles,
  Calendar,
  Filter,
  Wrench,
  ShieldAlert,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DonutChart, FailureTrendChart } from '../common/Charts';
import { FAILURE_TREND_DATA } from '../../data/mockData';

export const OverviewPage: React.FC = () => {
  const {
    assets,
    maintenanceRecords,
    alerts,
    openAssetDetail,
    setActivePage,
    runAiAnalysis,
    isAnalyzing
  } = useApp();

  const [trendRange, setTrendRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [showAiModal, setShowAiModal] = useState(false);

  // KPI Calculations
  const totalAssets = 2842; // City-wide monitored count
  const criticalCount = assets.filter(a => a.riskLevel === 'Critical').length;
  const highRiskCount = assets.filter(a => a.riskLevel === 'High').length;
  const totalAtRisk = criticalCount + highRiskCount + 18; // 34 total across all monitored
  const predictedFailuresCount = 14;
  const maintenanceEfficiency = 91.4;

  // Donut chart health breakdown
  const donutData = [
    { name: 'Healthy Assets', value: 2315, color: '#10B981' },
    { name: 'Moderate Risk', value: 395, color: '#F59E0B' },
    { name: 'High Risk', value: 98, color: '#F97316' },
    { name: 'Critical Attention', value: 34, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Overview Dashboard
        </h1>

        <button
          onClick={() => runAiAnalysis()}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-75 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
        </button>
      </div>

      {/* 4 Primary KPI Cards - Numbers & Headlines Only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Assets */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Monitored Assets</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
              {totalAssets.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +3.8%
            </span>
          </div>
        </div>

        {/* KPI 2: Assets at Risk */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Assets at Risk</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
              {totalAtRisk}
            </span>
            <span className="text-[11px] font-mono font-medium text-rose-600 dark:text-rose-400">
              {criticalCount} Critical
            </span>
          </div>
        </div>

        {/* KPI 3: Predicted Failures */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Predicted Failures</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
              {predictedFailuresCount}
            </span>
            <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
              Next 30 Days
            </span>
          </div>
        </div>

        {/* KPI 4: Maintenance Efficiency */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Maintenance Efficiency</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
              {maintenanceEfficiency}%
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +4.2%
            </span>
          </div>
        </div>
      </div>


      {/* Row 2: Charts Split (Health Overview Donut + Failure Trend Line) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. Infrastructure Health Overview (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Infrastructure Health Overview
              </h3>
              <button
                onClick={() => setActivePage('registry')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Registry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="py-4">
              <DonutChart data={donutData} totalLabel="2,842" totalSub="Total Monitored" size={190} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#17243A] rounded-xl text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Critical assets inspected:</span>
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">100% Assigned</span>
          </div>
        </div>

        {/* B. Failure Trend Analysis (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Failure Trend &amp; AI Trajectory
              </h3>

              {/* Time Range Filter Tabs */}
              <div className="flex items-center p-0.5 bg-slate-100 dark:bg-[#17243A] rounded-lg self-start sm:self-auto text-xs">
                {(['weekly', 'monthly', 'yearly'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTrendRange(range)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer capitalize ${
                      trendRange === range
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-3">
              <FailureTrendChart data={FAILURE_TREND_DATA[trendRange]} height={230} />
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <span>Model Accuracy Rate: <strong className="font-mono text-slate-700 dark:text-slate-300">93.4%</strong></span>
            <span>Prevented Municipal Losses: <strong className="font-mono text-emerald-600 dark:text-emerald-400">₹64.20 Lakhs YTD</strong></span>
          </div>
        </div>
      </div>

      {/* Row 3: High Priority Alerts & Recent Maintenance Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* C. High-Priority Alerts (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                High-Priority Infrastructure Alerts
              </h3>
            </div>
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {alerts.length} Active Warnings
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-2">
            {alerts.slice(0, 4).map(alert => (
              <div key={alert.id} className="py-3.5 first:pt-2 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {alert.assetId}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {alert.assetName}
                      </span>
                      <span className="text-slate-400 text-[11px]">· {alert.ward}</span>
                    </div>

                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium leading-normal">
                      {alert.predictedIssue}
                    </p>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Action:</span>
                      <span>{alert.recommendedAction}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        alert.riskLevel === 'Critical'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400'
                      }`}
                    >
                      {alert.timeframe}
                    </span>

                    <button
                      onClick={() => openAssetDetail(alert.assetId)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 rounded-md transition-colors cursor-pointer"
                    >
                      View Digital Memory →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* D. Recent Maintenance Activity (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent Maintenance Activity
                </h3>
              </div>
              <button
                onClick={() => setActivePage('maintenance')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-1">
              {maintenanceRecords.slice(0, 4).map(rec => (
                <div key={rec.id} className="py-3 first:pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                      {rec.assetName}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                        rec.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : rec.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                          : rec.status === 'Scheduled'
                          ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>{rec.maintenanceType}</span>
                    <span className="font-mono tabular-nums">{rec.date}</span>
                  </div>

                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                    Dept: {rec.department}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActivePage('maintenance')}
            className="w-full mt-4 py-2 text-center text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#17243A] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Log or Schedule Maintenance →
          </button>
        </div>
      </div>

      {/* AI DIAGNOSTIC MODAL (Details on Click) */}
      {showAiModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowAiModal(false)}
        >
          <div
            className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto text-xs"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-[#17243A]/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  AI Diagnostic Deep Dive
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/50 space-y-1">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                  Critical Vulnerability Identified
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Ward 12 &amp; Ward 15 Stormwater Inundation
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  Three primary drainage assets in Indiranagar and Koramangala exhibit severe recurring failure patterns. Heavy silt accumulation combined with Doppler rainfall radar forecasts predicts an 86% probability of severe road inundation within 7 days.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-[#17243A] rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Failure Probability</span>
                  <span className="text-lg font-bold font-mono text-rose-600">86% Risk</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#17243A] rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Recommended Window</span>
                  <span className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">&lt; 7 Days</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Prescribed Engineering Actions:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside bg-slate-50 dark:bg-[#17243A] p-3 rounded-xl">
                  <li>Deploy automated hydro-jetting silt extraction along 100ft arterial conduits.</li>
                  <li>Clear solid debris accumulation at junction SWD-1042 outfall.</li>
                  <li>Schedule pre-monsoon drone telemetry verification by Friday.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 bg-slate-50/50 dark:bg-[#17243A]/50">
              <button
                onClick={() => {
                  setShowAiModal(false);
                  setActivePage('prediction');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Go to Predictions Center
              </button>
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
