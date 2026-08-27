export type InternStatus = 'ACTIF' | 'INACTIF';

export interface Intern {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  school: string;
  program: string;
  level: string | null;
  status: InternStatus;
  createdAt: string;
  updatedAt: string;
}
