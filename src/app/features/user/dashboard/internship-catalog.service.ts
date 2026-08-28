import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { APP_ENVIRONMENT } from '../../../core/config/api.config';
import {
  InternshipCatalogQuery,
  InternshipCatalogResponse,
} from './internship-catalog.model';

@Injectable({ providedIn: 'root' })
export class InternshipCatalogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(APP_ENVIRONMENT).apiBaseUrl;

  getCatalog(query: InternshipCatalogQuery): Observable<InternshipCatalogResponse> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('limit', query.limit);

    if (query.q?.trim()) params = params.set('q', query.q.trim());
    if (query.departmentId) params = params.set('departmentId', query.departmentId);
    if (query.internshipStatus) params = params.set('internshipStatus', query.internshipStatus);
    if (query.projectStatus) params = params.set('projectStatus', query.projectStatus);

    return this.http.get<InternshipCatalogResponse>(
      `${this.baseUrl}/internships/tracking`,
      { params },
    );
  }
}
