import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RoundPhylogeneticTreeComponent } from '../../trees/round-phylogenetic-tree/round-phylogenetic-tree.component';

@Component({
  selector: 'pt-main',
  imports: [NgbNavModule, RoundPhylogeneticTreeComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  active = 1;
}
