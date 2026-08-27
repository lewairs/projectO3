import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthStateService } from '../../../../core/services/auth-state.service';
import { RoleService } from '../services/role.service';
import { Roles } from './roles';

describe('Roles', () => {
  let component: Roles;
  let fixture: ComponentFixture<Roles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Roles],
      providers: [
        {
          provide: RoleService,
          useValue: { getAll: () => of([]) },
        },
        {
          provide: AuthStateService,
          useValue: { hasPermission: () => true },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Roles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
