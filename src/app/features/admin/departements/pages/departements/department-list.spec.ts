import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthStateService } from '../../../../../core/services/auth-state.service';
import { DepartmentService } from '../../services/department.service';
import { DepartmentList } from './department-list';

describe('DepartmentList', () => {
  let component: DepartmentList;
  let fixture: ComponentFixture<DepartmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentList],
      providers: [
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

    fixture = TestBed.createComponent(DepartmentList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
