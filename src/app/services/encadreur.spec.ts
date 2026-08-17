import { TestBed } from '@angular/core/testing';

import { Encadreur } from './encadreur';

describe('Encadreur', () => {
  let service: Encadreur;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Encadreur);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
