export interface UserRole {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface UserEmployee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: { id: string; code: string; name: string } | null;
  department?: { id: string; name: string; code: string } | null;
}

export interface UserAccount {
  id: string;
  employeeId: string;
  roleId: string;
  mustChangePassword: boolean;
  passwordChangedAt: string | null;
  lastLoginAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  employee: UserEmployee;
  role: UserRole;
}

export interface CreateUserAccount {
  employeeId: string;
  roleId: string;
  password: string;
  confirmPassword: string;
  mustChangePassword: boolean;
}
