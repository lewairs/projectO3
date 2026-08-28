import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { APP_ENVIRONMENT } from '../../../core/config/api.config';
import { InternshipCatalogService } from './internship-catalog.service';

describe('InternshipCatalogService', () => {
  let service: InternshipCatalogService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_ENVIRONMENT, useValue: { production: false, apiBaseUrl: '/backend' } },
      ],
    });
    service = TestBed.inject(InternshipCatalogService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('transmet la recherche, les filtres et la pagination au suivi des stages', () => {
    service.getCatalog({
      q: 'Moussa', departmentId: 'department-id', internshipStatus: 'ONGOING',
      projectStatus: 'PLANNED', page: 2, limit: 9,
    }).subscribe();

    const request = http.expectOne((candidate) => candidate.url === '/backend/internships/tracking');
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('q')).toBe('Moussa');
    expect(request.request.params.get('departmentId')).toBe('department-id');
    expect(request.request.params.get('internshipStatus')).toBe('ONGOING');
    expect(request.request.params.get('projectStatus')).toBe('PLANNED');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('limit')).toBe('9');
    request.flush({ summary: {}, items: [], filters: { departments: [] }, pagination: {} });
  });
});
