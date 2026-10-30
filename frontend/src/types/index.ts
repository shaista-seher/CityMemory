export type InfrastructureCategory = 
  | 'Stormwater Drain'
  | 'Road'
  | 'Water Pipeline'
  | 'Streetlight'
  | 'Bridge & Flyover'
  | 'Public Building';

export type RiskLevel = 'Healthy' | 'Moderate' | 'High' | 'Critical';

export type AssetCondition = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';

export interface HistoryEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'Installation' | 'Inspection' | 'Maintenance' | 'Complaint' | 'Repair' | 'Failure' | 'Replacement';
  status: 'Completed' | 'Pending' | 'Verified' | 'Flagged';
  cost?: number; // In INR
  department: string;
  officer?: string;
  evidenceNotes?: string;
}

export interface ConditionRecord {
  date: string;
  conditionScore: number; // 0 to 100
  riskScore: number;      // 0 to 100
  inspector: string;
  notes: string;
}

export interface Asset {
  id: string; // e.g., SWD-1042
  name: string;
  category: InfrastructureCategory;
  ward: string;
  zone: string;
  coordinates: [number, number]; // [lat, lng]
  installationDate: string;
  currentCondition: AssetCondition;
  conditionScore: number; // 0 - 100
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  lastMaintenance: string;
  nextScheduledMaintenance: string;
  responsibleDepartment: string;
  status: 'Operational' | 'Degraded' | 'Under Repair' | 'Decommissioned';
  estimatedFailureWindow?: string;
  failureProbability?: number; // Percentage 0 - 100
  criticality: 'High' | 'Medium' | 'Low';
  
  // Digital Memory
  history: HistoryEvent[];
  conditionHistory: ConditionRecord[];
  
  // AI Diagnostics
  recurringFailurePatterns: string[];
  weaknessFactors: { factor: string; impact: number }[]; // impact 0 - 100
  recommendedAction: string;
  estimatedPreventiveCost: number; // in INR
  estimatedReactiveFailureCost: number; // in INR
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  ward: string;
  category: InfrastructureCategory;
  maintenanceType: 'Routine Cleaning' | 'Desilting' | 'Pothole Patching' | 'Structural Retrofit' | 'Cable Replacement' | 'Valve Overhaul' | 'Preventive Resurfacing';
  date: string;
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Overdue';
  department: string;
  technician: string;
  cost: number;
  notes: string;
  completionDate?: string;
}

export interface HighPriorityAlert {
  id: string;
  assetId: string;
  assetName: string;
  ward: string;
  category: InfrastructureCategory;
  riskLevel: RiskLevel;
  predictedIssue: string;
  recommendedAction: string;
  timeframe: string;
  confidence: number;
  timestamp: string;
}

export interface AIPredictionItem {
  id: string;
  assetId: string;
  assetName: string;
  ward: string;
  category: InfrastructureCategory;
  riskScore: number;
  confidence: number;
  likelyFailureType: string;
  estimatedTimeframe: string;
  historicalFactors: string[];
  contributingFactors: { label: string; percentage: number }[];
  recommendedAction: string;
  preventiveSavings: string;
  previousAccuracy: string;
}

export interface WardSummary {
  name: string;
  zone: string;
  totalAssets: number;
  criticalAssets: number;
  highRiskAssets: number;
  moderateRiskAssets: number;
  healthyAssets: number;
  averageRiskScore: number;
  potholeVulnerabilityIndex: number;
  monsoonFloodRiskIndex: number;
}

// --- TWO-SIDED CITIZEN & MUNICIPAL OFFICER ROLES & COMPLAINTS ---

export type UserRole = 'citizen' | 'officer';

export interface CitizenUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  residentialArea: string;
  ward: string;
  municipality: string;
}

export interface OfficerUser {
  id: string;
  name: string;
  phone?: string;
  employeeId: string;
  department: string;
  designation: string;
  municipality: string;
  assignedWards: string[];
}

export type ComplaintCategory =
  | 'Road damage / potholes'
  | 'Drainage blockage'
  | 'Water leakage'
  | 'Streetlight malfunction'
  | 'Garbage accumulation'
  | 'Broken public infrastructure'
  | 'Waterlogging / flooding'
  | 'Other civic issues';

export type ComplaintStatus =
  | 'Submitted'
  | 'Acknowledged'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type ComplaintSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ComplaintTimelineEntry {
  id: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  notes?: string;
  photoUrl?: string;
}

export interface CitizenComplaint {
  id: string; // e.g. CM-2026-00124
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  severity: ComplaintSeverity;
  priorityScore: number; // 0 - 100
  images: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
    ward: string;
    municipality: string;
  };
  dateSubmitted: string;
  lastUpdated: string;
  status: ComplaintStatus;
  assignedDepartment?: string;
  assignedTeam?: string;
  officerRemarks?: string;
  resolutionNotes?: string;
  resolutionPhoto?: string;
  rejectionReason?: string;
  timeline: ComplaintTimelineEntry[];
  clusterGroupId?: string;
  similarReportsCount?: number;
}

export interface ComplaintCluster {
  id: string;
  title: string;
  category: ComplaintCategory;
  ward: string;
  municipality: string;
  approxLocation: string;
  coordinates: [number, number];
  reportCount: number;
  complaintIds: string[];
  firstReportedDate: string;
  latestReportedDate: string;
  priorityScore: number; // 0-100
  priorityLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  recommendedAction: string;
  status: 'Pending Review' | 'Assigned' | 'In Progress' | 'Resolved';
}

