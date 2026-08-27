import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin, of } from 'rxjs';

import { AuthStateService } from '../../../../core/services/auth-state.service';
import { CreateRoleRequest, Permission, Role } from '../interfaces/role.model';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-roles',
  imports: [ReactiveFormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {
  private readonly service = inject(RoleService);
  private readonly authState = inject(AuthStateService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly roles = signal<Role[]>([]);
  readonly search = signal('');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly formOpen = signal(false);
  readonly editing = signal<Role | null>(null);
  readonly selectedRole = signal<Role | null>(null);
  readonly permissions = signal<Permission[]>([]);
  readonly selectedPermissionIds = signal<Set<string>>(new Set());
  readonly permissionsOpen = signal(false);
  readonly permissionsReadOnly = signal(true);
  readonly errorMessage = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(10);

  readonly filteredRoles = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('fr');
    return query
      ? this.roles().filter((role) =>
          [role.name, role.description ?? ''].some((value) =>
            value.toLocaleLowerCase('fr').includes(query),
          ),
        )
      : this.roles();
  });
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredRoles().length / this.pageSize())));
  readonly pagedRoles = computed(() => { const start = (Math.min(this.page(), this.totalPages()) - 1) * this.pageSize(); return this.filteredRoles().slice(start, start + this.pageSize()); });
  readonly permissionGroups = computed(() => {
    const groups = new Map<string, Permission[]>();
    const permissions = this.permissions().length
      ? this.permissions()
      : this.selectedRole()?.permissions ?? [];
    for (const permission of permissions) groups.set(permission.category, [...(groups.get(permission.category) ?? []), permission]);
    return [...groups.entries()].map(([category, permissions]) => ({ category, permissions }));
  });

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: [''],
  });

  ngOnInit(): void { this.loadRoles(); }
  can(permission: string): boolean { return this.authState.hasPermission(permission); }
  updateSearch(event: Event): void { this.search.set((event.target as HTMLInputElement).value); this.page.set(1); }
  updatePageSize(event: Event): void { this.pageSize.set(Number((event.target as HTMLSelectElement).value)); this.page.set(1); }
  previousPage(): void { this.page.update((page) => Math.max(1, page - 1)); }
  nextPage(): void { this.page.update((page) => Math.min(this.totalPages(), page + 1)); }

  loadRoles(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    forkJoin({
      roles: this.service.getAll(),
      permissions: this.can('permissions.read') ? this.service.getPermissions() : of([]),
    }).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: ({ roles, permissions }) => { this.roles.set(roles); this.permissions.set(permissions); },
      error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)),
    });
  }

  openPermissions(role: Role, readOnly: boolean): void {
    this.selectedRole.set(role);
    this.selectedPermissionIds.set(new Set(role.permissions.map((permission) => permission.id)));
    this.permissionsReadOnly.set(readOnly);
    this.permissionsOpen.set(true);
  }

  closePermissions(): void { this.permissionsOpen.set(false); this.selectedRole.set(null); this.errorMessage.set(''); }
  isPermissionSelected(id: string): boolean { return this.selectedPermissionIds().has(id); }
  togglePermission(id: string): void { if (this.permissionsReadOnly()) return; this.selectedPermissionIds.update((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; }); }
  savePermissions(): void {
    const role = this.selectedRole(); if (!role) return;
    this.saving.set(true); this.service.updatePermissions(role.id, [...this.selectedPermissionIds()]).pipe(finalize(() => this.saving.set(false))).subscribe({ next: (updated) => { this.roles.update((roles) => roles.map((item) => item.id === updated.id ? updated : item)); this.closePermissions(); }, error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)) });
  }

  openCreateForm(): void {
    this.editing.set(null);
    this.form.reset({ name: '', description: '' });
    this.formOpen.set(true);
  }

  openEditForm(role: Role): void {
    this.editing.set(role);
    this.form.setValue({ name: role.name, description: role.description ?? '' });
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
    const request: CreateRoleRequest = {
      name: values.name.trim().toUpperCase(),
      ...(values.description.trim() ? { description: values.description.trim() } : {}),
    };
    const role = this.editing();
    const operation = role ? this.service.update(role.id, request) : this.service.create(request);
    this.saving.set(true);
    this.errorMessage.set('');
    operation.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => { this.closeForm(); this.loadRoles(); },
      error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)),
    });
  }

  deactivate(role: Role): void {
    if (!window.confirm(`Voulez-vous désactiver le rôle « ${role.name} » ?`)) return;
    this.service.deactivate(role.id).subscribe({
      next: () => this.roles.update((items) => items.filter((item) => item.id !== role.id)),
      error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)),
    });
  }

  private extractError(error: HttpErrorResponse): string {
    if (error.status === 0) return 'Le backend est inaccessible.';
    const message = error.error?.message;
    return Array.isArray(message) ? message.join(' ') : message || 'Une erreur est survenue.';
  }
}
