import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundCladogram } from './round-cladogram.component';

describe('RoundCladogram', () => {
  let component: RoundCladogram;
  let fixture: ComponentFixture<RoundCladogram>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundCladogram]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundCladogram);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
