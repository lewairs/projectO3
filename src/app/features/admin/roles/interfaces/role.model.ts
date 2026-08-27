export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  isActive: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateRoleRequest = Partial<CreateRoleRequest>;
