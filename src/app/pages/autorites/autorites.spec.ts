import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Autorites } from './autorites';

describe('Autorites', () => {
  let component: Autorites;
  let fixture: ComponentFixture<Autorites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Autorites],
    }).compileComponents();

    fixture = TestBed.createComponent(Autorites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
