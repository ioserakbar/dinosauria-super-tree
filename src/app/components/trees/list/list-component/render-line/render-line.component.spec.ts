import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderLineComponent } from './render-line.component';

describe('RenderLineComponent', () => {
  let component: RenderLineComponent;
  let fixture: ComponentFixture<RenderLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenderLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenderLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
