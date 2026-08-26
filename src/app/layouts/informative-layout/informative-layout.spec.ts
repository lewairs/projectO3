import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { InformativeLayout } from './informative-layout';

describe('InformativeLayout', () => {
  let component: InformativeLayout;
  let fixture: ComponentFixture<InformativeLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformativeLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(InformativeLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
