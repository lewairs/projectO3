import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthStateService } from '../../../../core/services/auth-state.service';
import { CreateRoleRequest, Role } from '../interfaces/role.model';
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
  readonly errorMessage = signal('');

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

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: [''],
  });

  ngOnInit(): void { this.loadRoles(); }
  can(permission: string): boolean { return this.authState.hasPermission(permission); }
  updateSearch(event: Event): void { this.search.set((event.target as HTMLInputElement).value); }

  loadRoles(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.service.getAll().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (roles) => this.roles.set(roles),
      error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)),
    });
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
