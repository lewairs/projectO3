import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncadreurList } from './encadreur-list';

describe('EncadreurList', () => {
  let component: EncadreurList;
  let fixture: ComponentFixture<EncadreurList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncadreurList],
    }).compileComponents();

    fixture = TestBed.createComponent(EncadreurList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
