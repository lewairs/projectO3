import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { DashboardStat } from '../interfaces/dashboard-stat.model';
import { DepartmentService } from '../../departements/services/department.service';
import { RoleService } from '../../roles/services/role.service';
import { EmployeeService } from '../../utilisateurs/services/employee.service';
import { BackendHealthService } from '../../../../core/services/backend-health.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly departments = inject(DepartmentService);
  private readonly roles = inject(RoleService);
  private readonly employees = inject(EmployeeService);
  private readonly health = inject(BackendHealthService);

  getStats(): Observable<DashboardStat[]> {
    return forkJoin({
      departments: this.departments.getAll(),
      roles: this.roles.getAll(),
      employees: this.employees.getAll(),
      health: this.health.checkDatabase(),
    }).pipe(
      map(({ departments, roles, employees, health }) => [
        { title: 'Employés', value: String(employees.length), subtitle: 'Actifs', icon: '👥' },
        { title: 'Départements', value: String(departments.length), subtitle: 'Actifs', icon: '🏢' },
        { title: 'Rôles', value: String(roles.length), subtitle: 'Actifs', icon: '🛡️' },
        {
          title: 'Backend',
          value: health.status === 'ok' ? 'Connecté' : 'Indisponible',
          subtitle: `${health.database.toUpperCase()} • ${health.roleCount} rôle(s)`,
          icon: '🔗',
        },
      ]),
    );
  }
}
