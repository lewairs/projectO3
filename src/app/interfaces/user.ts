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

export interface AuthenticatedUser {
  id: string;
  employeeId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  jobTitle: string;
  position: PositionSummary;
  department: DepartmentSummary | null;
  role: string;
  permissions: string[];
  mustChangePassword: boolean;
  lastLoginAt?: string | null;
}
