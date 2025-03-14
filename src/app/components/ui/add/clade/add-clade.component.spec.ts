import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCladeComponent } from './add-clade.component';

describe('AddCladeComponent', () => {
  let component: AddCladeComponent;
  let fixture: ComponentFixture<AddCladeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCladeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCladeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
