import React, { useState } from 'react';

// --- Interactive Donut Chart ---
interface DonutData {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutData[];
  totalLabel?: string;
  totalSub?: string;
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  totalLabel,
  totalSub = 'Total Monitored',
  size = 200
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100 dark:text-slate-800/80"
          />
          {data.map((item, index) => {
            const percentage = total > 0 ? item.value / total : 0;
            const strokeDasharray = `${percentage * circumference} ${circumference}`;
            const strokeDashoffset = -(accumulatedPercent * circumference);
            accumulatedPercent += percentage;

            const isHovered = hoveredIdx === index;

            return (
              <circle
                key={item.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
            {hoveredIdx !== null ? data[hoveredIdx].value.toLocaleString() : (totalLabel || total.toLocaleString())}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[120px]">
            {hoveredIdx !== null ? data[hoveredIdx].name : totalSub}
          </span>
          {hoveredIdx !== null && total > 0 && (
            <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
              {((data[hoveredIdx].value / total) * 100).toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {data.map((item, index) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
          const isHovered = hoveredIdx === index;
          return (
            <button
              key={item.name}
              type="button"
              className={`flex items-center justify-between text-left text-xs p-1.5 rounded-md transition-colors ${
                isHovered ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
              </div>
              <span className="font-mono tabular-nums text-slate-900 dark:text-white font-medium ml-2 shrink-0">
                {item.value} <span className="text-slate-400 text-[10px]">({pct}%)</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- Failure Trend Line & Area Chart ---
interface TrendPoint {
  period: string;
  historical: number;
  predicted: number;
  prevented: number;
}

interface FailureTrendChartProps {
  data: TrendPoint[];
  height?: number;
}

export const FailureTrendChart: React.FC<FailureTrendChartProps> = ({
  data,
  height = 240
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => Math.max(d.historical, d.predicted, d.prevented)), 10) * 1.15;
  const paddingX = 40;
  const paddingY = 24;
  const width = 640;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const getX = (idx: number) => paddingX + (idx / (data.length - 1)) * chartW;
  const getY = (val: number) => height - paddingY - (val / maxVal) * chartH;

  // Paths
  const histPoints = data.map((d, i) => `${getX(i)},${getY(d.historical)}`).join(' ');
  const predPoints = data.map((d, i) => `${getX(i)},${getY(d.predicted)}`).join(' ');
  const prevPoints = data.map((d, i) => `${getX(i)},${getY(d.prevented)}`).join(' ');

  const activeItem = activeIdx !== null ? data[activeIdx] : null;

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500 rounded-full" />
            <span>Historical Failures</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-500 rounded-full" />
            <span>AI Predicted Failures</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
            <span>Prevented Interventions</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          style={{ minWidth: 480 }}
          onMouseLeave={() => setActiveIdx(null)}
        >
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - paddingY - pct * chartH;
            const val = Math.round(pct * maxVal);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-slate-100 dark:text-slate-800"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500 tabular-nums"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Lines */}
          <polyline
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={prevPoints}
          />
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeDasharray="5 4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={predPoints}
          />
          <polyline
            fill="none"
            stroke="#F43F5E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={histPoints}
          />

          {/* Interactive vertical hover indicator */}
          {activeIdx !== null && (
            <line
              x1={getX(activeIdx)}
              y1={paddingY}
              x2={getX(activeIdx)}
              y2={height - paddingY}
              stroke="currentColor"
              className="text-slate-400 dark:text-slate-500"
              strokeDasharray="3 3"
            />
          )}

          {/* Data Points */}
          {data.map((d, i) => {
            const x = getX(i);
            const isHovered = activeIdx === i;
            return (
              <g key={d.period} className="cursor-pointer" onMouseEnter={() => setActiveIdx(i)}>
                {/* Invisible hover touch zone */}
                <rect
                  x={x - chartW / (data.length * 2)}
                  y={paddingY}
                  width={chartW / data.length}
                  height={chartH}
                  fill="transparent"
                />

                {/* Point circles */}
                {d.historical > 0 && (
                  <circle
                    cx={x}
                    cy={getY(d.historical)}
                    r={isHovered ? 5 : 3.5}
                    fill="#F43F5E"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="transition-transform duration-200"
                  />
                )}
                {d.predicted > 0 && (
                  <circle
                    cx={x}
                    cy={getY(d.predicted)}
                    r={isHovered ? 5 : 3.5}
                    fill="#3B82F6"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="transition-transform duration-200"
                  />
                )}
                {d.prevented > 0 && (
                  <circle
                    cx={x}
                    cy={getY(d.prevented)}
                    r={isHovered ? 5 : 3.5}
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="transition-transform duration-200"
                  />
                )}

                {/* X Axis Labels */}
                <text
                  x={x}
                  y={height - 6}
                  textAnchor="middle"
                  className={`text-[10px] font-mono tabular-nums ${
                    isHovered
                      ? 'fill-slate-900 dark:fill-white font-semibold'
                      : 'fill-slate-500 dark:fill-slate-400'
                  }`}
                >
                  {d.period}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating tooltip */}
      {activeItem && activeIdx !== null && (
        <div
          className="absolute z-10 pointer-events-none p-2.5 rounded-lg bg-slate-900/95 text-white dark:bg-slate-800/95 dark:text-slate-100 shadow-xl border border-slate-700 text-xs backdrop-blur-sm -translate-y-full -translate-x-1/2"
          style={{
            left: `${(getX(activeIdx) / width) * 100}%`,
            top: `${getY(Math.max(activeItem.historical, activeItem.predicted, activeItem.prevented)) - 12}px`
          }}
        >
          <div className="font-semibold text-slate-200 border-b border-slate-700 pb-1 mb-1 font-mono text-[11px]">
            {activeItem.period}
          </div>
          <div className="space-y-1 font-mono tabular-nums text-[11px]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-rose-400">Historical Failures:</span>
              <span className="font-bold">{activeItem.historical}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-blue-400">AI Predicted:</span>
              <span className="font-bold">{activeItem.predicted}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-emerald-400">Prevented:</span>
              <span className="font-bold">{activeItem.prevented}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Horizontal Risk Bar Chart ---
interface RiskBarItem {
  label: string;
  subLabel?: string;
  critical: number;
  high: number;
  moderate: number;
  healthy: number;
  total: number;
  avgRisk: number;
}

export const HorizontalRiskBarChart: React.FC<{ items: RiskBarItem[]; onSelect?: (label: string) => void }> = ({
  items,
  onSelect
}) => {
  return (
    <div className="space-y-3.5">
      {items.map(item => {
        const critPct = (item.critical / item.total) * 100;
        const highPct = (item.high / item.total) * 100;
        const modPct = (item.moderate / item.total) * 100;
        const healthyPct = (item.healthy / item.total) * 100;

        return (
          <div
            key={item.label}
            onClick={() => onSelect?.(item.label)}
            className="group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.label}
                </span>
                {item.subLabel && (
                  <span className="text-slate-400 dark:text-slate-500 text-[11px]">· {item.subLabel}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-right">
                <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums text-[11px]">
                  {item.total} Assets
                </span>
                <span
                  className={`font-mono tabular-nums font-semibold text-[11px] px-1.5 py-0.5 rounded ${
                    item.avgRisk >= 40
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                      : item.avgRisk >= 30
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  Risk: {item.avgRisk.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Stacked bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
              {item.critical > 0 && (
                <div
                  style={{ width: `${critPct}%` }}
                  className="h-full bg-rose-500 transition-all duration-300"
                  title={`Critical: ${item.critical} (${critPct.toFixed(1)}%)`}
                />
              )}
              {item.high > 0 && (
                <div
                  style={{ width: `${highPct}%` }}
                  className="h-full bg-orange-500 transition-all duration-300"
                  title={`High: ${item.high} (${highPct.toFixed(1)}%)`}
                />
              )}
              {item.moderate > 0 && (
                <div
                  style={{ width: `${modPct}%` }}
                  className="h-full bg-amber-400 transition-all duration-300"
                  title={`Moderate: ${item.moderate} (${modPct.toFixed(1)}%)`}
                />
              )}
              {item.healthy > 0 && (
                <div
                  style={{ width: `${healthyPct}%` }}
                  className="h-full bg-emerald-500 transition-all duration-300"
                  title={`Healthy: ${item.healthy} (${healthyPct.toFixed(1)}%)`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
