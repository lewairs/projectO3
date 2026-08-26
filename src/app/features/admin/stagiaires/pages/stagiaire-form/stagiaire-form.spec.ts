import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireForm } from './stagiaire-form';

describe('StagiaireForm', () => {
  let component: StagiaireForm;
  let fixture: ComponentFixture<StagiaireForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireForm],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
