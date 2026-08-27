import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DepartmentService } from './department.service';
import { APP_ENVIRONMENT } from '../../../../core/config/api.config';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: APP_ENVIRONMENT,
          useValue: { production: false, apiBaseUrl: '/backend' },
        },
      ],
    });
    service = TestBed.inject(DepartmentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads active departments from the REST collection endpoint', () => {
    service.getAll().subscribe((departements) => {
      expect(departements[0].code).toBe('DSI');
    });

    const request = http.expectOne('/backend/departments');
    expect(request.request.method).toBe('GET');
    request.flush([
      {
        id: 'department-id',
        code: 'DSI',
        name: 'Direction des systèmes d’information',
        description: null,
        isActive: true,
        createdAt: '2026-08-26T00:00:00.000Z',
        updatedAt: '2026-08-26T00:00:00.000Z',
        createdById: null,
        updatedById: null,
      },
    ]);
  });

  it('falls back to the legacy path endpoint for the older backend', () => {
    service.getAll().subscribe((departements) => {
      expect(departements).toEqual([]);
    });

    const collectionRequest = http.expectOne('/backend/departments');
    collectionRequest.flush(
      { message: 'Cannot GET /departments' },
      { status: 404, statusText: 'Not Found' },
    );

    const legacyRequest = http.expectOne('/backend/departments/path');
    expect(legacyRequest.request.method).toBe('GET');
    legacyRequest.flush([]);
  });
});
