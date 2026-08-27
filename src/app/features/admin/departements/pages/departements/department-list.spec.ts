import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthStateService } from '../../../../../core/services/auth-state.service';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../interfaces/department.interface';
import { DepartmentList } from './department-list';

const createdDepartment: Department = {
  id: '11111111-1111-4111-8111-111111111111',
  code: 'DSI',
  name: 'Direction des systèmes d’information',
  description: 'Systèmes d’information',
  isActive: true,
  createdAt: '2026-08-27T10:00:00.000Z',
  updatedAt: '2026-08-27T10:00:00.000Z',
  createdById: null,
  updatedById: null,
};

describe('DepartmentList', () => {
  let component: DepartmentList;
  let fixture: ComponentFixture<DepartmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentList],
      providers: [
        {
          provide: DepartmentService,
          useValue: {
            getAll: () => of([]),
            create: () => of(createdDepartment),
          },
        },
        {
          provide: AuthStateService,
          useValue: { hasPermission: () => true },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays a department immediately after creation', () => {
    component.openCreateForm();
    component.form.setValue({
      code: 'DSI',
      name: 'Direction des systèmes d’information',
      description: 'Systèmes d’information',
    });

    component.submit();

    expect(component.departements()).toEqual([createdDepartment]);
    expect(component.formOpen()).toBe(false);
  });
});
