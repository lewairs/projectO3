import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_ENVIRONMENT } from '../config/api.config';

export interface DatabaseHealth {
  status: 'ok';
  database: 'mysql';
  roleCount: number;
  checkedAt: string;
}

@Injectable({ providedIn: 'root' })
export class BackendHealthService {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(APP_ENVIRONMENT);

  checkDatabase(): Observable<DatabaseHealth> {
    return this.http.get<DatabaseHealth>(
      `${this.environment.apiBaseUrl}/health/database`,
    );
  }
}
