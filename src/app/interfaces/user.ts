export interface DepartmentSummary {
  id: string;
  name: string;
  code: string;
}

export interface PositionSummary {
  id: string;
  code: string;
  name: string;
}

export interface BackendUser {
  id: string;
  employeeId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  jobTitle: string;
  department: DepartmentSummary | null;
  role: string;
  mustChangePassword: boolean;
  lastLoginAt?: string | null;
}

export interface AuthenticatedUser extends BackendUser {
  position: PositionSummary | null;
  permissions: string[];
}
