const API_BASE_URL = "http://127.0.0.1:8000";

// CREATE COMPLAINT
export async function createComplaint(data: {
  title: string;
  description: string;
  category: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}) {
  const response = await fetch(`${API_BASE_URL}/api/complaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Complaint submission failed: ${error}`);
  }

  return response.json();
}

// GET ALL COMPLAINTS
export async function getComplaints() {
  const response = await fetch(`${API_BASE_URL}/api/complaints`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch complaints");
  }

  return response.json();
}

// GET OFFICER COMPLAINTS
export async function getOfficerComplaints() {
  const response = await fetch(`${API_BASE_URL}/api/officer/complaints`);

  if (!response.ok) {
    throw new Error("Failed to fetch officer complaints");
  }

  return response.json();
}

// UPDATE COMPLAINT STATUS
export async function updateComplaintStatus(
  complaintId: string,
  status: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/complaints/${complaintId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update complaint status");
  }

  return response.json();
}

// GET DASHBOARD STATISTICS
export async function getDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard statistics");
  }

  return response.json();
}

// GET PRIORITY ANALYSIS
export async function getPriorityAnalysis() {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/priority`);

  if (!response.ok) {
    throw new Error("Failed to fetch priority analysis");
  }

  return response.json();
}

// GET RECURRENCE ANALYSIS
export async function getRecurrenceAnalysis() {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/recurrence`);

  if (!response.ok) {
    throw new Error("Failed to fetch recurrence analysis");
  }

  return response.json();
}

// GET GRAPH SUMMARY
export async function getGraphSummary() {
  const response = await fetch(
    `${API_BASE_URL}/api/intelligence/graph-summary`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch graph summary");
  }

  return response.json();
}

// GET COMPLAINT TIMELINE
export async function getComplaintTimeline(complaintId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/complaints/${complaintId}/timeline`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch complaint timeline");
  }

  return response.json();
}
