import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthStateService } from '../../../../core/services/auth-state.service';
import { DepartmentService } from '../../departements/services/department.service';
import { EmployeeService } from '../services/employee.service';
import { Utilisateurs } from './utilisateurs';

describe('Utilisateurs', () => {
  let component: Utilisateurs;
  let fixture: ComponentFixture<Utilisateurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Utilisateurs],
      providers: [
        {
          provide: EmployeeService,
          useValue: { getAll: () => of([]) },
        },
        {
          provide: DepartmentService,
          useValue: { getAll: () => of([]) },
        },
        {
          provide: AuthStateService,
          useValue: { hasPermission: () => true },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Utilisateurs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
