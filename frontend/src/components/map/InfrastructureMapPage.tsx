import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Navigation,
  Compass,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Asset, InfrastructureCategory, RiskLevel } from '../../types';

export const InfrastructureMapPage: React.FC = () => {
  const { assets, openAssetDetail, theme } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(assets[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [mapStyle, setMapStyle] = useState<'streets' | 'humanitarian'>('streets');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.ward.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || asset.category === categoryFilter;
    const matchesRisk = riskFilter === 'All' || asset.riskLevel === riskFilter;
    return matchesSearch && matchesCat && matchesRisk;
  });

  // Risk color mapping
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return '#EF4444';
      case 'High': return '#F97316';
      case 'Moderate': return '#F59E0B';
      case 'Healthy': return '#10B981';
    }
  };

  const getCategoryEmoji = (cat: InfrastructureCategory) => {
    switch (cat) {
      case 'Stormwater Drain': return '🌊';
      case 'Road': return '🛣️';
      case 'Water Pipeline': return '💧';
      case 'Streetlight': return '💡';
      case 'Bridge & Flyover': return '🌉';
      default: return '🏛️';
    }
  };

  // Custom Leaflet DivIcon
  const createMarkerHtml = (asset: Asset) => {
    const color = getRiskColor(asset.riskLevel);
    const emoji = getCategoryEmoji(asset.category);
    const isCritical = asset.riskLevel === 'Critical';

    return `
      <div style="position: relative; width: 34px; height: 34px; cursor: pointer;">
        ${isCritical ? `<div style="position: absolute; inset: -4px; border-radius: 50%; background: ${color}; opacity: 0.35; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
        <div style="
          position: relative;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: ${color};
          border: 2.5px solid #ffffff;
          box-shadow: 0 3px 8px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: transform 0.2s ease;
        ">
          <span>${emoji}</span>
        </div>
      </div>
    `;
  };

  // Initialize Real Leaflet Map with 100% Free OpenStreetMap (NO API KEY REQUIRED)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Bengaluru
      const map = L.map(mapContainerRef.current, {
        center: [12.9716, 77.6200],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // 100% Real OpenStreetMap Layer - NO API KEY REQUIRED, NO WATERMARKS
      const tileUrl = mapStyle === 'humanitarian'
        ? 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileUrl, {
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Force size invalidation so tiles never clip or display gray areas
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } else {
      // Change tile layer if mapStyle changed
      const map = mapInstanceRef.current;
      map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      const tileUrl = mapStyle === 'humanitarian'
        ? 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileUrl, {
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      map.invalidateSize();
    }
  }, [mapStyle]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    filteredAssets.forEach(asset => {
      const customIcon = L.divIcon({
        className: 'citymemory-map-pin',
        html: createMarkerHtml(asset),
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker(asset.coordinates, { icon: customIcon });

      marker.on('click', () => {
        setSelectedAsset(asset);
        setIsInspectorOpen(true);
        mapInstanceRef.current?.flyTo(asset.coordinates, 14, { duration: 0.8 });
      });

      marker.bindTooltip(`<b>${asset.name}</b><br/><span style="color:${getRiskColor(asset.riskLevel)};font-weight:600;">${asset.riskLevel} (${asset.riskScore})</span>`, {
        direction: 'top',
        offset: [0, -14],
        opacity: 0.95
      });

      markersGroup.addLayer(marker);
    });
  }, [filteredAssets]);

  // Recenter map
  const recenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([12.9716, 77.6200], 12, { duration: 0.8 });
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets, IDs, or wards..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Stormwater Drain">Stormwater Drains</option>
            <option value="Road">Roads</option>
            <option value="Water Pipeline">Water Pipelines</option>
            <option value="Streetlight">Streetlights</option>
            <option value="Bridge & Flyover">Bridges &amp; Flyovers</option>
            <option value="Public Building">Public Buildings</option>
          </select>

          {/* Risk Level Dropdown */}
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="Healthy">Healthy</option>
          </select>
        </div>

        {/* Action Controls & Legend */}
        <div className="flex items-center gap-2">
          {/* Layer Mode */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-[#17243A] rounded-xl text-xs">
            <button
              onClick={() => setMapStyle('streets')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                mapStyle === 'streets'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Street Map
            </button>
            <button
              onClick={() => setMapStyle('humanitarian')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                mapStyle === 'humanitarian'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Civic Focus
            </button>
          </div>

          <button
            onClick={recenterMap}
            title="Recenter Map to Bengaluru"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-[#17243A] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Recenter</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative h-[calc(100vh-13.5rem)] min-h-[500px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-[#263449] bg-slate-100 dark:bg-[#111C2E] shadow-xs">
        {/* Real OpenStreetMap Container */}
        <div
          ref={mapContainerRef}
          className={`w-full h-full z-0 ${theme === 'dark' ? 'dark-map-tiles' : ''}`}
        />

        {/* Clean Risk Legend Floating Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/95 dark:bg-[#111C2E]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#263449] shadow-md flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Critical</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="font-mono text-slate-500 dark:text-slate-400">{filteredAssets.length} Assets</span>
        </div>

        {/* Selected Asset Details Drawer / Card */}
        {selectedAsset && isInspectorOpen && (
          <div className="absolute top-4 right-4 z-20 w-80 sm:w-92 bg-white/98 dark:bg-[#111C2E]/98 backdrop-blur-md border border-slate-200 dark:border-[#263449] rounded-2xl shadow-xl p-5 text-xs animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {selectedAsset.id}
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                      selectedAsset.riskLevel === 'Critical'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        : selectedAsset.riskLevel === 'High'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400'
                        : selectedAsset.riskLevel === 'Moderate'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    }`}
                  >
                    {selectedAsset.riskLevel} (Score: {selectedAsset.riskScore})
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {selectedAsset.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedAsset.ward} · {selectedAsset.category}
                </p>
              </div>

              <button
                onClick={() => setIsInspectorOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5 py-3">
              <div className="p-3 bg-slate-50 dark:bg-[#17243A] rounded-xl">
                <span className="text-[10px] text-slate-500 font-medium block">Condition</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                  {selectedAsset.conditionScore}/100
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{selectedAsset.currentCondition}</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#17243A] rounded-xl">
                <span className="text-[10px] text-slate-500 font-medium block">Predicted Window</span>
                <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
                  {selectedAsset.estimatedFailureWindow || 'Stable'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Probability: {selectedAsset.failureProbability || 10}%</span>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-1.5 py-1 text-[11px]">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Commissioned:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{selectedAsset.installationDate.split('-')[0]}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Last Maintenance:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{selectedAsset.lastMaintenance}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Department:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                  {selectedAsset.responsibleDepartment}
                </span>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="my-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
              <span className="font-semibold text-blue-900 dark:text-blue-300 block mb-0.5">
                Recommended Action:
              </span>
              <p className="text-[11px] text-blue-950 dark:text-slate-300 leading-snug">
                {selectedAsset.recommendedAction}
              </p>
            </div>

            {/* Open Detail Button */}
            <button
              onClick={() => openAssetDetail(selectedAsset.id)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>View Asset Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Re-open button if inspector closed */}
        {!isInspectorOpen && selectedAsset && (
          <button
            onClick={() => setIsInspectorOpen(true)}
            className="absolute top-4 right-4 z-20 px-3.5 py-2 bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-xl shadow-md text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Show Details ({selectedAsset.id})
          </button>
        )}
      </div>
    </div>
  );
};
