export interface DashboardResponse {
  generatedAt: string;
  summary: {
    activeInterns: number; internsAddedThisMonth: number; activeInternships: number; ongoingInternships: number;
    activeProjects: number; ongoingProjects: number; activeSupervisors: number; activeDepartments: number;
  };
  statusBreakdown: Record<string, Record<string, number>>;
  recentInterns: Array<{
    id: string; registrationCode: string; fullName: string; createdAt: string;
    latestInternship: { status: string; department: { name: string } } | null;
  }>;
  internshipTracking: Array<{
    id: string; title: string; status: string; startDate: string; endDate: string;
    intern: { fullName: string }; department: { name: string }; supervisor: { fullName: string };
    project: { name: string; status: string } | null;
  }>;
  recentActivities: Array<{
    id: string; action: string; resource: string; entityLabel: string | null; occurredAt: string;
    actor: { fullName: string } | null;
  }>;
}
