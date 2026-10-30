import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  Clock,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Info,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddMaintenanceModal } from '../common/Modals';

export const AIPredictionsPage: React.FC = () => {
  const { aiPredictions, openAssetDetail, runAiAnalysis, isAnalyzing } = useApp();

  const [selectedPredId, setSelectedPredId] = useState(aiPredictions[0]?.id || 'PRED-1099');
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);

  const selectedPrediction = aiPredictions.find(p => p.id === selectedPredId) || aiPredictions[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Failure Predictions ({aiPredictions.length})
        </h1>

        <button
          onClick={() => runAiAnalysis()}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-75 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
        </button>
      </div>

      {/* Main Grid: Forecast List (4 cols) + In-depth Prediction Dossier (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Forecast Cards List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block px-1">
            Active Failure Forecasts ({aiPredictions.length})
          </span>

          <div className="space-y-2.5">
            {aiPredictions.map(pred => {
              const isSelected = pred.id === selectedPrediction.id;
              return (
                <div
                  key={pred.id}
                  onClick={() => setSelectedPredId(pred.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-600 dark:border-blue-500 shadow-xs'
                      : 'bg-white dark:bg-[#111C2E] border-slate-200 dark:border-[#263449] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {pred.assetId}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                        pred.riskScore >= 90
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400'
                      }`}
                    >
                      Risk: {pred.riskScore}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {pred.assetName}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {pred.ward} · {pred.category}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <span className="text-rose-600 dark:text-rose-400 font-medium">
                      Window: {pred.estimatedTimeframe}
                    </span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {pred.preventiveSavings}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: In-depth Prediction Dossier */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                    {selectedPrediction.assetId}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{selectedPrediction.ward}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {selectedPrediction.assetName}
                </h3>
              </div>

              <button
                onClick={() => openAssetDetail(selectedPrediction.assetId)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
              >
                <span>Full Digital Memory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* A. FAILURE RISK SCORE & CONFIDENCE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                <span className="text-[10px] uppercase font-semibold text-rose-700 dark:text-rose-400 tracking-wider">
                  Failure Risk Score
                </span>
                <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
                  {selectedPrediction.riskScore} <span className="text-xs text-rose-500 font-sans">/ 100</span>
                </div>
                <span className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">
                  Classification: Imminent Breakdown
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                <span className="text-[10px] uppercase font-semibold text-purple-700 dark:text-purple-400 tracking-wider">
                  Model Confidence
                </span>
                <div className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
                  {selectedPrediction.confidence}%
                </div>
                <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                  High-Precision Pattern Match
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                <span className="text-[10px] uppercase font-semibold text-blue-700 dark:text-blue-400 tracking-wider">
                  Estimated Failure Timeframe
                </span>
                <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                  {selectedPrediction.estimatedTimeframe}
                </div>
                <span className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                  Intervention Window
                </span>
              </div>
            </div>

            {/* B. PREDICTION SUMMARY */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Predicted Failure Mode &amp; Mechanism
              </span>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#17243A] border border-slate-200/80 dark:border-slate-700/80 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">
                  {selectedPrediction.likelyFailureType}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  CityMemory detected convergence across three predictive indicators: historic failure frequency during monsoon months, acoustic resonant shift, and elapsed maintenance interval exceeding the safe reliability threshold.
                </p>
              </div>
            </div>

            {/* C. CONTRIBUTING FACTORS BREAKDOWN */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Quantified Contributing Factors
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {selectedPrediction.contributingFactors.map((factor, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-[#17243A] border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{factor.label}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {factor.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${factor.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Patterns Influencing Prediction */}
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-2">
                Historical Memory Precedents
              </span>
              <div className="space-y-1.5 text-xs">
                {selectedPrediction.historicalFactors.map((fact, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#17243A] text-slate-700 dark:text-slate-300 text-[11px]"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* D. RECOMMENDED ACTION & PREVENTIVE SAVINGS */}
            <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Mandatory Preventive Action Order</span>
                </div>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                  {selectedPrediction.preventiveSavings}
                </span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                {selectedPrediction.recommendedAction}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">
                  Historical Validation: {selectedPrediction.previousAccuracy}
                </span>

                <button
                  onClick={() => setIsAddMaintenanceOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Issue Work Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddMaintenanceModal
        isOpen={isAddMaintenanceOpen}
        onClose={() => setIsAddMaintenanceOpen(false)}
        preselectedAssetId={selectedPrediction.assetId}
      />
    </div>
  );
};
