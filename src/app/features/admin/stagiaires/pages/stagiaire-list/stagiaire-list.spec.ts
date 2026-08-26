import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireList } from './stagiaire-list';

describe('StagiaireList', () => {
  let component: StagiaireList;
  let fixture: ComponentFixture<StagiaireList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagiaireList],
    }).compileComponents();

    fixture = TestBed.createComponent(StagiaireList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
