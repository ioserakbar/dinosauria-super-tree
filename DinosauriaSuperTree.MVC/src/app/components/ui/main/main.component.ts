import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RoundCladogramComponent } from '../../trees/round-cladogram/round-cladogram.component';
import { AddSpeciesComponent } from "../add/species/add-species.component";
import { AddCladeComponent } from '../add/clade/add-clade.component';
import { CladogramListComponent } from '../../trees/list/cladogram-list.component';
import { TestComponent } from "../testGround/test/test.component";

@Component({
  selector: 'pt-main',
  imports: [NgbNavModule, RoundCladogramComponent, AddSpeciesComponent, AddCladeComponent, CladogramListComponent, TestComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  active = 5;
}
