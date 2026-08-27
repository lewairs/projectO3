import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';

import { AuthStateService } from '../../../../core/services/auth-state.service';
import { UserAccount, UserEmployee, UserRole } from '../interfaces/user-account.model';
import { UserAccountService } from '../services/user-account.service';

type ModalMode = 'create' | 'edit' | 'reset' | 'view' | null;

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  private readonly service = inject(UserAccountService);
  private readonly authState = inject(AuthStateService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly users = signal<UserAccount[]>([]);
  readonly employees = signal<UserEmployee[]>([]);
  readonly roles = signal<UserRole[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly search = signal('');
  readonly roleFilter = signal('');
  readonly stateFilter = signal('');
  readonly passwordFilter = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly modalMode = signal<ModalMode>(null);
  readonly selected = signal<UserAccount | null>(null);

  readonly createForm = this.fb.group({
    employeeId: ['', Validators.required], roleId: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(128)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(128)]],
    mustChangePassword: [true],
  });
  readonly editForm = this.fb.group({ roleId: ['', Validators.required], isActive: [true] });
  readonly resetForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(128)]],
    confirmNewPassword: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(128)]],
    mustChangePassword: [true],
  });

  readonly availableEmployees = computed(() => {
    const used = new Set(this.users().map((user) => user.employeeId));
    return this.employees().filter((employee) => !used.has(employee.id));
  });
  readonly filteredUsers = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('fr');
    return this.users().filter((user) => {
      const employee = user.employee;
      const searchable = `${employee.firstName} ${employee.lastName} ${employee.email} ${employee.employeeNumber}`.toLocaleLowerCase('fr');
      return (!query || searchable.includes(query))
        && (!this.roleFilter() || user.roleId === this.roleFilter())
        && (!this.stateFilter() || String(user.isActive) === this.stateFilter())
        && (!this.passwordFilter() || String(user.mustChangePassword) === this.passwordFilter());
    });
  });
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredUsers().length / this.pageSize())));
  readonly pagedUsers = computed(() => {
    const start = (Math.min(this.page(), this.totalPages()) - 1) * this.pageSize();
    return this.filteredUsers().slice(start, start + this.pageSize());
  });

  ngOnInit(): void { this.load(); }
  can(permission: string): boolean { return this.authState.hasPermission(permission); }

  load(): void {
    this.loading.set(true); this.errorMessage.set('');
    forkJoin({ users: this.service.getAll(), employees: this.service.getEmployees(), roles: this.service.getRoles() })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: ({ users, employees, roles }) => { this.users.set(users); this.employees.set(employees); this.roles.set(roles); }, error: (error) => this.errorMessage.set(this.error(error)) });
  }

  updateSearch(event: Event): void { this.search.set((event.target as HTMLInputElement).value); this.page.set(1); }
  updateFilter(kind: 'role' | 'state' | 'password', event: Event): void { const value = (event.target as HTMLSelectElement).value; if (kind === 'role') this.roleFilter.set(value); if (kind === 'state') this.stateFilter.set(value); if (kind === 'password') this.passwordFilter.set(value); this.page.set(1); }
  updatePageSize(event: Event): void { this.pageSize.set(Number((event.target as HTMLSelectElement).value)); this.page.set(1); }
  previousPage(): void { this.page.update((page) => Math.max(1, page - 1)); }
  nextPage(): void { this.page.update((page) => Math.min(this.totalPages(), page + 1)); }

  openCreate(): void { this.selected.set(null); this.createForm.reset({ employeeId: '', roleId: '', password: '', confirmPassword: '', mustChangePassword: true }); this.modalMode.set('create'); }
  openView(user: UserAccount): void { this.selected.set(user); this.modalMode.set('view'); }
  openEdit(user: UserAccount): void { this.selected.set(user); this.editForm.reset({ roleId: user.roleId, isActive: user.isActive }); this.modalMode.set('edit'); }
  openReset(user: UserAccount): void { this.selected.set(user); this.resetForm.reset({ newPassword: '', confirmNewPassword: '', mustChangePassword: true }); this.modalMode.set('reset'); }
  closeModal(): void { this.modalMode.set(null); this.selected.set(null); this.errorMessage.set(''); }

  submitCreate(): void {
    if (this.createForm.invalid || this.createForm.value.password !== this.createForm.value.confirmPassword) { this.createForm.markAllAsTouched(); this.errorMessage.set('Les mots de passe doivent être identiques et contenir au moins 15 caractères.'); return; }
    this.runSave(this.service.create(this.createForm.getRawValue()), (created) => this.users.update((users) => [created, ...users]));
  }
  submitEdit(): void {
    const user = this.selected(); if (!user || this.editForm.invalid) return;
    this.runSave(this.service.update(user.id, this.editForm.getRawValue()), (updated) => this.replace(updated));
  }
  submitReset(): void {
    const user = this.selected(); const value = this.resetForm.getRawValue();
    if (!user || this.resetForm.invalid || value.newPassword !== value.confirmNewPassword) { this.resetForm.markAllAsTouched(); this.errorMessage.set('Les mots de passe doivent être identiques et contenir au moins 15 caractères.'); return; }
    this.saving.set(true); this.service.resetPassword(user.id, value).pipe(finalize(() => this.saving.set(false))).subscribe({ next: (updated) => { this.replace(updated); this.closeModal(); }, error: (error) => this.errorMessage.set(this.error(error)) });
  }
  toggleActive(user: UserAccount): void {
    const action = user.isActive ? 'désactiver' : 'réactiver'; if (!window.confirm(`Voulez-vous ${action} ce compte ?`)) return;
    if (user.isActive) {
      this.service.deactivate(user.id).subscribe({ next: (updated) => this.replace(updated), error: (error: HttpErrorResponse) => this.errorMessage.set(this.error(error)) });
      return;
    }
    this.service.update(user.id, { isActive: true }).subscribe({ next: (updated) => this.replace(updated), error: (error: HttpErrorResponse) => this.errorMessage.set(this.error(error)) });
  }
  fullName(user: UserAccount): string { return `${user.employee.firstName} ${user.employee.lastName}`; }
  date(value: string | null): string { return value ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value)) : 'Jamais'; }

  private runSave(operation: ReturnType<UserAccountService['create']>, success: (user: UserAccount) => void): void { this.saving.set(true); this.errorMessage.set(''); operation.pipe(finalize(() => this.saving.set(false))).subscribe({ next: (user) => { success(user); this.closeModal(); }, error: (error) => this.errorMessage.set(this.error(error)) }); }
  private replace(updated: UserAccount): void { this.users.update((users) => users.map((user) => user.id === updated.id ? updated : user)); }
  private error(error: HttpErrorResponse): string { const message = error.error?.message; return error.status === 0 ? 'Le backend est inaccessible.' : Array.isArray(message) ? message.join(' ') : message || 'Une erreur est survenue.'; }
}
