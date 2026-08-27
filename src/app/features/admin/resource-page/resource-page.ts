import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, finalize } from 'rxjs';

import { APP_ENVIRONMENT } from '../../../core/config/api.config';
import { AuthStateService } from '../../../core/services/auth-state.service';
import {
  RESOURCE_CONFIGS,
  ResourceColumn,
  ResourceField,
  ResourcePageConfig,
  ResourceRecord,
} from './resource-page.config';

type FormValue = string | number | null;

@Component({
  selector: 'app-resource-page',
  imports: [ReactiveFormsModule],
  templateUrl: './resource-page.html',
  styleUrl: './resource-page.css',
})
export class ResourcePage implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly environment = inject(APP_ENVIRONMENT);
  private readonly authState = inject(AuthStateService);
  private routeSubscription?: Subscription;

  readonly config = signal<ResourcePageConfig>(RESOURCE_CONFIGS['positions']);
  readonly records = signal<ResourceRecord[]>([]);
  readonly options = signal<Record<string, ResourceRecord[]>>({});
  readonly search = signal('');
  readonly filters = signal<Record<string, string>>({});
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly modalOpen = signal(false);
  readonly editing = signal<ResourceRecord | null>(null);
  readonly viewing = signal<ResourceRecord | null>(null);
  readonly errorMessage = signal('');
  form = new FormGroup<Record<string, FormControl<FormValue>>>({});

  readonly filterFields = computed(() =>
    (this.config().filters ?? this.config().fields.filter((field) => field.type === 'select')).slice(0, 4),
  );

  readonly filteredRecords = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('fr');
    return this.records().filter((record) => {
      const matchesSearch =
        !query ||
        this.config().searchPaths.some((path) =>
          String(this.readPath(record, path) ?? '')
            .toLocaleLowerCase('fr')
            .includes(query),
        );
      const matchesFilters = Object.entries(this.filters()).every(([name, expected]) => {
        if (!expected) return true;
        const field = this.filterFields().find((candidate) => candidate.name === name);
        const actual = field?.filterValue
          ? field.filterValue(record)
          : this.readPath(record, field?.filterPath ?? name);
        return String(actual ?? '') === expected;
      });
      return matchesSearch && matchesFilters;
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredRecords().length / this.pageSize())),
  );

  readonly pagedRecords = computed(() => {
    const safePage = Math.min(this.page(), this.totalPages());
    const start = (safePage - 1) * this.pageSize();
    return this.filteredRecords().slice(start, start + this.pageSize());
  });

  ngOnInit(): void {
    this.routeSubscription = this.route.data.subscribe((data) => {
      const key = String(data['resourceKey'] ?? 'positions');
      const config = RESOURCE_CONFIGS[key];
      if (!config) return;
      this.config.set(config);
      this.search.set('');
      this.filters.set({});
      this.page.set(1);
      this.buildForm();
      this.loadOptions();
      this.loadRecords();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  can(action: 'create' | 'update' | 'deactivate'): boolean {
    return this.authState.hasPermission(`${this.config().permissionPrefix}.${action}`);
  }

  updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  updateFilter(field: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.update((filters) => ({ ...filters, [field]: value }));
    this.page.set(1);
  }

  updatePageSize(event: Event): void {
    this.pageSize.set(Number((event.target as HTMLSelectElement).value));
    this.page.set(1);
  }

  previousPage(): void {
    this.page.update((page) => Math.max(1, page - 1));
  }

  nextPage(): void {
    this.page.update((page) => Math.min(this.totalPages(), page + 1));
  }

  display(record: ResourceRecord, column: ResourceColumn): string {
    const value = column.value
      ? column.value(record)
      : this.readPath(record, column.path ?? '');
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value));
    }
    return String(value);
  }

  fieldOptions(field: ResourceField): Array<{ value: string; label: string }> {
    if (field.options) return field.options;
    return (this.options()[field.name] ?? []).map((record) => ({
      value: record.id,
      label: field.optionLabel?.(record) ?? String(record['name'] ?? record.id),
    }));
  }

  loadRecords(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.http
      .get<unknown>(`${this.environment.apiBaseUrl}${this.config().endpoint}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const items = this.config().responseItemsPath
            ? this.readPath(response as ResourceRecord, this.config().responseItemsPath!)
            : response;
          this.records.set(Array.isArray(items) ? (items as ResourceRecord[]) : []);
        },
        error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)),
      });
  }

  openCreateModal(): void {
    this.editing.set(null);
    this.viewing.set(null);
    this.resetForm();
    this.modalOpen.set(true);
  }

  openEditModal(record: ResourceRecord): void {
    this.editing.set(record);
    this.viewing.set(null);
    const values: Record<string, FormValue> = {};
    for (const field of this.config().fields) {
      let value = record[field.name] as FormValue;
      if (field.type === 'date' && typeof value === 'string') value = value.slice(0, 10);
      values[field.name] = value ?? '';
    }
    this.form.reset(values);
    this.modalOpen.set(true);
  }

  openViewModal(record: ResourceRecord): void {
    this.viewing.set(record);
    this.editing.set(null);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editing.set(null);
    this.viewing.set(null);
    this.errorMessage.set('');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.createPayload();
    const editing = this.editing();
    const endpoint = `${this.environment.apiBaseUrl}${this.config().endpoint}`;
    const operation = editing
      ? this.http.patch<ResourceRecord>(`${endpoint}/${editing.id}`, payload)
      : this.http.post<ResourceRecord>(endpoint, payload);
    this.saving.set(true);
    this.errorMessage.set('');
    operation.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (saved) => {
        this.records.update((records) => {
          const exists = records.some((record) => record.id === saved.id);
          return exists
            ? records.map((record) => (record.id === saved.id ? saved : record))
            : [saved, ...records];
        });
        this.closeModal();
      },
      error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)),
    });
  }

  deactivate(record: ResourceRecord): void {
    if (!window.confirm(`Voulez-vous vraiment désactiver ce ${this.config().itemLabel} ?`)) return;
    const endpoint = `${this.environment.apiBaseUrl}${this.config().endpoint}/${record.id}`;
    this.http.delete(endpoint).subscribe({
      next: () => this.records.update((records) => records.filter((item) => item.id !== record.id)),
      error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)),
    });
  }

  private buildForm(): void {
    const controls: Record<string, FormControl<FormValue>> = {};
    for (const field of this.config().fields) {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
      if (field.min !== undefined) validators.push(Validators.min(field.min));
      if (field.max !== undefined) validators.push(Validators.max(field.max));
      if (field.type === 'email') validators.push(Validators.email);
      controls[field.name] = new FormControl<FormValue>(field.defaultValue ?? '', validators);
    }
    this.form = new FormGroup(controls);
  }

  private resetForm(): void {
    const values: Record<string, FormValue> = {};
    for (const field of this.config().fields) values[field.name] = field.defaultValue ?? '';
    this.form.reset(values);
  }

  private loadOptions(): void {
    this.options.set({});
    const optionFields = [...this.config().fields, ...(this.config().filters ?? [])]
      .filter((item, index, fields) => item.optionsEndpoint && fields.findIndex((candidate) => candidate.name === item.name) === index);
    for (const field of optionFields) {
      this.http
        .get<ResourceRecord[]>(`${this.environment.apiBaseUrl}${field.optionsEndpoint}`)
        .subscribe({
          next: (records) => this.options.update((current) => ({ ...current, [field.name]: records })),
          error: (error: HttpErrorResponse) => this.errorMessage.set(this.extractError(error)),
        });
    }
  }

  private createPayload(): Record<string, unknown> {
    const raw = this.form.getRawValue();
    const payload: Record<string, unknown> = {};
    for (const field of this.config().fields) {
      const value = raw[field.name];
      if (value === '' || value === undefined) {
        if (field.nullable) payload[field.name] = null;
        else if (
          this.editing() &&
          !field.required &&
          ['text', 'textarea', 'url'].includes(field.type)
        ) payload[field.name] = '';
        continue;
      }
      payload[field.name] = field.type === 'number' ? Number(value) : value;
    }
    return payload;
  }

  private readPath(source: ResourceRecord, path: string): unknown {
    return path.split('.').reduce<unknown>((value, segment) => {
      if (value === null || value === undefined) return undefined;
      if (Array.isArray(value)) return value[Number(segment)];
      return (value as Record<string, unknown>)[segment];
    }, source);
  }

  private extractError(error: HttpErrorResponse): string {
    if (error.status === 0) return 'Le backend est inaccessible.';
    const message = error.error?.message;
    return Array.isArray(message) ? message.join(' ') : message || 'Une erreur est survenue.';
  }
}
