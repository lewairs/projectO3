import { TestBed } from '@angular/core/testing';

import { InternshipService } from './internship.service';

describe('InternshipService', () => {
  let service: InternshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [InternshipService] });
    service = TestBed.inject(InternshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
