export type ProjectStatus = 'BROUILLON' | 'ACTIF' | 'TERMINE' | 'ARCHIVE';

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string | null;
  departmentId: string;
  ownerEmployeeId: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}
