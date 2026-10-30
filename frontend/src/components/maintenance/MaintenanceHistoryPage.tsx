import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building,
  DollarSign,
  ArrowRight,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddMaintenanceModal } from '../common/Modals';
import { MaintenanceRecord } from '../../types';

export const MaintenanceHistoryPage: React.FC = () => {
  const { maintenanceRecords, openAssetDetail, selectedWard } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter
  const filtered = maintenanceRecords.filter(rec => {
    const matchesSearch =
      rec.assetName.toLowerCase().includes(search.toLowerCase()) ||
      rec.assetId.toLowerCase().includes(search.toLowerCase()) ||
      rec.technician.toLowerCase().includes(search.toLowerCase()) ||
      rec.notes.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    const matchesDept = deptFilter === 'All' || rec.department.includes(deptFilter);
    const matchesWard = selectedWard === 'All Wards' || rec.ward === selectedWard;

    return matchesSearch && matchesStatus && matchesDept && matchesWard;
  });

  // Metrics
  const totalCost = maintenanceRecords.reduce((acc, r) => acc + (r.cost || 0), 0);
  const scheduledCount = maintenanceRecords.filter(r => r.status === 'Scheduled').length;
  const inProgressCount = maintenanceRecords.filter(r => r.status === 'In Progress').length;
  const completedCount = maintenanceRecords.filter(r => r.status === 'Completed').length;
  const overdueCount = maintenanceRecords.filter(r => r.status === 'Overdue').length;

  const exportCsv = () => {
    const headers = ['Record ID', 'Asset ID', 'Asset Name', 'Ward', 'Intervention Type', 'Date', 'Status', 'Cost (INR)', 'Supervising Engineer', 'Notes'];
    const rows = filtered.map(r => [
      r.id,
      r.assetId,
      `"${r.assetName.replace(/"/g, '""')}"`,
      `"${r.ward}"`,
      r.maintenanceType,
      r.date,
      r.status,
      r.cost,
      `"${r.technician}"`,
      `"${r.notes.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `CityMemory_Maintenance_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Scheduled Work Orders</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums mt-1">
            {scheduledCount}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">In Progress</span>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums mt-1">
            {inProgressCount}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed (YTD)</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
            {completedCount}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Expenditure</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums mt-1">
            ₹{(totalCost / 100000).toFixed(2)}L
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search work orders, engineers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="BBMP">BBMP Stormwater &amp; Roads</option>
            <option value="BWSSB">BWSSB Water &amp; Sewerage</option>
            <option value="BESCOM">BESCOM Lighting &amp; Grid</option>
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-[#17243A] dark:hover:bg-[#1f304d] rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Logs</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Maintenance</span>
          </button>
        </div>
      </div>

      {/* Maintenance Records Table */}
      <div className="rounded-xl border border-slate-200 dark:border-[#263449] bg-white dark:bg-[#111C2E] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-[#17243A]/80 border-b border-slate-200 dark:border-[#263449] text-slate-600 dark:text-slate-300 font-semibold">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Target Asset</th>
                <th className="py-3 px-4">Intervention Type</th>
                <th className="py-3 px-4">Ward</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4">Supervising Engineer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map(record => (
                <tr key={record.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                    {record.id}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {record.assetId}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white max-w-xs truncate">
                        {record.assetName}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap font-medium">
                    {record.maintenanceType}
                  </td>

                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {record.ward}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {record.date}
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    ₹{(record.cost).toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {record.technician}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        record.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : record.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          : record.status === 'Scheduled'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openAssetDetail(record.assetId)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-[11px]"
                    >
                      Asset Memory →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddMaintenanceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
