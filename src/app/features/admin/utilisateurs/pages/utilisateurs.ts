import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthStateService } from '../../../../core/services/auth-state.service';
import { Department } from '../../departements/interfaces/department.interface';
import { DepartmentService } from '../../departements/services/department.service';
import { CreateEmployeeRequest, Employee } from '../interfaces/user.model';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-utilisateurs',
  imports: [ReactiveFormsModule],
  templateUrl: './utilisateurs.html',
  styleUrl: './utilisateurs.css',
})
export class Utilisateurs implements OnInit {
  private readonly service = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly authState = inject(AuthStateService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly employees = signal<Employee[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly search = signal('');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly formOpen = signal(false);
  readonly editing = signal<Employee | null>(null);
  readonly errorMessage = signal('');

  readonly filteredEmployees = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('fr');
    return query
      ? this.employees().filter((employee) =>
          [employee.employeeNumber, employee.firstName, employee.lastName, employee.email, employee.jobTitle, employee.department.name]
            .some((value) => value.toLocaleLowerCase('fr').includes(query)),
        )
      : this.employees();
  });

  readonly form = this.fb.group({
    employeeNumber: ['', [Validators.required, Validators.maxLength(50)]],
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    phone: ['', [Validators.maxLength(30)]],
    jobTitle: ['', [Validators.required, Validators.maxLength(150)]],
    departmentId: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadEmployees();
    this.departmentService.getAll().subscribe({
      next: (departments) => this.departments.set(departments),
      error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)),
    });
  }

  can(permission: string): boolean { return this.authState.hasPermission(permission); }
  updateSearch(event: Event): void { this.search.set((event.target as HTMLInputElement).value); }

  loadEmployees(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.service.getAll().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (employees) => this.employees.set(employees),
      error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)),
    });
  }

  openCreateForm(): void {
    this.editing.set(null);
    this.form.reset({ employeeNumber: '', firstName: '', lastName: '', email: '', phone: '', jobTitle: '', departmentId: '' });
    this.formOpen.set(true);
  }

  openEditForm(employee: Employee): void {
    this.editing.set(employee);
    this.form.setValue({
      employeeNumber: employee.employeeNumber,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone ?? '',
      jobTitle: employee.jobTitle,
      departmentId: employee.departmentId,
    });
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
    this.editing.set(null);
    this.errorMessage.set('');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const values = this.form.getRawValue();
    const request: CreateEmployeeRequest = {
      employeeNumber: values.employeeNumber.trim().toUpperCase(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      jobTitle: values.jobTitle.trim(),
      departmentId: values.departmentId,
    };
    const employee = this.editing();
    const operation = employee ? this.service.update(employee.id, request) : this.service.create(request);
    this.saving.set(true);
    this.errorMessage.set('');
    operation.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => { this.closeForm(); this.loadEmployees(); },
      error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)),
    });
  }

  deactivate(employee: Employee): void {
    if (!window.confirm(`Voulez-vous désactiver ${employee.firstName} ${employee.lastName} ?`)) return;
    this.service.deactivate(employee.id).subscribe({
      next: () => this.employees.update((items) => items.filter((item) => item.id !== employee.id)),
      error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)),
    });
  }

  private extractError(error: HttpErrorResponse): string {
    if (error.status === 0) return 'Le backend est inaccessible.';
    const message = error.error?.message;
    return Array.isArray(message) ? message.join(' ') : message || 'Une erreur est survenue.';
  }
}
