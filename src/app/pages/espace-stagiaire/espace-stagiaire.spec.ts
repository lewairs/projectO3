import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceStagiaire } from './espace-stagiaire';

describe('EspaceStagiaire', () => {
  let component: EspaceStagiaire;
  let fixture: ComponentFixture<EspaceStagiaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspaceStagiaire],
    }).compileComponents();

    fixture = TestBed.createComponent(EspaceStagiaire);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
