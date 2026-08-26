export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  updatedById: string | null;
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
}

export type UpdateDepartmentRequest = Partial<CreateDepartmentRequest>;
