import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPhylogeneticTreeComponent } from './round-phylogenetic-tree.component';

describe('RoundPhylogeneticTreeComponent', () => {
  let component: RoundPhylogeneticTreeComponent;
  let fixture: ComponentFixture<RoundPhylogeneticTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundPhylogeneticTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundPhylogeneticTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
