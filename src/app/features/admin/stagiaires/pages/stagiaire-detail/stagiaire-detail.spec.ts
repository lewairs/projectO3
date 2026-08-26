import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireDetail } from './stagiaire-detail';

describe('StagiaireDetail', () => {
  let component: StagiaireDetail;
  let fixture: ComponentFixture<StagiaireDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
