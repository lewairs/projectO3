import { TestBed } from '@angular/core/testing';

import { InternService } from './intern.service';

describe('InternService', () => {
  let service: InternService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [InternService] });
    service = TestBed.inject(InternService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
