import React, { useState, useEffect } from 'react';
import { getOfficerComplaints, updateComplaintStatus as updateComplaintStatusAPI } from '../../services/api';
import {
  ShieldAlert,
  Users,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  MapPin,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  ArrowRight,
  X,
  FileCheck,
  Upload,
  Calendar,
  Layers,
  Phone,
  User,
  Flame,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { CitizenComplaint, ComplaintCluster, ComplaintStatus, ComplaintSeverity } from '../../types';
import { MUNICIPAL_DEPARTMENTS } from '../../data/mockData';

export const MunicipalOperationsDashboard: React.FC = () => {
  const {
    currentOfficer,
    complaints,
    clusters,
    selectedComplaintId,
    setSelectedComplaintId,
    updateComplaintStatus,
    setIsAuthModalOpen
  } = useApp();
  const [apiComplaints, setApiComplaints] = useState<CitizenComplaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [complaintError, setComplaintError] = useState('');

  const loadOfficerComplaints = async () => {
    try {
      setLoadingComplaints(true);
      const result = await getOfficerComplaints();

      const records = Array.isArray(result)
        ? result
        : result.complaints || [];

      const statusMap: Record<string, ComplaintStatus> = {
        pending: 'Submitted',
        submitted: 'Submitted',
        acknowledged: 'Acknowledged',
        under_review: 'Under Review',
        assigned: 'Assigned',
        in_progress: 'In Progress',
        resolved: 'Resolved',
        rejected: 'Rejected',
      };
      console.log("DATABASE COMPLAINTS:", records);
      console.log("CLUSTER COMPLAINT IDS:", clusters);
      const mappedComplaints: CitizenComplaint[] = records.map((c: any) => ({
        id: c.id,
        citizenId: c.citizen_id || '',
        citizenName: c.citizen_name || 'Citizen',
        citizenPhone: c.citizen_phone || 'Not provided',
        category: c.category,
        title: c.title || 'Untitled complaint',
        description: c.description || '',
        severity: c.severity || 'Medium',
        priorityScore: Number(c.priority_score || 0),
        images: c.images || [],
        location: {
          latitude: c.latitude ?? 0,
          longitude: c.longitude ?? 0,
          address: c.address || 'Address unavailable',
          ward: c.ward || 'Ward unavailable',
          municipality: c.municipality || 'BBMP Bengaluru',
        },
        dateSubmitted: c.created_at || '',
        lastUpdated: c.updated_at || c.created_at || '',
        status: statusMap[String(c.status || '').toLowerCase()] || 'Submitted',
        assignedDepartment: c.assigned_department || '',
        assignedTeam: c.assigned_team || '',
        officerRemarks: c.officer_remarks || '',
        resolutionNotes: c.resolution_notes || '',
        resolutionPhoto: c.resolution_photo || '',
        rejectionReason: c.rejection_reason || '',
        timeline: c.timeline || [],
        clusterGroupId: c.cluster_group_id || undefined,
        similarReportsCount: c.similar_reports_count || 1,
      }));

      setApiComplaints(mappedComplaints);
      setComplaintError('');
    } catch (error) {
      setComplaintError(
        error instanceof Error ? error.message : 'Failed to load complaints'
      );
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    loadOfficerComplaints();
  }, []);

  // JURISDICTION FILTER RULE: Officer only receives complaints belonging to assigned wards!
  const jurisdictionComplaints = apiComplaints;

  const jurisdictionClusters = clusters.filter(cl =>
    currentOfficer.assignedWards.some(w => cl.ward.includes(w) || w.includes(cl.ward))
  );

  // Filter & Sort State
  const [search, setSearch] = useState('');
  const [wardFilter, setWardFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'priority' | 'reports' | 'oldest' | 'newest'>('priority');

  // Active Management Modal
  const [managingComplaint, setManagingComplaint] = useState<CitizenComplaint | null>(null);
  const [inspectingCluster, setInspectingCluster] = useState<ComplaintCluster | null>(null);

  // Form State inside Management Modal
  const [actionStatus, setActionStatus] = useState<ComplaintStatus>('In Progress');
  const [actionDepartment, setActionDepartment] = useState('Road Maintenance Department');
  const [actionTeam, setActionTeam] = useState('Asphalt Rapid Response Unit');
  const [actionRemarks, setActionRemarks] = useState('');
  const [actionResolutionNotes, setActionResolutionNotes] = useState('');
  const [actionRejectionReason, setActionRejectionReason] = useState('');
  const [repairPhoto, setRepairPhoto] = useState('');

  // Metrics
  const totalInJurisdiction = jurisdictionComplaints.length;
  const criticalCount = jurisdictionComplaints.filter(c => c.priorityScore >= 80).length;
  const inProgressCount = jurisdictionComplaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolvedCount = jurisdictionComplaints.filter(c => c.status === 'Resolved').length;

  // Filter logic
  const filtered = jurisdictionComplaints.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(search.toLowerCase()) ||
      c.location.address.toLowerCase().includes(search.toLowerCase());
    const matchesWard = wardFilter === 'All' || c.location.ward === wardFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesWard && matchesCategory && matchesStatus;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'priority') return b.priorityScore - a.priorityScore;
    if (sortBy === 'reports') return (b.similarReportsCount || 1) - (a.similarReportsCount || 1);
    if (sortBy === 'oldest') return a.dateSubmitted.localeCompare(b.dateSubmitted);
    return b.dateSubmitted.localeCompare(a.dateSubmitted);
  });

  const openManageModal = (complaint: CitizenComplaint) => {
    setManagingComplaint(complaint);
    setActionStatus(complaint.status);
    setActionDepartment(complaint.assignedDepartment || 'Road Maintenance Department');
    setActionTeam(complaint.assignedTeam || 'Rapid Response Inspection Unit');
    setActionRemarks(complaint.officerRemarks || '');
    setActionResolutionNotes(complaint.resolutionNotes || '');
    setActionRejectionReason(complaint.rejectionReason || '');
    setRepairPhoto(complaint.resolutionPhoto || '');
  };

  const handleSaveAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingComplaint) return;

    if (actionStatus === 'Rejected' && !actionRejectionReason.trim()) {
      alert('Mandatory requirement: Please provide a detailed rejection reason.');
      return;
    }

    try {
      const statusToAPI: Record<string, string> = {
        'Submitted': 'pending',
        'Acknowledged': 'acknowledged',
        'Under Review': 'under_review',
        'Assigned': 'assigned',
        'In Progress': 'in_progress',
        'Resolved': 'resolved',
        'Rejected': 'rejected',
      };

      await updateComplaintStatusAPI(
        managingComplaint.id,
        statusToAPI[actionStatus]
      );

      await loadOfficerComplaints();

      if (actionStatus === 'Resolved') {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      }

      setManagingComplaint(null);
    } catch (error) {
      console.error('Failed to update complaint:', error);
      alert('Failed to update complaint status. Please try again.');
    }
  };
  if (loadingComplaints) {
    return <div className="p-8 text-center">Loading municipal complaints...</div>;
  }

  if (complaintError) {
    return <div className="p-8 text-center text-red-500">{complaintError}</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Jurisdiction Identification */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Complaints
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Jurisdiction: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{currentOfficer.assignedWards.join(' · ')}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {currentOfficer.name} ({currentOfficer.employeeId})
            </span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-xs cursor-pointer"
            >
              Switch Profile
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Operational KPI Cards - Clean Numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Reports</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {totalInJurisdiction}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Critical Priority</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
              {criticalCount}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
              {inProgressCount}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Resolved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              {resolvedCount}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: HAZARD CLUSTERS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Hazard Clusters ({jurisdictionClusters.length})
            </h2>
          </div>
        </div>

        {/* Cluster Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jurisdictionClusters.map(cluster => (
            <div
              key={cluster.id}
              onClick={() => setInspectingCluster(cluster)}
              className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10 hover:border-rose-300 dark:hover:border-rose-800 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    {cluster.ward}
                  </span>
                  <span className="font-mono text-xs font-bold text-rose-600 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded">
                    Score: {cluster.priorityScore}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {cluster.title}
                </h3>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {cluster.approxLocation}
                </p>
              </div>

              <div className="pt-2 border-t border-rose-100 dark:border-rose-900/30 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {cluster.reportCount} Reports
                </span>

                <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: COMPLAINTS MANAGEMENT QUEUE */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Complaints Queue ({sorted.length})
            </h2>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sort Queue:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
            >
              <option value="priority">Highest Priority Score</option>
              <option value="reports">Most Clustered Reports</option>
              <option value="newest">Recently Submitted</option>
              <option value="oldest">Oldest Unresolved (SLA)</option>
            </select>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search complaint ID, title, citizen..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          <select
            value={wardFilter}
            onChange={e => setWardFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 cursor-pointer font-medium"
          >
            <option value="All">All Assigned Wards</option>
            {currentOfficer.assignedWards.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 cursor-pointer font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted (New)</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned to Dept</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Complaints Table */}
        <div className="rounded-xl border border-slate-200 dark:border-[#263449] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#17243A] text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-[#263449]">
                <tr>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Issue Title &amp; Ward</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Citizen</th>
                  <th className="py-3 px-4">Cluster Density</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No complaints match this filter within your jurisdiction.
                    </td>
                  </tr>
                ) : (
                  sorted.map(complaint => (
                    <tr
                      key={complaint.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => openManageModal(complaint)}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            complaint.priorityScore >= 80
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                              : complaint.priorityScore >= 60
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          }`}
                        >
                          {complaint.priorityScore}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {complaint.id}
                      </td>

                      <td className="py-3 px-4 max-w-xs truncate">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {complaint.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {complaint.location.address}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {complaint.category}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block">
                          {complaint.citizenName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {complaint.citizenPhone}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600 dark:text-slate-300">
                        {complaint.similarReportsCount && complaint.similarReportsCount > 1 ? (
                          <span className="text-rose-600 font-bold flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5" />
                            <span>{complaint.similarReportsCount} Reports</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Single</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                            complaint.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : complaint.status === 'In Progress'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                              : complaint.status === 'Assigned'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                              : complaint.status === 'Under Review'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => openManageModal(complaint)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Manage &amp; Assign →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION: MUNICIPAL DEPARTMENT WORKLOAD */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Municipal Department &amp; Team Assignment Workload
            </h2>
            <p className="text-[11px] text-slate-500">
              Operational capacity and pending task allocation across BBMP divisions
            </p>
          </div>
          <span className="font-mono text-xs font-semibold text-slate-500">
            6 Specialized Departments
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {MUNICIPAL_DEPARTMENTS.map(dept => (
            <div
              key={dept.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-[#263449] bg-slate-50/50 dark:bg-[#17243A]/60 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white truncate">
                  {dept.name}
                </span>
                <span className="font-mono text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded font-bold">
                  {dept.code}
                </span>
              </div>

              <div className="text-[11px] text-slate-500">
                Divisional Lead: {dept.head} · {dept.contact}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-center font-mono">
                <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-sans">Pending</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{dept.pendingTasks}</span>
                </div>
                <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg">
                  <span className="text-[10px] text-amber-500 block font-sans">Active</span>
                  <span className="font-bold text-amber-600">{dept.inProgressTasks}</span>
                </div>
                <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg">
                  <span className="text-[10px] text-emerald-500 block font-sans">Done</span>
                  <span className="font-bold text-emerald-600">{dept.resolvedTasks}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OFFICER COMPLAINT MANAGEMENT MODAL */}
      {managingComplaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setManagingComplaint(null)}
        >
          <div
            className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-xs"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-[#17243A]/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {managingComplaint.id}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{managingComplaint.category}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{managingComplaint.location.ward}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {managingComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setManagingComplaint(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAction} className="p-6 space-y-4">
              {/* Citizen Details Strip */}
              <div className="p-3 bg-slate-50 dark:bg-[#17243A] rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Reporting Citizen:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {managingComplaint.citizenName} ({managingComplaint.citizenPhone})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Location Pin:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {managingComplaint.location.address}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Priority Hazard:</span>
                  <span className="font-mono font-bold text-rose-600">
                    {managingComplaint.priorityScore}/100 ({managingComplaint.severity})
                  </span>
                </div>
              </div>

              {/* Citizen Photos Preview */}
              {managingComplaint.images && managingComplaint.images.length > 0 && (
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Citizen Photo Evidence:
                  </span>
                  <div className="flex gap-3">
                    {managingComplaint.images.map((img, i) => (
                      <div key={i} className="w-40 h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION 1: UPDATE STATUS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Update Complaint Status *
                  </label>
                  <select
                    value={actionStatus}
                    onChange={e => setActionStatus(e.target.value as ComplaintStatus)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold cursor-pointer"
                  >
                    <option value="Submitted">Submitted (Awaiting Action)</option>
                    <option value="Acknowledged">Acknowledged by Ward Office</option>
                    <option value="Under Review">Under Review &amp; Assessment</option>
                    <option value="Assigned">Assigned to Department</option>
                    <option value="In Progress">In Progress (Field Crew Deployed)</option>
                    <option value="Resolved">Resolved (Work Completed)</option>
                    <option value="Rejected">Rejected (Invalid / Duplicate)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Assign Municipal Department *
                  </label>
                  <select
                    value={actionDepartment}
                    onChange={e => setActionDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium cursor-pointer"
                  >
                    {MUNICIPAL_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ACTION 2: FIELD TEAM ASSIGNMENT */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign Field Inspection / Repair Team
                </label>
                <input
                  type="text"
                  value={actionTeam}
                  onChange={e => setActionTeam(e.target.value)}
                  placeholder="e.g. East Zone Asphalt Rapid Response Crew 2"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {/* ACTION 3: OFFICER REMARKS */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Municipal Remark (Visible to Citizen)
                </label>
                <textarea
                  rows={2}
                  value={actionRemarks}
                  onChange={e => setActionRemarks(e.target.value)}
                  placeholder="e.g. Field team dispatched. Night-time milling and asphalt repair scheduled..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {/* ACTION 4: IF RESOLVED - RESOLUTION NOTES */}
              {actionStatus === 'Resolved' && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-2">
                  <label className="block font-bold text-emerald-900 dark:text-emerald-300">
                    Resolution Quality Verification Notes *
                  </label>
                  <textarea
                    rows={2}
                    value={actionResolutionNotes}
                    onChange={e => setActionResolutionNotes(e.target.value)}
                    placeholder="Describe repair material deployed, inspection verification, and date of completion..."
                    className="w-full px-3 py-2 bg-white dark:bg-[#17243A] border border-emerald-300 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              )}

              {/* ACTION 5: IF REJECTED - REJECTION REASON */}
              {actionStatus === 'Rejected' && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-2">
                  <label className="block font-bold text-rose-900 dark:text-rose-300">
                    Mandatory Rejection Explanation *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={actionRejectionReason}
                    onChange={e => setActionRejectionReason(e.target.value)}
                    placeholder="Provide clear technical reason (e.g. private property jurisdiction, duplicate of #CM-2026-00124)..."
                    className="w-full px-3 py-2 bg-white dark:bg-[#17243A] border border-rose-300 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setManagingComplaint(null)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Update &amp; Notify Citizen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLUSTER DETAIL INSPECTION MODAL */}
      {inspectingCluster && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setInspectingCluster(null)}
        >
          <div
            className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto text-xs"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-[#17243A]/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    {inspectingCluster.id}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {inspectingCluster.ward}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {inspectingCluster.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectingCluster(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Priority Urgency</span>
                  <span className="font-mono font-bold text-base text-rose-600">
                    {inspectingCluster.priorityScore}/100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Corroborating Reports</span>
                  <span className="font-mono font-bold text-base text-slate-900 dark:text-white">
                    {inspectingCluster.reportCount} Complaints
                  </span>
                </div>
              </div>

              {/* Location */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">Physical Location</span>
                <p className="text-xs text-slate-800 dark:text-slate-200">
                  {inspectingCluster.approxLocation} ({inspectingCluster.ward})
                </p>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-[#17243A] rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">First Reported</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{inspectingCluster.firstReportedDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Latest Reported</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{inspectingCluster.latestReportedDate}</span>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 block">
                  Recommended Engineering Action:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {inspectingCluster.recommendedAction}
                </p>
              </div>

              {/* Associated Grievances */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                  Associated Complaints
                </span>

                <div className="space-y-1.5">
                  {inspectingCluster.complaintIds.map(cId => {
                    const comp = apiComplaints.find(
                      c => c.id === cId
                    );

                    return (
                      <div
                        key={cId}
                        onClick={() => {
                          if (!comp) {
                            alert(
                              'This cluster complaint is not linked to a database complaint yet.'
                            );
                            return;
                          }

                          openManageModal(comp);
                        }}
                        className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 flex items-center justify-between cursor-pointer transition-colors group"
                      >
                        <div className="space-y-0.5 truncate mr-2">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                            {comp ? comp.id : cId}
                          </span>

                          <span className="text-slate-400 mx-1.5">·</span>

                          <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
                            {comp ? comp.title : 'Complaint not linked'}
                          </span>
                        </div>

                        <span className="text-blue-600 dark:text-blue-400 font-bold text-[11px] shrink-0">
                          {comp ? 'Manage →' : 'Unavailable'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-[#17243A]/50">
              <button
                onClick={() => setInspectingCluster(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
