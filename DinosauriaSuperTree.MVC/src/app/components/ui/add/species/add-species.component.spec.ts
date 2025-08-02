import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpeciesComponent } from './add-species.component';

describe('AddSpeciesComponent', () => {
  let component: AddSpeciesComponent;
  let fixture: ComponentFixture<AddSpeciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSpeciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
