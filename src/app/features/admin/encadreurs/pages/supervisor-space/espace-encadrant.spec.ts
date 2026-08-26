import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EspaceEncadrant } from './espace-encadrant';

describe('EspaceEncadrant', () => {
  let component: EspaceEncadrant;
  let fixture: ComponentFixture<EspaceEncadrant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspaceEncadrant],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EspaceEncadrant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
