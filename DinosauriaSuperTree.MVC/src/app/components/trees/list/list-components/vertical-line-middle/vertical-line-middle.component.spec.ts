import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalLineMiddleComponent } from './vertical-line-middle.component';

describe('VerticalLineMiddleComponent', () => {
  let component: VerticalLineMiddleComponent;
  let fixture: ComponentFixture<VerticalLineMiddleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalLineMiddleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalLineMiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
