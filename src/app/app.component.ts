import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoundPhylogeneticTreeComponent } from './components/trees/round-phylogenetic-tree/round-phylogenetic-tree.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RoundPhylogeneticTreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'dinosauria-super-tree';
}
