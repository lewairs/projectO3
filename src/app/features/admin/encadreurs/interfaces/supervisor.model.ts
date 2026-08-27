export interface Supervisor {
  id: string;
  employeeId: string;
  capacity: number;
  expertise: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
