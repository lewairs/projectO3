export interface Role {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateRoleRequest = Partial<CreateRoleRequest>;
