import React, { useState } from 'react';
import { createComplaint } from '../../services/api';
import {
  Camera,
  MapPin,
  Upload,
  X,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { ComplaintCategory, ComplaintSeverity } from '../../types';

const CATEGORIES: {
  category: ComplaintCategory;
  label: string;
  emoji: string;
  desc: string;
}[] = [
  { category: 'Road damage / potholes', label: 'Road Damage / Potholes', emoji: '🛣️', desc: 'Craters, asphalt cracks, loose gravel, cave-ins' },
  { category: 'Drainage blockage', label: 'Drainage Blockage', emoji: '🌊', desc: 'Choked stormwater culverts, silt, plastic debris' },
  { category: 'Water leakage', label: 'Water Leakage', emoji: '💧', desc: 'Burst mains, pipe weeping, water pressure loss' },
  { category: 'Streetlight malfunction', label: 'Streetlight Malfunction', emoji: '💡', desc: 'Non-functional lamps, flickering luminaires, dark lanes' },
  { category: 'Garbage accumulation', label: 'Garbage Accumulation', emoji: '🗑️', desc: 'Uncollected municipal waste, road dumping' },
  { category: 'Broken public infrastructure', label: 'Broken Infrastructure', emoji: '🏛️', desc: 'Damaged footpaths, broken guardrails, manhole covers' },
  { category: 'Waterlogging / flooding', label: 'Waterlogging / Flooding', emoji: '🌧️', desc: 'Stagnant rain runoff, road submersion' },
  { category: 'Other civic issues', label: 'Other Civic Issues', emoji: '⚠️', desc: 'Any other infrastructure hazard' }
];

export const ReportIssuePage: React.FC = () => {
  const { currentCitizen, submitComplaint, setCitizenActiveTab, openComplaintDetail } = useApp();

  // Form State
  const [category, setCategory] = useState<ComplaintCategory>('Road damage / potholes');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<ComplaintSeverity>('High');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'
  ]);

  // Location State
  const [isLocating, setIsLocating] = useState(false);
  const [locationMode, setLocationMode] = useState<'gps' | 'manual'>('manual');
  const [latitude, setLatitude] = useState(12.9784);
  const [longitude, setLongitude] = useState(77.6408);
  const [address, setAddress] = useState('100ft Road, near Metro Pillar 84, Indiranagar');
  const [ward, setWard] = useState(currentCitizen.ward || 'Ward 12 (Indiranagar)');
  const [municipality] = useState('BBMP Bengaluru');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaintId, setSubmittedComplaintId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Geolocation
  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        setIsLocating(false);
        setLocationMode('gps');
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setAddress(`GPS Pin (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}), ${ward}`);
      },
      err => {
        setIsLocating(false);
        // Fallback gracefully
        alert(`Location permission error: ${err.message}. Using ward centroid.`);
        setLocationMode('manual');
      },
      { timeout: 8000 }
    );
  };

  // Preset Sample Photos
  const addSamplePhoto = (url: string) => {
    if (!images.includes(url)) {
      setImages(prev => [...prev, url]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg('');

  if (!title.trim()) {
    setErrorMsg('Please enter a brief complaint title.');
    return;
  }

  if (!description.trim()) {
    setErrorMsg('Please describe the problem in detail.');
    return;
  }

  if (!address.trim()) {
    setErrorMsg('Please enter the complaint location.');
    return;
  }

  setIsSubmitting(true);

  try {
    const result = await createComplaint({
      title: title.trim(),
      description: description.trim(),
      category:
        category === 'Road damage / potholes' ? 'pothole' :
        category === 'Drainage blockage' ? 'drainage' :
        category === 'Water leakage' ? 'water_supply' :
        category === 'Streetlight malfunction' ? 'streetlight' :
        category === 'Garbage accumulation' ? 'waste' :
        category === 'Broken public infrastructure' ? 'footpath' :
        'other',
      address: `${address.trim()}, ${ward}, Bengaluru`,
      latitude,
      longitude
    });

    const complaintId =
      result.complaint?.id ||
      result.complaint?.complaint_id;

    if (!complaintId) {
      throw new Error('Complaint was submitted, but no complaint ID was returned.');
    }

    setSubmittedComplaintId(complaintId);

    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore confetti errors
    }

  } catch (error) {
    setErrorMsg(
      error instanceof Error
        ? error.message
        : 'Something went wrong while submitting your complaint.'
    );
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Confirmation Modal */}
      {submittedComplaintId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-2xl shadow-2xl max-w-lg w-full p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                Civic Report Dispatched
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Complaint Successfully Registered!
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Your complaint has been logged and immediately routed to the municipal engineering authority responsible for <strong className="text-slate-900 dark:text-white">{ward}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#17243A] border border-slate-200/60 dark:border-slate-700 text-xs space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Complaint ID:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                  {submittedComplaintId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Assigned Ward:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{ward}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Initial Status:</span>
                <span className="font-mono font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.2 rounded">
                  Submitted (Notified to Officer)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSubmittedComplaintId(null);
                  setCitizenActiveTab('my-complaints');
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
              >
                Track in My Complaints →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Report Civic Issue
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SECTION A — SELECT ISSUE CATEGORY */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              1. Issue Category
            </h2>
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">
              {category}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map(cat => {
              const isSelected = category === cat.category;
              return (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setCategory(cat.category)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 shadow-sm ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#17243A]/60 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div>
                    <span className="text-2xl block mb-1.5">{cat.emoji}</span>
                    <span className="font-bold text-slate-900 dark:text-white block text-xs leading-snug">
                      {cat.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION B — DESCRIBE THE ISSUE */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              2. Issue Details
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Complaint Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Deep crater pothole opposite Metro Pillar 84"
                value={title}
                onChange={e => { setTitle(e.target.value); setErrorMsg(''); }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Problem Description *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe size, depth, vehicle damage, danger to pedestrians, or how long it has persisted..."
                value={description}
                onChange={e => { setDescription(e.target.value); setErrorMsg(''); }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs leading-relaxed"
              />
            </div>

            {/* Severity Selection */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Perceived Severity *
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {(['Low', 'Medium', 'High', 'Critical'] as ComplaintSeverity[]).map(sev => {
                  const isSelected = severity === sev;
                  return (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                        isSelected
                          ? sev === 'Critical'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : sev === 'High'
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : sev === 'Medium'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                            : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {sev}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION C — UPLOAD PHOTOGRAPHS */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              3. Photographs (Optional)
            </h2>
          </div>

          <div className="space-y-3">
            {/* Upload Zone */}
            <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-[#17243A]/50">
              <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                Upload photo or take picture
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG up to 10MB</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Photo Previews */}
            {images.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                  Attached Photos ({images.length})
                </span>
                <div className="flex flex-wrap gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                      <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION D — CURRENT LOCATION */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              4. Location
            </h2>

            <button
              type="button"
              onClick={requestCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold rounded-lg text-xs transition-colors cursor-pointer border border-blue-200 dark:border-blue-900"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Detecting GPS...' : 'Use My Current Location'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Specific Landmark / Street Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="e.g. 100ft Road, opposite Pillar 84, Indiranagar"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ward Jurisdiction *
              </label>
              <select
                value={ward}
                onChange={e => setWard(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
              >
                <option value="Ward 12 (Indiranagar)">Ward 12 (Indiranagar) - BBMP East Zone</option>
                <option value="Ward 13 (Domlur)">Ward 13 (Domlur) - BBMP East Zone</option>
                <option value="Ward 15 (Koramangala)">Ward 15 (Koramangala) - BBMP South Zone</option>
                <option value="Ward 08 (Malleshwaram)">Ward 08 (Malleshwaram) - BBMP West Zone</option>
                <option value="Ward 04 (Hebbal)">Ward 04 (Hebbal) - BBMP North Zone</option>
                <option value="Ward 20 (KR Puram)">Ward 20 (KR Puram) - Mahadevapura Zone</option>
                <option value="Ward 22 (Whitefield)">Ward 22 (Whitefield) - Mahadevapura Zone</option>
                <option value="Ward 31 (Jayanagar)">Ward 31 (Jayanagar) - BBMP South Zone</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Latitude Coordinates
              </label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={e => setLatitude(parseFloat(e.target.value) || 0)}
                className="w-full font-mono px-3.5 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Longitude Coordinates
              </label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={e => setLongitude(parseFloat(e.target.value) || 0)}
                className="w-full font-mono px-3.5 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* SECTION E — SUBMIT COMPLAINT */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              Ready to submit to municipal authority?
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              The assigned ward engineer in <strong className="text-slate-700 dark:text-slate-300">{ward}</strong> will be notified in real-time.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer disabled:opacity-60"
          >
            <FileCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Dispatching Complaint...' : 'SUBMIT COMPLAINT'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
