import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Layers,
  MapPin,
  TrendingUp,
  BarChart2,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HorizontalRiskBarChart } from '../common/Charts';
import { WARDS_SUMMARY, CATEGORY_RISK_STATS } from '../../data/mockData';

export const RiskAnalysisPage: React.FC = () => {
  const { assets, openAssetDetail, setSelectedWard } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedView, setSelectedView] = useState<'ward' | 'category'>('ward');

  // Convert WARDS_SUMMARY to items for HorizontalRiskBarChart
  const wardItems = WARDS_SUMMARY.map(w => ({
    label: w.name,
    subLabel: w.zone,
    critical: w.criticalAssets,
    high: w.highRiskAssets,
    moderate: w.moderateRiskAssets,
    healthy: w.healthyAssets,
    total: w.totalAssets,
    avgRisk: w.averageRiskScore
  }));

  const categoryItems = CATEGORY_RISK_STATS.map(c => ({
    label: c.category,
    critical: c.critical,
    high: c.high,
    moderate: c.moderate,
    healthy: c.healthy,
    total: c.total,
    avgRisk: c.avgRisk
  }));

  // Critical rankings sorted by riskScore desc
  const highRiskRanked = [...assets]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Metric Cards - Clean & Direct */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">City-Wide Risk Index</span>
            <span className="text-[10px] font-mono text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded font-semibold">
              Moderate Risk
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums mt-1">
            34.8 <span className="text-xs text-slate-400 font-sans">/ 100</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Highest Vulnerability Ward</span>
            <span className="text-[10px] font-mono text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded font-semibold">
              Risk: 41.5
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
            Ward 22 (Whitefield)
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Flood Inundation Epicenter</span>
            <span className="text-[10px] font-mono text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded font-semibold">
              Index: 86/100
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
            Ward 15 (Koramangala)
          </div>
        </div>
      </div>

      {/* Main Row: Risk Distribution Bars & Critical Assets Priority Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Distribution Chart (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Vulnerability Distribution
              </h3>

              {/* View toggle */}
              <div className="flex items-center p-0.5 bg-slate-100 dark:bg-[#17243A] rounded-lg self-start sm:self-auto text-xs">
                <button
                  onClick={() => setSelectedView('ward')}
                  className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                    selectedView === 'ward'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  By BBMP Ward
                </button>
                <button
                  onClick={() => setSelectedView('category')}
                  className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                    selectedView === 'category'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  By Category
                </button>
              </div>
            </div>

            <div className="py-4">
              <HorizontalRiskBarChart
                items={selectedView === 'ward' ? wardItems : categoryItems}
                onSelect={label => {
                  if (selectedView === 'ward') {
                    setSelectedWard(label);
                  }
                }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Moderate</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Healthy</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">Click row to filter ward</span>
          </div>
        </div>

        {/* Priority Intervention Rankings (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Priority Queue
                </h3>
              </div>
              <span className="font-mono text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                Ranked by Hazard
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {highRiskRanked.map((asset, idx) => (
                <div
                  key={asset.id}
                  onClick={() => openAssetDetail(asset.id)}
                  className="py-3 group cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="font-mono font-bold text-slate-400 text-xs w-4 mt-0.5">
                        {idx + 1}.
                      </span>
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                            {asset.id}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
                            {asset.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {asset.ward} · {asset.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                          asset.riskScore >= 80
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400'
                        }`}
                      >
                        Risk: {asset.riskScore}
                      </span>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5 font-medium">
                        {asset.estimatedFailureWindow}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => openAssetDetail(highRiskRanked[0].id)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Inspect Highest Risk Asset ({highRiskRanked[0].id})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
