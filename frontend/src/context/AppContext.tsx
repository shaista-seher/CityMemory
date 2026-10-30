import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Asset,
  MaintenanceRecord,
  HighPriorityAlert,
  AIPredictionItem,
  HistoryEvent,
  UserRole,
  CitizenUser,
  OfficerUser,
  CitizenComplaint,
  ComplaintCluster,
  ComplaintStatus,
  ComplaintSeverity,
  ComplaintCategory,
  ComplaintTimelineEntry
} from '../types';
import {
  INITIAL_ASSETS,
  INITIAL_MAINTENANCE_RECORDS,
  INITIAL_ALERTS,
  AI_PREDICTIONS,
  DEMO_CITIZEN_USERS,
  DEMO_OFFICER_USERS,
  INITIAL_COMPLAINTS,
  INITIAL_CLUSTERS
} from '../data/mockData';

export type NavigationPage = 
  | 'operations'
  | 'overview' 
  | 'map' 
  | 'registry' 
  | 'detail' 
  | 'maintenance' 
  | 'prediction' 
  | 'risk' 
  | 'reports' 
  | 'settings';

export type CitizenTab = 'dashboard' | 'report' | 'my-complaints' | 'community' | 'detail';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'critical' | 'warning' | 'info';
  assetId?: string;
  complaintId?: string;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // User Authentication & Roles
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentCitizen: CitizenUser;
  setCurrentCitizen: (citizen: CitizenUser) => void;
  currentOfficer: OfficerUser;
  setCurrentOfficer: (officer: OfficerUser) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginAsCitizen: (user?: CitizenUser) => void;
  loginAsOfficer: (officer?: OfficerUser) => void;
  loginWithOtp: (role: UserRole, details: { name: string; phone: string; ward?: string; department?: string; designation?: string; employeeId?: string }) => void;
  logout: () => void;
  
  // Citizen Navigation
  citizenActiveTab: CitizenTab;
  setCitizenActiveTab: (tab: CitizenTab) => void;
  
  // Officer Navigation
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  selectedWard: string;
  setSelectedWard: (ward: string) => void;
  
  // Complaints & Clusters (Two-Sided Shared State)
  complaints: CitizenComplaint[];
  clusters: ComplaintCluster[];
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
  openComplaintDetail: (id: string) => void;
  submitComplaint: (data: {
    category: ComplaintCategory;
    title: string;
    description: string;
    severity: ComplaintSeverity;
    images: string[];
    location: {
      latitude: number;
      longitude: number;
      address: string;
      ward: string;
      municipality: string;
    };
  }) => CitizenComplaint;
  updateComplaintStatus: (
    complaintId: string,
    newStatus: ComplaintStatus,
    details?: {
      remarks?: string;
      department?: string;
      team?: string;
      notes?: string;
      photo?: string;
      rejectionReason?: string;
    }
  ) => void;
  
  // Real-time Officer Notification Popups
  officerNewComplaintAlert: CitizenComplaint | null;
  dismissOfficerAlert: () => void;
  
  // Assets
  assets: Asset[];
  selectedAssetId: string;
  setSelectedAssetId: (id: string) => void;
  openAssetDetail: (id: string) => void;
  addAsset: (asset: Omit<Asset, 'id' | 'conditionScore' | 'riskScore' | 'riskLevel' | 'history' | 'conditionHistory' | 'recurringFailurePatterns' | 'weaknessFactors' | 'estimatedPreventiveCost' | 'estimatedReactiveFailureCost'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  
  // Maintenance
  maintenanceRecords: MaintenanceRecord[];
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
  
  // Alerts & Notifications
  alerts: HighPriorityAlert[];
  dismissAlert: (id: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Search & Global state
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  
  // AI Analysis trigger
  isAnalyzing: boolean;
  runAiAnalysis: () => Promise<void>;
  aiPredictions: AIPredictionItem[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'citymemory_theme',
  ROLE: 'citymemory_role',
  AUTH_STATUS: 'citymemory_is_auth',
  CITIZEN_USER: 'citymemory_citizen_user',
  OFFICER_USER: 'citymemory_officer_user',
  COMPLAINTS: 'citymemory_complaints',
  CLUSTERS: 'citymemory_clusters',
  ASSETS: 'citymemory_assets',
  MAINTENANCE: 'citymemory_maintenance',
  NOTIFICATIONS: 'citymemory_notifications'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Two-Sided User Roles & Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_STATUS);
    // If not set, default to false so user sees the login pages first
    return saved === 'true';
  });

  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved === 'citizen' || saved === 'officer') ? saved : 'citizen';
  });

  const [currentCitizen, setCurrentCitizen] = useState<CitizenUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CITIZEN_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEMO_CITIZEN_USERS[0];
  });

  const [currentOfficer, setCurrentOfficer] = useState<OfficerUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFICER_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEMO_OFFICER_USERS[0];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentUserRole);
  }, [currentUserRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CITIZEN_USER, JSON.stringify(currentCitizen));
  }, [currentCitizen]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFICER_USER, JSON.stringify(currentOfficer));
  }, [currentOfficer]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const loginAsCitizen = (user?: CitizenUser) => {
    const u = user || DEMO_CITIZEN_USERS[0];
    setCurrentCitizen(u);
    setCurrentUserRole('citizen');
    setCitizenActiveTab('dashboard');
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const loginAsOfficer = (officer?: OfficerUser) => {
    const off = officer || DEMO_OFFICER_USERS[0];
    setCurrentOfficer(off);
    setCurrentUserRole('officer');
    setActivePage('operations');
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const loginWithOtp = (
    role: UserRole,
    details: {
      name: string;
      phone: string;
      ward?: string;
      department?: string;
      designation?: string;
      employeeId?: string;
    }
  ) => {
    if (role === 'citizen') {
      const trimmedName = details.name.trim() || 'Citizen User';
      const cleanSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'citizen';
      const citizenObj: CitizenUser = {
        id: `CIT-${Date.now().toString().slice(-4)}`,
        name: trimmedName,
        phone: details.phone.trim() || '+91 98450 12345',
        email: `${cleanSlug}@bengaluru.in`,
        residentialArea: details.ward || 'Indiranagar Central',
        ward: details.ward || 'Ward 12 (Indiranagar)',
        municipality: 'BBMP Bengaluru'
      };
      setCurrentCitizen(citizenObj);
      setCurrentUserRole('citizen');
      setCitizenActiveTab('dashboard');
    } else {
      const trimmedName = details.name.trim() || 'Municipal Officer';
      const officerObj: OfficerUser = {
        id: details.employeeId || `OFF-${Date.now().toString().slice(-4)}`,
        name: trimmedName,
        phone: details.phone.trim() || '+91 94481 67890',
        employeeId: details.employeeId || `BBMP-${Math.floor(1000 + Math.random() * 9000)}`,
        department: details.department || 'Road & Stormwater Infrastructure Cell',
        designation: details.designation || 'Assistant Executive Engineer',
        municipality: 'BBMP Bengaluru',
        assignedWards: details.ward ? [details.ward] : ['Ward 12 (Indiranagar)', 'Ward 15 (Koramangala)']
      };
      setCurrentOfficer(officerObj);
      setCurrentUserRole('officer');
      setActivePage('operations');
    }
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, 'false');
  };

  // Citizen Tabs
  const [citizenActiveTab, setCitizenActiveTab] = useState<CitizenTab>('dashboard');

  // Municipal Officer Pages
  const [activePage, setActivePage] = useState<NavigationPage>('operations');
  const [selectedWard, setSelectedWard] = useState<string>('All Wards');

  // Shared Complaints Store
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_COMPLAINTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  // Shared Clusters Store
  const [clusters, setClusters] = useState<ComplaintCluster[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLUSTERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CLUSTERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLUSTERS, JSON.stringify(clusters));
  }, [clusters]);

  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  const openComplaintDetail = (id: string) => {
    setSelectedComplaintId(id);
    if (currentUserRole === 'citizen') {
      setCitizenActiveTab('detail');
    } else {
      setActivePage('operations');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real-time Officer Alert Popup
  const [officerNewComplaintAlert, setOfficerNewComplaintAlert] = useState<CitizenComplaint | null>(null);

  const dismissOfficerAlert = () => {
    setOfficerNewComplaintAlert(null);
  };

  // Submit Complaint from Citizen Dashboard
  const submitComplaint = (data: {
    category: ComplaintCategory;
    title: string;
    description: string;
    severity: ComplaintSeverity;
    images: string[];
    location: {
      latitude: number;
      longitude: number;
      address: string;
      ward: string;
      municipality: string;
    };
  }) => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newId = `CM-2026-00${randomNum}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)} IST`;

    // Calculate initial Priority Score
    // Factors: Severity (40%), Category Risk (30%), Existing Reports in Area (30%)
    const severityBase = data.severity === 'Critical' ? 40 : data.severity === 'High' ? 30 : data.severity === 'Medium' ? 20 : 10;
    const categoryBase = (data.category.includes('drainage') || data.category.includes('Drainage') || data.category.includes('waterlogging')) ? 30 :
      data.category.includes('Road') ? 28 :
      data.category.includes('Water leakage') ? 26 : 20;

    // Check existing complaints in same ward and category
    const similarComplaints = complaints.filter(
      c => c.location.ward === data.location.ward && c.category === data.category
    );
    const clusterBoost = Math.min(28, similarComplaints.length * 6);
    const priorityScore = Math.min(98, severityBase + categoryBase + clusterBoost + 5);

    // Timeline entry
    const newTimelineEntry = {
      id: `TL-${newId}-1`,
      status: 'Submitted' as ComplaintStatus,
      title: 'Complaint Registered',
      description: `Citizen ${currentCitizen.name} submitted complaint via CityMemory app with location coordinates [${data.location.latitude.toFixed(4)}, ${data.location.longitude.toFixed(4)}].`,
      timestamp: formattedDate,
      actor: `Citizen ${currentCitizen.name}`
    };

    // Find or create cluster
    let clusterId = `CLUST-${data.location.ward.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)}-${data.category.slice(0, 4).toUpperCase()}`;
    const existingCluster = clusters.find(
      cl => cl.ward === data.location.ward && cl.category === data.category
    );

    if (existingCluster) {
      clusterId = existingCluster.id;
      setClusters(prev => prev.map(cl => {
        if (cl.id === existingCluster.id) {
          return {
            ...cl,
            reportCount: cl.reportCount + 1,
            complaintIds: [newId, ...cl.complaintIds],
            latestReportedDate: 'Just now',
            priorityScore: Math.min(99, cl.priorityScore + 4)
          };
        }
        return cl;
      }));
    } else if (similarComplaints.length >= 1) {
      // Create new cluster
      const newCluster: ComplaintCluster = {
        id: clusterId,
        title: `Recurring ${data.category} Reports`,
        category: data.category,
        ward: data.location.ward,
        municipality: data.location.municipality,
        approxLocation: data.location.address,
        coordinates: [data.location.latitude, data.location.longitude],
        reportCount: similarComplaints.length + 1,
        complaintIds: [newId, ...similarComplaints.map(sc => sc.id)],
        firstReportedDate: '1 day ago',
        latestReportedDate: 'Just now',
        priorityScore,
        priorityLevel: priorityScore >= 80 ? 'Critical' : priorityScore >= 60 ? 'High' : 'Medium',
        recommendedAction: `Inspect ${data.category} infrastructure at ${data.location.ward} due to recurring citizen grievances.`,
        status: 'Pending Review'
      };
      setClusters(prev => [newCluster, ...prev]);
    }

    const newComplaint: CitizenComplaint = {
      id: newId,
      citizenId: currentCitizen.id,
      citizenName: currentCitizen.name,
      citizenPhone: currentCitizen.phone,
      category: data.category,
      title: data.title,
      description: data.description,
      severity: data.severity,
      priorityScore,
      images: data.images,
      location: data.location,
      dateSubmitted: formattedDate,
      lastUpdated: formattedDate,
      status: 'Submitted',
      timeline: [newTimelineEntry],
      clusterGroupId: clusterId,
      similarReportsCount: similarComplaints.length + 1
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Dispatch real-time notification to Municipal Officers responsible for this Ward!
    const newOfficerNotif: NotificationItem = {
      id: `NOTIF-COMP-${Date.now()}`,
      title: 'New Civic Issue Reported',
      message: `[${newId}] ${data.title} in ${data.location.ward}. Priority: ${priorityScore}/100.`,
      time: 'Just now',
      read: false,
      type: data.severity === 'Critical' ? 'critical' : 'warning',
      complaintId: newId
    };

    setNotifications(prev => [newOfficerNotif, ...prev]);

    // Trigger immediate alert popup if officer is assigned to this ward
    if (currentOfficer.assignedWards.some(w => w.includes(data.location.ward) || data.location.ward.includes(w))) {
      setOfficerNewComplaintAlert(newComplaint);
    }

    return newComplaint;
  };

  // Update Complaint Status (By Municipal Officer)
  const updateComplaintStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    details?: {
      remarks?: string;
      department?: string;
      team?: string;
      notes?: string;
      photo?: string;
      rejectionReason?: string;
    }
  ) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)} IST`;

    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const newTimeline: ComplaintTimelineEntry = {
          id: `TL-${complaintId}-${Date.now()}`,
          status: newStatus,
          title: `Status Updated: ${newStatus}`,
          description: details?.remarks || details?.notes || details?.rejectionReason || `Complaint status updated to ${newStatus} by ${currentOfficer.name}.`,
          timestamp: formattedDate,
          actor: `${currentOfficer.name} (${currentOfficer.designation})`,
          notes: details?.notes,
          photoUrl: details?.photo
        };

        const updated: CitizenComplaint = {
          ...c,
          status: newStatus,
          lastUpdated: formattedDate,
          assignedDepartment: details?.department || c.assignedDepartment,
          assignedTeam: details?.team || c.assignedTeam,
          officerRemarks: details?.remarks !== undefined ? details.remarks : c.officerRemarks,
          resolutionNotes: details?.notes !== undefined ? details.notes : c.resolutionNotes,
          resolutionPhoto: details?.photo !== undefined ? details.photo : c.resolutionPhoto,
          rejectionReason: details?.rejectionReason !== undefined ? details.rejectionReason : c.rejectionReason,
          timeline: [...c.timeline, newTimeline]
        };

        return updated;
      }
      return c;
    }));

    // Also update cluster status if all resolved or in progress
    setClusters(prev => prev.map(cl => {
      if (cl.complaintIds.includes(complaintId)) {
        if (newStatus === 'In Progress') {
          return { ...cl, status: 'In Progress' };
        }
        if (newStatus === 'Resolved') {
          return { ...cl, status: 'Resolved' };
        }
      }
      return cl;
    }));

    // Notify citizen
    const targetComp = complaints.find(c => c.id === complaintId);
    if (targetComp) {
      const citizenNotif: NotificationItem = {
        id: `NOTIF-CIT-${Date.now()}`,
        title: `Complaint ${complaintId} Updated`,
        message: `Your report has been marked as "${newStatus}" by ${currentOfficer.department}.`,
        time: 'Just now',
        read: false,
        type: newStatus === 'Resolved' ? 'info' : 'warning',
        complaintId
      };
      setNotifications(prev => [citizenNotif, ...prev]);
    }
  };

  // Assets Store
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ASSETS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }, [assets]);

  const [selectedAssetId, setSelectedAssetId] = useState<string>('SWD-1042');

  const openAssetDetail = (id: string) => {
    setSelectedAssetId(id);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addAsset = (newAssetData: Omit<Asset, 'id' | 'conditionScore' | 'riskScore' | 'riskLevel' | 'history' | 'conditionHistory' | 'recurringFailurePatterns' | 'weaknessFactors' | 'estimatedPreventiveCost' | 'estimatedReactiveFailureCost'>) => {
    const prefixMap: Record<string, string> = {
      'Stormwater Drain': 'SWD',
      'Road': 'RD',
      'Water Pipeline': 'WL',
      'Streetlight': 'SL',
      'Bridge & Flyover': 'BR',
      'Public Building': 'PB'
    };
    const prefix = prefixMap[newAssetData.category] || 'AST';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `${prefix}-${randNum}`;

    const conditionScore = newAssetData.currentCondition === 'Excellent' ? 95 :
      newAssetData.currentCondition === 'Good' ? 82 :
      newAssetData.currentCondition === 'Fair' ? 64 :
      newAssetData.currentCondition === 'Poor' ? 44 : 28;

    const riskScore = Math.max(5, Math.min(95, 100 - conditionScore + Math.floor(Math.random() * 10 - 5)));
    const riskLevel = riskScore >= 80 ? 'Critical' : riskScore >= 60 ? 'High' : riskScore >= 35 ? 'Moderate' : 'Healthy';

    const newAsset: Asset = {
      ...newAssetData,
      id: newId,
      conditionScore,
      riskScore,
      riskLevel,
      history: [
        {
          id: `EV-${newId}-1`,
          date: newAssetData.installationDate,
          title: `Initial Infrastructure Commissioning: ${newAssetData.name}`,
          description: `Commissioned and onboarded to CityMemory civic digital registry under ${newAssetData.responsibleDepartment}.`,
          type: 'Installation',
          status: 'Completed',
          department: newAssetData.responsibleDepartment
        }
      ],
      conditionHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          conditionScore,
          riskScore,
          inspector: 'Civic Onboarding Officer',
          notes: 'Baseline condition inspection recorded.'
        }
      ],
      recurringFailurePatterns: [
        'Baseline lifecycle monitoring activated',
        'Telemetry sync initialized'
      ],
      weaknessFactors: [
        { factor: 'Environmental Exposure', impact: 40 },
        { factor: 'Traffic / Usage Load', impact: 45 }
      ],
      estimatedPreventiveCost: 50000,
      estimatedReactiveFailureCost: 450000
    };

    setAssets(prev => [newAsset, ...prev]);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
  };

  // Maintenance records
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_MAINTENANCE_RECORDS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenanceRecords));
  }, [maintenanceRecords]);

  const addMaintenanceRecord = (record: Omit<MaintenanceRecord, 'id'>) => {
    const newId = `MNT-2026-${Math.floor(900 + Math.random() * 100)}`;
    const newRecord: MaintenanceRecord = { ...record, id: newId };
    setMaintenanceRecords(prev => [newRecord, ...prev]);

    // Also update asset's last maintenance date and history event
    setAssets(prev => prev.map(a => {
      if (a.id === record.assetId) {
        const newEvent: HistoryEvent = {
          id: `EV-${record.assetId}-${Date.now()}`,
          date: record.date,
          title: `Logged Maintenance: ${record.maintenanceType}`,
          description: record.notes,
          type: 'Maintenance',
          status: record.status === 'Completed' ? 'Completed' : 'Pending',
          cost: record.cost,
          department: record.department,
          officer: record.technician
        };
        const updatedHistory: HistoryEvent[] = [newEvent, ...a.history];
        return {
          ...a,
          lastMaintenance: record.date,
          history: updatedHistory
        };
      }
      return a;
    }));
  };

  // Alerts
  const [alerts, setAlerts] = useState<HighPriorityAlert[]>(INITIAL_ALERTS);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(al => al.id !== id));
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'N-1',
        title: 'Critical Risk Threshold Exceeded',
        message: 'Ejipura Canal Outfall Gate (SWD-1099) jammed at 35% open. Backflow imminent.',
        time: '15m ago',
        read: false,
        type: 'critical',
        assetId: 'SWD-1099'
      },
      {
        id: 'N-2',
        title: 'New Complaint In Your Ward',
        message: '[CM-2026-00124] Severe pothole reported at 100ft Road, Ward 12.',
        time: '30m ago',
        read: false,
        type: 'warning',
        complaintId: 'CM-2026-00124'
      },
      {
        id: 'N-3',
        title: 'Pre-Monsoon Desilting Due',
        message: '100ft Road Culvert (SWD-1042) scheduled maintenance in 6 days.',
        time: '3h ago',
        read: false,
        type: 'warning',
        assetId: 'SWD-1042'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Global search & command palette
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // AI predictions & running analysis
  const [aiPredictions, setAiPredictions] = useState<AIPredictionItem[]>(AI_PREDICTIONS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1800));

    setAssets(prev => prev.map(a => {
      if (a.riskScore >= 70) {
        return {
          ...a,
          riskScore: Math.min(99, a.riskScore + 1),
          failureProbability: Math.min(98, (a.failureProbability || 80) + 1)
        };
      }
      return a;
    }));

    setIsAnalyzing(false);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        isAuthenticated,
        setIsAuthenticated,
        loginWithOtp,
        logout,
        currentUserRole,
        setCurrentUserRole,
        currentCitizen,
        setCurrentCitizen,
        currentOfficer,
        setCurrentOfficer,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginAsCitizen,
        loginAsOfficer,
        citizenActiveTab,
        setCitizenActiveTab,
        activePage,
        setActivePage,
        selectedWard,
        setSelectedWard,
        complaints,
        clusters,
        selectedComplaintId,
        setSelectedComplaintId,
        openComplaintDetail,
        submitComplaint,
        updateComplaintStatus,
        officerNewComplaintAlert,
        dismissOfficerAlert,
        assets,
        selectedAssetId,
        setSelectedAssetId,
        openAssetDetail,
        addAsset,
        updateAsset,
        maintenanceRecords,
        addMaintenanceRecord,
        alerts,
        dismissAlert,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        globalSearchQuery,
        setGlobalSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAnalyzing,
        runAiAnalysis,
        aiPredictions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
