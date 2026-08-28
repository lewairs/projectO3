export interface InternshipCatalogQuery {
  q?: string;
  departmentId?: string;
  internshipStatus?: string;
  projectStatus?: string;
  page: number;
  limit: number;
}

export interface InternshipPerson {
  firstName?: string;
  lastName?: string;
}

export interface InternshipCard {
  id: string;
  referenceCode: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  status: string;
  internshipType?: string;
  workLocation?: string;
  intern: InternshipPerson & { registrationCode?: string };
  department: { id: string; code?: string; name: string };
  supervisor?: { employee?: InternshipPerson } | null;
  authority?: {
    name?: string;
    signingTitle?: string;
    employee?: InternshipPerson;
  } | null;
  projectAssignments?: Array<{
    id: string;
    role?: string;
    status?: string;
    project?: {
      id: string;
      projectCode?: string;
      name: string;
      status?: string;
    };
  }>;
}

export interface InternshipCatalogResponse {
  summary: {
    ongoingInternships: number;
    plannedInternships: number;
    activeProjects: number;
  };
  items: InternshipCard[];
  filters: {
    departments: Array<{ id: string; code: string; name: string }>;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
