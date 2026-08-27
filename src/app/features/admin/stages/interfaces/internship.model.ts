export type InternshipStatus = 'A_VENIR' | 'EN_COURS' | 'TERMINE' | 'ANNULE';

export interface Internship {
  id: string;
  reference: string;
  internId: string;
  supervisorId: string;
  projectId: string;
  startDate: string;
  endDate: string;
  status: InternshipStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
}
