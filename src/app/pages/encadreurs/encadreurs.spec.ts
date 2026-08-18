import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Encadreurs } from './encadreurs';

describe('Encadreurs', () => {
  let component: Encadreurs;
  let fixture: ComponentFixture<Encadreurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Encadreurs],
    }).compileComponents();

    fixture = TestBed.createComponent(Encadreurs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
