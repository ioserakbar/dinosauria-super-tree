import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RoundPhylogeneticTreeComponent } from '../../trees/round-phylogenetic-tree/round-phylogenetic-tree.component';
import { AddSpeciesComponent } from "../add/species/add-species.component";
import { AddCladeComponent } from '../add/clade/add-clade.component';

@Component({
  selector: 'pt-main',
  imports: [NgbNavModule, RoundPhylogeneticTreeComponent, AddSpeciesComponent, AddCladeComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  active = 1;
}
