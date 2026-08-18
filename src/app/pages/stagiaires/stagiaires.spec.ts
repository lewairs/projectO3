import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stagiaires } from './stagiaires';

describe('Stagiaires', () => {
  let component: Stagiaires;
  let fixture: ComponentFixture<Stagiaires>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stagiaires],
    }).compileComponents();

    fixture = TestBed.createComponent(Stagiaires);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
