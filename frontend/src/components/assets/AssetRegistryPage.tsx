import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  History,
  Wrench,
  Download,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddAssetModal, AddMaintenanceModal } from '../common/Modals';
import { Asset, InfrastructureCategory, RiskLevel } from '../../types';

export const AssetRegistryPage: React.FC = () => {
  const { assets, openAssetDetail, selectedWard } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'riskScore' | 'name' | 'id' | 'installationDate'>('riskScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
  const [preselectedAssetId, setPreselectedAssetId] = useState<string | undefined>(undefined);

  // Filter logic
  const filtered = assets.filter(asset => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.id.toLowerCase().includes(search.toLowerCase()) ||
      asset.ward.toLowerCase().includes(search.toLowerCase()) ||
      asset.responsibleDepartment.toLowerCase().includes(search.toLowerCase());

    const matchesCat = categoryFilter === 'All' || asset.category === categoryFilter;
    const matchesRisk = riskFilter === 'All' || asset.riskLevel === riskFilter;
    const matchesWard = selectedWard === 'All Wards' || asset.ward === selectedWard;

    return matchesSearch && matchesCat && matchesRisk && matchesWard;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'riskScore') cmp = a.riskScore - b.riskScore;
    else if (sortField === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortField === 'id') cmp = a.id.localeCompare(b.id);
    else if (sortField === 'installationDate') cmp = a.installationDate.localeCompare(b.installationDate);
    return sortAsc ? cmp : -cmp;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: 'riskScore' | 'name' | 'id' | 'installationDate') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending
    }
  };

  const exportCsv = () => {
    const headers = ['Asset ID', 'Name', 'Category', 'Ward', 'Installation Date', 'Condition', 'Risk Score', 'Risk Level', 'Last Maintenance', 'Responsible Department'];
    const rows = sorted.map(a => [
      a.id,
      `"${a.name.replace(/"/g, '""')}"`,
      a.category,
      `"${a.ward}"`,
      a.installationDate,
      a.currentCondition,
      a.riskScore,
      a.riskLevel,
      a.lastMaintenance,
      `"${a.responsibleDepartment}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `CityMemory_Asset_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, name, ward, dept..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Stormwater Drain">Stormwater Drains</option>
            <option value="Road">Roads</option>
            <option value="Water Pipeline">Water Pipelines</option>
            <option value="Streetlight">Streetlights</option>
            <option value="Bridge & Flyover">Bridges &amp; Flyovers</option>
            <option value="Public Building">Public Buildings</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={e => { setRiskFilter(e.target.value); setCurrentPage(1); }}
            className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="Healthy">Healthy</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-[#17243A] dark:hover:bg-[#1f304d] rounded-lg transition-colors cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddAssetOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Asset Table */}
      <div className="rounded-xl border border-slate-200 dark:border-[#263449] bg-white dark:bg-[#111C2E] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-[#17243A]/80 border-b border-slate-200 dark:border-[#263449] text-slate-600 dark:text-slate-300 font-semibold select-none">
              <tr>
                <th
                  onClick={() => toggleSort('id')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Asset ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Asset Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location / Ward</th>
                <th
                  onClick={() => toggleSort('installationDate')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Installed</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Condition</th>
                <th
                  onClick={() => toggleSort('riskScore')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Risk Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Last Serviced</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No infrastructure assets matched your filters.
                  </td>
                </tr>
              ) : (
                paginated.map(asset => (
                  <tr
                    key={asset.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => openAssetDetail(asset.id)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {asset.id}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {asset.name}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {asset.category}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {asset.ward}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {asset.installationDate}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`font-medium ${
                          asset.currentCondition === 'Critical' || asset.currentCondition === 'Poor'
                            ? 'text-rose-600 dark:text-rose-400 font-semibold'
                            : asset.currentCondition === 'Fair'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {asset.currentCondition} ({asset.conditionScore})
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-mono tabular-nums font-bold px-2 py-0.5 rounded text-[11px] ${
                          asset.riskScore >= 80
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                            : asset.riskScore >= 60
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400'
                            : asset.riskScore >= 35
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        }`}
                      >
                        {asset.riskScore}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {asset.lastMaintenance}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                          asset.status === 'Operational'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : asset.status === 'Degraded'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openAssetDetail(asset.id)}
                          className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          title="Open Digital Memory"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setPreselectedAssetId(asset.id);
                            setIsAddMaintenanceOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          title="Log Maintenance"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Count */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-[#263449] bg-slate-50/50 dark:bg-[#17243A]/40 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong className="font-mono text-slate-700 dark:text-slate-300">{paginated.length}</strong> of{' '}
            <strong className="font-mono text-slate-700 dark:text-slate-300">{sorted.length}</strong> filtered assets
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs">
              Page {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddAssetModal isOpen={isAddAssetOpen} onClose={() => setIsAddAssetOpen(false)} />
      <AddMaintenanceModal
        isOpen={isAddMaintenanceOpen}
        onClose={() => setIsAddMaintenanceOpen(false)}
        preselectedAssetId={preselectedAssetId}
      />
    </div>
  );
};
