import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CladogramListComponent } from './cladogram-list.component';

describe('CladogramListComponent', () => {
  let component: CladogramListComponent;
  let fixture: ComponentFixture<CladogramListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CladogramListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CladogramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
