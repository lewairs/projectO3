import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthStateService } from '../../../../../core/services/auth-state.service';
import { DepartmentService } from '../../services/department.service';
import {
  CreateDepartmentRequest,
  Department,
} from '../../interfaces/department.interface';

@Component({
  selector: 'app-department-list',
  imports: [ReactiveFormsModule],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css',
})
export class DepartmentList implements OnInit {
  private readonly service = inject(DepartmentService);
  private readonly authState = inject(AuthStateService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly departements = signal<Department[]>([]);
  readonly search = signal('');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly formOpen = signal(false);
  readonly editing = signal<Department | null>(null);
  readonly errorMessage = signal('');

  readonly filteredDepartements = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('fr');
    if (!query) {
      return this.departements();
    }
    return this.departements().filter((departement) =>
      [departement.code, departement.name, departement.description ?? ''].some(
        (value) => value.toLocaleLowerCase('fr').includes(query),
      ),
    );
  });

  readonly form = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: [''],
  });

  ngOnInit(): void {
    this.loadDepartements();
  }

  can(permission: string): boolean {
    return this.authState.hasPermission(permission);
  }

  updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  loadDepartements(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.service
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (departements) => this.departements.set(departements),
        error: (error: HttpErrorResponse) =>
          this.errorMessage.set(this.extractError(error)),
      });
  }

  openCreateForm(): void {
    this.editing.set(null);
    this.form.reset({ code: '', name: '', description: '' });
    this.formOpen.set(true);
  }

  openEditForm(departement: Department): void {
    this.editing.set(departement);
    this.form.setValue({
      code: departement.code,
      name: departement.name,
      description: departement.description ?? '',
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
    const request: CreateDepartmentRequest = {
      code: values.code.trim().toUpperCase(),
      name: values.name.trim(),
      ...(values.description.trim()
        ? { description: values.description.trim() }
        : {}),
    };
    const editing = this.editing();
    const operation = editing
      ? this.service.update(editing.id, request)
      : this.service.create(request);

    this.saving.set(true);
    this.errorMessage.set('');
    operation.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (savedDepartment) => {
        this.departements.update((items) => {
          const departmentExists = items.some(
            (item) => item.id === savedDepartment.id,
          );
          const updatedItems = departmentExists
            ? items.map((item) =>
                item.id === savedDepartment.id ? savedDepartment : item,
              )
            : [...items, savedDepartment];

          return updatedItems.sort((first, second) =>
            first.name.localeCompare(second.name, 'fr'),
          );
        });
        this.closeForm();
      },
      error: (error: HttpErrorResponse) =>
        this.errorMessage.set(this.extractError(error)),
    });
  }

  deactivate(departement: Department): void {
    const confirmed = window.confirm(
      `Voulez-vous vraiment désactiver le département « ${departement.name} » ?`,
    );
    if (!confirmed) {
      return;
    }

    this.service.deactivate(departement.id).subscribe({
      next: () =>
        this.departements.update((items) =>
          items.filter((item) => item.id !== departement.id),
        ),
      error: (error: HttpErrorResponse) =>
        this.errorMessage.set(this.extractError(error)),
    });
  }

  private extractError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Le backend est inaccessible.';
    }
    const message = error.error?.message;
    return Array.isArray(message)
      ? message.join(' ')
      : message || 'Une erreur est survenue.';
  }
}
