import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalLineEndComponent } from './vertical-line-end.component';

describe('VerticalLineEndComponent', () => {
  let component: VerticalLineEndComponent;
  let fixture: ComponentFixture<VerticalLineEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalLineEndComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalLineEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
