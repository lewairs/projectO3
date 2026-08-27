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

export type BackendRole = string;

export interface BackendUser {
  id: string;
  employeeId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  jobTitle?: string | null;
  position?: PositionSummary | null;
  department: DepartmentSummary | null;
  role: BackendRole;
  permissions?: string[];
  mustChangePassword: boolean;
  lastLoginAt?: string | null;
}

export interface AuthenticatedUser extends BackendUser {
  position: PositionSummary | null;
  permissions: string[];
}
