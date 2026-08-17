import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncadreurForm } from './encadreur-form';

describe('EncadreurForm', () => {
  let component: EncadreurForm;
  let fixture: ComponentFixture<EncadreurForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncadreurForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EncadreurForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
