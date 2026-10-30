import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Building2,
  TrendingDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { WARDS_SUMMARY, CATEGORY_RISK_STATS, FAILURE_TREND_DATA } from '../../data/mockData';
import { ExportReportModal } from '../common/Modals';

export const ReportsPage: React.FC = () => {
  const { assets, maintenanceRecords, openAssetDetail } = useApp();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedReportTab, setSelectedReportTab] = useState<'health' | 'maintenance' | 'ward' | 'prediction'>('health');
  const [dateRange, setDateRange] = useState('Current Fiscal Year (2026-27)');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
              Municipal Analytics
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">BBMP Smart Infrastructure</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Reports &amp; Intelligence Briefs
          </h2>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-[#17243A] dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official Dossier</span>
          </button>
        </div>
      </div>

      {/* Report Segmented Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#263449] pb-2 text-xs">
        <button
          onClick={() => setSelectedReportTab('health')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            selectedReportTab === 'health'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Infrastructure Health Report
        </button>
        <button
          onClick={() => setSelectedReportTab('maintenance')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            selectedReportTab === 'maintenance'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Maintenance Efficiency &amp; SLA
        </button>
        <button
          onClick={() => setSelectedReportTab('ward')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            selectedReportTab === 'ward'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Ward-Wise Risk Index
        </button>
        <button
          onClick={() => setSelectedReportTab('prediction')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
            selectedReportTab === 'prediction'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          AI Prediction Validation Summary
        </button>
      </div>

      {/* Tab 1: Infrastructure Health Report */}
      {selectedReportTab === 'health' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              Infrastructure Category Health Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Comprehensive breakdown across public asset portfolios
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#17243A] text-slate-600 dark:text-slate-300 font-semibold border-y border-slate-200 dark:border-[#263449]">
                  <tr>
                    <th className="py-2.5 px-3">Asset Category</th>
                    <th className="py-2.5 px-3 font-mono text-right">Monitored Assets</th>
                    <th className="py-2.5 px-3 font-mono text-right">Critical Risk</th>
                    <th className="py-2.5 px-3 font-mono text-right">High Risk</th>
                    <th className="py-2.5 px-3 font-mono text-right">Healthy Assets</th>
                    <th className="py-2.5 px-3 font-mono text-right">Avg Risk Score</th>
                    <th className="py-2.5 px-3">Primary Vulnerability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {CATEGORY_RISK_STATS.map(stat => (
                    <tr key={stat.category} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                        {stat.category}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-right text-slate-700 dark:text-slate-300">
                        {stat.total}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-right font-bold text-rose-600 dark:text-rose-400">
                        {stat.critical}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-right text-orange-600 dark:text-orange-400">
                        {stat.high}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-right text-emerald-600 dark:text-emerald-400">
                        {stat.healthy}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-right font-bold">
                        {stat.avgRisk.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {stat.category === 'Stormwater Drain' ? 'Pre-monsoon silt choked culvert throats' :
                         stat.category === 'Road' ? 'Subgrade moisture infiltration & rutting' :
                         stat.category === 'Water Pipeline' ? 'Water hammer pressure surge bursts' :
                         stat.category === 'Streetlight' ? 'Lightning surge diverter trip' :
                         'Expansion joint elastomeric seal fatigue'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Maintenance Efficiency */}
      {selectedReportTab === 'maintenance' && (
        <div className="p-5 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Preventive vs Reactive Maintenance Ratio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target: &gt;85% preventive interventions vs emergency repairs
              </p>
            </div>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              Current: 91.4% Preventive
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#17243A]">
              <span className="text-slate-500">Average Intervention Time</span>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                4.2 Hours
              </div>
              <span className="text-[11px] text-emerald-600">Reduced by 48% with AI warnings</span>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#17243A]">
              <span className="text-slate-500">Municipal Budget Utilization</span>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                ₹1.24 Cr / ₹1.80 Cr
              </div>
              <span className="text-[11px] text-blue-600">68.8% allocated to high-risk zones</span>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#17243A]">
              <span className="text-slate-500">Citizen Complaints Averted</span>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                340+ Grievances
              </div>
              <span className="text-[11px] text-emerald-600">Estimated grievance reduction</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Ward-Wise Risk Index */}
      {selectedReportTab === 'ward' && (
        <div className="p-5 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
            Ward-Wise Vulnerability &amp; Monsoon Risk Index
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Aggregated composite vulnerability metrics across monitored zones
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#17243A] text-slate-600 dark:text-slate-300 font-semibold border-y border-slate-200 dark:border-[#263449]">
                <tr>
                  <th className="py-2.5 px-3">Ward Name</th>
                  <th className="py-2.5 px-3">Zone</th>
                  <th className="py-2.5 px-3 font-mono text-right">Total Assets</th>
                  <th className="py-2.5 px-3 font-mono text-right">Avg Risk Score</th>
                  <th className="py-2.5 px-3 font-mono text-right">Pothole Index</th>
                  <th className="py-2.5 px-3 font-mono text-right">Monsoon Flood Index</th>
                  <th className="py-2.5 px-3">Civil Action Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {WARDS_SUMMARY.map(ward => (
                  <tr key={ward.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {ward.name}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {ward.zone}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-right text-slate-700 dark:text-slate-300">
                      {ward.totalAssets}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-right font-bold">
                      {ward.averageRiskScore.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-right text-orange-600">
                      {ward.potholeVulnerabilityIndex} / 100
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-right text-rose-600 font-bold">
                      {ward.monsoonFloodRiskIndex} / 100
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          ward.monsoonFloodRiskIndex >= 75
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                            : ward.monsoonFloodRiskIndex >= 50
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        }`}
                      >
                        {ward.monsoonFloodRiskIndex >= 75 ? 'Urgent Culvert Desilt' :
                         ward.potholeVulnerabilityIndex >= 70 ? 'Asphalt Resurfacing' : 'Routine Monitoring'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: AI Prediction Validation */}
      {selectedReportTab === 'prediction' && (
        <div className="p-5 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                AI Model Accuracy &amp; Historical Validation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluation of past 12 months predictions vs physical inspection ground truth
              </p>
            </div>
            <span className="font-mono text-purple-600 dark:text-purple-400 font-bold text-sm">
              93.4% Overall Precision
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#17243A] space-y-2">
              <span className="font-semibold text-slate-900 dark:text-white block">
                Validation Case Study: Stormwater Culvert Desilting
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                In May 2026, CityMemory flagged 4 culverts in Ward 12 with 88% predicted flood hazard. BBMP dispatched preventive super-suckers. During the subsequent 65mm downpour on June 18, zero residential flooding occurred in that sector.
              </p>
              <div className="pt-2 text-[10px] text-emerald-600 font-mono font-medium">
                Status: Verified Success · ₹18.5L Damages Prevented
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#17243A] space-y-2">
              <span className="font-semibold text-slate-900 dark:text-white block">
                Validation Case Study: Koramangala 14th Main Feeder
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Acoustic hydrophone telemetry matched cavitation water hammer spikes. Joint reinforcement clamped the pipe 4 days prior to a scheduled booster test that would have ruptured the degraded DI joint.
              </p>
              <div className="pt-2 text-[10px] text-emerald-600 font-mono font-medium">
                Status: Verified Success · 400,000L Water Loss Prevented
              </div>
            </div>
          </div>
        </div>
      )}

      <ExportReportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </div>
  );
};
