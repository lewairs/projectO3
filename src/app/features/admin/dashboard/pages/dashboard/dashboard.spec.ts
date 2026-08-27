import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        {
          provide: DashboardService,
          useValue: {
            getDashboard: () => of({
              generatedAt: '2026-08-27T00:00:00.000Z',
              summary: { activeInterns: 0, internsAddedThisMonth: 0, activeInternships: 0, ongoingInternships: 0, activeProjects: 0, ongoingProjects: 0, activeSupervisors: 0, activeDepartments: 0 },
              statusBreakdown: {}, recentInterns: [], internshipTracking: [], recentActivities: [],
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
