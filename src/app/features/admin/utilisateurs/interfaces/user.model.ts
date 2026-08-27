import { Department } from '../../departements/interfaces/department.interface';

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  jobTitle: string;
  departmentId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  department: Department;
}

export interface CreateEmployeeRequest {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  departmentId: string;
  isActive?: boolean;
}

export type UpdateEmployeeRequest = Partial<CreateEmployeeRequest>;
