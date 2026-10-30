import React, { useState, useEffect } from 'react';
import { getComplaints, getComplaintTimeline } from '../../services/api';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Camera,
  Calendar,
  Building,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
  FileText,
  User,
  Wrench
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ComplaintStatus, ComplaintCategory, CitizenComplaint } from '../../types';

export const MyComplaintsPage: React.FC = () => {
  const {
    currentCitizen,
    complaints,
    selectedComplaintId,
    setSelectedComplaintId,
    setCitizenActiveTab
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [apiComplaints, setApiComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setLoading(true);
        const result = await getComplaints();

        const records = Array.isArray(result)
          ? result
          : result.complaints || [];

        setApiComplaints(records);
        setApiError('');
      } catch (error) {
        setApiError(
          error instanceof Error ? error.message : 'Failed to load complaints'
        );
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);
  // Filter complaints strictly belonging to current citizen
  const citizenComplaints = apiComplaints.map((c: any) => ({
    id: c.id || c.complaint_id,
    citizenId: c.citizen_id || c.citizenId,
    title: c.title,
    description: c.description,
    category: c.category,
    status: c.status || 'Submitted',
    severity: c.severity || 'Medium',
    priorityScore: c.priority_score || 0,
    dateSubmitted: c.created_at
      ? new Date(c.created_at).toLocaleString()
      : 'Recently submitted',
    location: {
      address: c.address || 'Address unavailable',
      ward: c.ward || 'Ward unavailable',
      municipality: 'BBMP Bengaluru',
      latitude: c.latitude || 0,
      longitude: c.longitude || 0
    },
    images: c.images || [],
    timeline: [],
    assignedDepartment: c.assigned_department || '',
    officerRemarks: c.officer_remarks || '',
    assignedTeam: c.assigned_team || '',
    resolutionNotes: c.resolution_notes || ''
  }));
  const filtered = citizenComplaints.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.location.address.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Selected complaint for detailed view
  const activeComplaint = citizenComplaints.find(c => c.id === selectedComplaintId) || (selectedComplaintId ? complaints.find(c => c.id === selectedComplaintId) : null);

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200';
      case 'Assigned':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200';
      case 'Under Review':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200';
      case 'Acknowledged':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    }
  };

  // If a complaint is selected, show the Detailed Complaint Tracking View
  if (activeComplaint) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        <button
          onClick={() => setSelectedComplaintId(null)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Complaints</span>
        </button>

        {/* Complaint Detail Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                  {activeComplaint.id}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">{activeComplaint.category}</span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">{activeComplaint.location.ward}</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">
                {activeComplaint.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${getStatusBadge(activeComplaint.status)}`}>
                {activeComplaint.status}
              </span>
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#17243A]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Submitted On</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200 block mt-1">
                {activeComplaint.dateSubmitted}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#17243A]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Assigned Department</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 block mt-1 truncate">
                {activeComplaint.assignedDepartment || 'Reviewing Department'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#17243A]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Priority Severity</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 block mt-1">
                {activeComplaint.severity} (Score: {activeComplaint.priorityScore}/100)
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Problem Description</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              {activeComplaint.description}
            </p>
          </div>

          {/* Location details */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#17243A] border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  {activeComplaint.location.address}
                </span>
                <span className="text-[11px] text-slate-400">
                  {activeComplaint.location.ward} · {activeComplaint.location.municipality}
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] text-slate-400 hidden sm:block">
              [{activeComplaint.location.latitude.toFixed(4)}, {activeComplaint.location.longitude.toFixed(4)}]
            </span>
          </div>

          {/* Uploaded Evidence Photo */}
          {activeComplaint.images && activeComplaint.images.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                Submitted Photographic Evidence
              </span>
              <div className="flex flex-wrap gap-3">
                {activeComplaint.images.map((img, i) => (
                  <div key={i} className="w-48 h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs">
                    <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Officer Remarks & Resolution Notes if present */}
          {activeComplaint.officerRemarks && (
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs space-y-1">
              <span className="font-bold text-blue-900 dark:text-blue-300 block">
                Official Municipal Remark
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeComplaint.officerRemarks}
              </p>
              {activeComplaint.assignedTeam && (
                <div className="text-[11px] text-blue-600 dark:text-blue-400 pt-1 font-medium">
                  Assigned Team: {activeComplaint.assignedTeam}
                </div>
              )}
            </div>
          )}

          {activeComplaint.resolutionNotes && (
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-1">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                Resolution Verified
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeComplaint.resolutionNotes}
              </p>
            </div>
          )}

          {/* COMPLETE STATUS TIMELINE */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Resolution Timeline
            </h3>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {activeComplaint.timeline.map((item, idx) => (
                <div key={item.id} className="relative group text-xs">
                  <div
                    className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#111C2E] ${
                      item.status === 'Resolved'
                        ? 'bg-emerald-500'
                        : item.status === 'In Progress'
                        ? 'bg-amber-500'
                        : item.status === 'Assigned'
                        ? 'bg-blue-600'
                        : 'bg-indigo-500'
                    }`}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{item.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    By: {item.actor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (loading) {
    return <div className="p-8 text-center">Loading your complaints...</div>;
  }
  if (apiError) {
    return <div className="p-8 text-center text-red-500">{apiError}</div>;
  }
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Complaints ({citizenComplaints.length})
          </h1>
        </div>

        <button
          onClick={() => setCitizenActiveTab('report')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Report Issue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, title, street..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Road damage / potholes">Road Damage</option>
            <option value="Drainage blockage">Drainage Blockage</option>
            <option value="Water leakage">Water Leakage</option>
            <option value="Streetlight malfunction">Streetlight</option>
            <option value="Garbage accumulation">Garbage</option>
          </select>
        </div>

        <span className="font-mono text-slate-500 text-xs">
          Showing {filtered.length} of {citizenComplaints.length}
        </span>
      </div>

      {/* Complaints List Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-2xl space-y-3">
          <p className="text-xs text-slate-500">No complaints matching your criteria.</p>
          <button
            onClick={() => { setSearch(''); setStatusFilter('All'); setCategoryFilter('All'); }}
            className="text-xs text-blue-600 font-semibold underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(complaint => (
            <div
              key={complaint.id}
              onClick={() => setSelectedComplaintId(complaint.id)}
              className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                    {complaint.id}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {complaint.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {complaint.description}
                </p>
              </div>

              {/* Bottom Details */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1 truncate max-w-[220px]">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{complaint.location.address}</span>
                  </div>
                  <span className="font-mono text-[10px] shrink-0">
                    {complaint.dateSubmitted.split(' ')[0]}
                  </span>
                </div>

                {complaint.assignedDepartment && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Dept:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[190px]">
                      {complaint.assignedDepartment}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                  <span>Track Full Progress</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
