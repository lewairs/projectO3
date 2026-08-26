import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentInterns } from './recent-interns';

describe('RecentInterns', () => {
  let component: RecentInterns;
  let fixture: ComponentFixture<RecentInterns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentInterns],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentInterns);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
