import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { DashboardStat } from '../interfaces/dashboard-stat.model';
import { DepartmentService } from '../../departements/services/department.service';
import { RoleService } from '../../roles/services/role.service';
import { EmployeeService } from '../../utilisateurs/services/employee.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly departments = inject(DepartmentService);
  private readonly roles = inject(RoleService);
  private readonly employees = inject(EmployeeService);

  getStats(): Observable<DashboardStat[]> {
    return forkJoin({
      departments: this.departments.getAll(),
      roles: this.roles.getAll(),
      employees: this.employees.getAll(),
    }).pipe(
      map(({ departments, roles, employees }) => [
        { title: 'Employés', value: String(employees.length), subtitle: 'Actifs', icon: '👥' },
        { title: 'Départements', value: String(departments.length), subtitle: 'Actifs', icon: '🏢' },
        { title: 'Rôles', value: String(roles.length), subtitle: 'Actifs', icon: '🛡️' },
        { title: 'Backend', value: 'Connecté', subtitle: '3 modules disponibles', icon: '🔗' },
      ]),
    );
  }
}
