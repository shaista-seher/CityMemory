import React, { useState } from 'react';
import { X, Search, PlusCircle, Wrench, FileDown, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { InfrastructureCategory, AssetCondition } from '../../types';

// --- ADD ASSET MODAL ---
export const AddAssetModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addAsset } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<InfrastructureCategory>('Stormwater Drain');
  const [ward, setWard] = useState('Ward 12 (Indiranagar)');
  const [zone, setZone] = useState('East Zone');
  const [lat, setLat] = useState('12.9750');
  const [lng, setLng] = useState('77.6410');
  const [installationDate, setInstallationDate] = useState('2023-01-15');
  const [condition, setCondition] = useState<AssetCondition>('Good');
  const [department, setDepartment] = useState('BBMP Stormwater Drain Division');
  const [criticality, setCriticality] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [nextMaintenance, setNextMaintenance] = useState('2027-01-15');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a descriptive asset name.');
      return;
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      setError('Please provide valid decimal coordinates.');
      return;
    }

    addAsset({
      name: name.trim(),
      category,
      ward,
      zone,
      coordinates: [parsedLat, parsedLng],
      installationDate,
      currentCondition: condition,
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextScheduledMaintenance: nextMaintenance,
      responsibleDepartment: department,
      status: condition === 'Critical' || condition === 'Poor' ? 'Degraded' : 'Operational',
      criticality,
      recommendedAction: 'Standard lifecycle telemetry verification and baseline structural inspection.'
    });

    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch (e) { /* ignore */ }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Register Civic Infrastructure Asset</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Add new public infrastructure to the CityMemory monitoring network.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Asset Name & Specific Chainage *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 100ft Road Primary Stormwater Culvert"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Infrastructure Category</label>
              <select
                value={category}
                onChange={e => {
                  const cat = e.target.value as InfrastructureCategory;
                  setCategory(cat);
                  if (cat === 'Stormwater Drain') setDepartment('BBMP Stormwater Drain Division');
                  else if (cat === 'Road') setDepartment('BBMP Road Infrastructure Cell');
                  else if (cat === 'Water Pipeline') setDepartment('BWSSB Water Supply & Sewerage Board');
                  else if (cat === 'Streetlight') setDepartment('BESCOM Electrical Grid & Lighting');
                  else if (cat === 'Bridge & Flyover') setDepartment('BBMP Major Bridge Infrastructure');
                  else setDepartment('BBMP Public Works & Buildings');
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Stormwater Drain">Stormwater Drain</option>
                <option value="Road">Road</option>
                <option value="Water Pipeline">Water Pipeline</option>
                <option value="Streetlight">Streetlight</option>
                <option value="Bridge & Flyover">Bridge & Flyover</option>
                <option value="Public Building">Public Building</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Location / Ward</label>
              <select
                value={ward}
                onChange={e => {
                  setWard(e.target.value);
                  if (e.target.value.includes('Indiranagar')) { setZone('East Zone'); setLat('12.9784'); setLng('77.6408'); }
                  else if (e.target.value.includes('Malleshwaram')) { setZone('West Zone'); setLat('13.0031'); setLng('77.5714'); }
                  else if (e.target.value.includes('Koramangala')) { setZone('South Zone'); setLat('12.9344'); setLng('77.6254'); }
                  else if (e.target.value.includes('Hebbal')) { setZone('North Zone'); setLat('13.0358'); setLng('77.5970'); }
                  else if (e.target.value.includes('Whitefield')) { setZone('Mahadevapura Zone'); setLat('12.9691'); setLng('77.7289'); }
                  else { setZone('South Zone'); setLat('12.9562'); setLng('77.5684'); }
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Ward 12 (Indiranagar)">Ward 12 (Indiranagar)</option>
                <option value="Ward 08 (Malleshwaram)">Ward 08 (Malleshwaram)</option>
                <option value="Ward 15 (Koramangala)">Ward 15 (Koramangala)</option>
                <option value="Ward 04 (Hebbal)">Ward 04 (Hebbal)</option>
                <option value="Ward 22 (Whitefield)">Ward 22 (Whitefield)</option>
                <option value="Ward 31 (Jayanagar)">Ward 31 (Jayanagar)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Latitude</label>
              <input
                type="text"
                value={lat}
                onChange={e => setLat(e.target.value)}
                className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Longitude</label>
              <input
                type="text"
                value={lng}
                onChange={e => setLng(e.target.value)}
                className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Installation Date</label>
              <input
                type="date"
                value={installationDate}
                onChange={e => setInstallationDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Current Condition</label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as AssetCondition)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Criticality</label>
              <select
                value={criticality}
                onChange={e => setCriticality(e.target.value as 'High' | 'Medium' | 'Low')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Responsible Civic Department</label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Asset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- ADD MAINTENANCE MODAL ---
export const AddMaintenanceModal: React.FC<{ isOpen: boolean; onClose: () => void; preselectedAssetId?: string }> = ({
  isOpen,
  onClose,
  preselectedAssetId
}) => {
  const { assets, addMaintenanceRecord } = useApp();

  const [assetId, setAssetId] = useState(preselectedAssetId || (assets[0]?.id || ''));
  const [maintenanceType, setMaintenanceType] = useState<any>('Desilting');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'Scheduled' | 'In Progress' | 'Completed' | 'Overdue'>('Scheduled');
  const [cost, setCost] = useState('75000');
  const [technician, setTechnician] = useState('Er. R. Venkatesh');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentAsset = assets.find(a => a.id === assetId) || assets[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Please provide engineering inspection / work notes.');
      return;
    }

    if (!currentAsset) return;

    addMaintenanceRecord({
      assetId: currentAsset.id,
      assetName: currentAsset.name,
      ward: currentAsset.ward,
      category: currentAsset.category,
      maintenanceType,
      date,
      status,
      department: currentAsset.responsibleDepartment,
      technician: technician.trim() || 'Lead Engineer',
      cost: parseInt(cost) || 0,
      notes: notes.trim(),
      completionDate: status === 'Completed' ? date : undefined
    });

    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    } catch (e) { /* ignore */ }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Log Maintenance Action</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Record preventive or corrective engineering intervention.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Target Asset *</label>
            <select
              value={assetId}
              onChange={e => setAssetId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
            >
              {assets.map(a => (
                <option key={a.id} value={a.id}>
                  [{a.id}] {a.name} ({a.ward})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Intervention Type</label>
              <select
                value={maintenanceType}
                onChange={e => setMaintenanceType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Desilting">Desilting</option>
                <option value="Routine Cleaning">Routine Cleaning</option>
                <option value="Pothole Patching">Pothole Patching</option>
                <option value="Preventive Resurfacing">Preventive Resurfacing</option>
                <option value="Valve Overhaul">Valve Overhaul</option>
                <option value="Structural Retrofit">Structural Retrofit</option>
                <option value="Cable Replacement">Cable Replacement</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Execution Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Execution Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Sanctioned Cost (₹ INR)</label>
              <input
                type="number"
                value={cost}
                onChange={e => setCost(e.target.value)}
                className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Assigned Supervising Engineer</label>
            <input
              type="text"
              value={technician}
              onChange={e => setTechnician(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Engineering Notes & Observations *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detail the work carried out, machinery deployed, or condition findings..."
              value={notes}
              onChange={e => { setNotes(e.target.value); setError(''); }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs transition-colors"
            >
              <Wrench className="w-4 h-4" />
              <span>Log Maintenance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- GLOBAL SEARCH COMMAND PALETTE ---
export const CommandPaletteModal: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    assets,
    openAssetDetail,
    setActivePage,
    setSelectedWard
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const filteredAssets = query.trim()
    ? assets.filter(
        a =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.id.toLowerCase().includes(query.toLowerCase()) ||
          a.ward.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : assets.slice(0, 4);

  const pages = [
    { name: 'Dashboard', key: 'overview', desc: 'KPIs and charts' },
    { name: 'Complaints', key: 'operations', desc: 'Jurisdiction complaint management' },
    { name: 'Priority Queue', key: 'risk', desc: 'Hazard rankings' },
    { name: 'Infrastructure Map', key: 'map', desc: 'Geographic map view' },
    { name: 'Departments', key: 'registry', desc: 'Asset registry' },
    { name: 'Analytics', key: 'reports', desc: 'Reports and metrics' },
    { name: 'Failure Predictions', key: 'prediction', desc: 'Predictive forecasts' },
    { name: 'Maintenance History', key: 'maintenance', desc: 'Work order logs' }
  ].filter(p => !query.trim() || p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-xl shadow-2xl max-w-xl w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search assets, wards, risk alerts, or jump to page... (Esc to exit)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3 text-xs">
          {/* Assets Matches */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Infrastructure Assets
            </div>
            {filteredAssets.length === 0 ? (
              <div className="px-3 py-2 text-slate-400">No assets matching search</div>
            ) : (
              filteredAssets.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => {
                    openAssetDetail(asset.id);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{asset.id}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{asset.name}</span>
                    <span className="text-slate-400 text-[11px] truncate">· {asset.ward}</span>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                      asset.riskLevel === 'Critical'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        : asset.riskLevel === 'High'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    }`}
                  >
                    Risk: {asset.riskScore}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Page Matches */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Navigation Pages
            </div>
            {pages.map(page => (
              <button
                key={page.key}
                onClick={() => {
                  setActivePage(page.key as any);
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{page.name}</div>
                  <div className="text-[11px] text-slate-400">{page.desc}</div>
                </div>
                <span className="text-[10px] text-slate-400">Jump →</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- EXPORT REPORT MODAL ---
export const ExportReportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { assets } = useApp();
  const [format, setFormat] = useState<'csv' | 'summary'>('csv');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    if (format === 'csv') {
      const headers = ['Asset ID', 'Name', 'Category', 'Ward', 'Zone', 'Condition', 'Risk Score', 'Last Maintenance', 'Responsible Department'];
      const rows = assets.map(a => [
        a.id,
        `"${a.name.replace(/"/g, '""')}"`,
        a.category,
        `"${a.ward}"`,
        a.zone,
        a.currentCondition,
        a.riskScore,
        a.lastMaintenance,
        `"${a.responsibleDepartment}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `CityMemory_Civic_Infrastructure_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
    } catch (e) { /* ignore */ }

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-xl shadow-2xl max-w-md w-full p-6 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Export Civic Infrastructure Intelligence</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Generate an official municipal dispatch containing current asset health ratings, predicted failure timeframes, and preventive intervention orders.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`p-3 rounded-lg border text-left transition-all ${
                format === 'csv'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-slate-900 dark:text-white mb-0.5">Spreadsheet (CSV)</div>
              <div className="text-[11px] text-slate-500">Full telemetry data for Excel or GIS processing.</div>
            </button>

            <button
              type="button"
              onClick={() => setFormat('summary')}
              className={`p-3 rounded-lg border text-left transition-all ${
                format === 'summary'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-slate-900 dark:text-white mb-0.5">Printable Brief</div>
              <div className="text-[11px] text-slate-500">Executive report formatted for municipal review.</div>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs transition-colors"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Download Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
