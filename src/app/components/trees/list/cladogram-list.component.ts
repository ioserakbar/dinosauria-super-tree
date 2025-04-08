import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { RenderLineComponent } from './list-component/render-line/render-line.component';
import { Clade } from '../../../shared/models/Clade';
import { Species } from '../../../shared/models/Species';
import { CladeListElement } from '../../../shared/models/cladeListElement';
import { CladeService } from '../../../services/clade/clade.service';
import { SpeciesService } from '../../../services/species/species.service';
import { forkJoin, Observable } from 'rxjs'
import { NgFor, NgSwitch, NgSwitchDefault, NgSwitchCase } from '@angular/common';



@Component({
  selector: 'pt-cladogram-list',
  imports: [NgbAccordionModule, RenderLineComponent, NgFor, NgSwitch, NgSwitchDefault, NgSwitchCase],
  templateUrl: './cladogram-list.component.html',
  styleUrl: './cladogram-list.component.css'
})
export class CladogramListComponent{
  
  //data variables
  dummyClade: Clade[] = []
  dummySpecies: Species[] = []

  family: any

  

  constructor( 
    private cladeService: CladeService,
    private speciesService: SpeciesService
  ) { 

    const $species = this.speciesService.getAll()
    const $clades = this.cladeService.getAll()

    forkJoin([$species, $clades]).subscribe(results => {
      this.dummySpecies = results[0]
      this.dummyClade = results[1]

      this.family = this.getFamilyStringArray(); 
    })
  }

  getFamilyStringArray(){
    
    console.log(this.dummyClade)

    var result: any[] = []

    this.dummyClade.forEach(clade => {
      var line: any[] = [];

      var element: CladeListElement = new CladeListElement();
        for (let i = 0; i < clade.tier; i++) {
          var element2: CladeListElement = new CladeListElement();
  
          element2.type = "filler"
          element2.tiles = 1;
          element2.lineType = "no-line"
          line.push(element2)
        }
        
        element.type = "content"
        element.content = clade.name
        element.labelClass = "tiles-4"
        line.push(element)
      

      result.push(line)
      
    });

    return result
  }  

  generateFamilyStringArray(data: Clade[]){ 
    console.log(data)
  }
  
  hack(val:any) {
    return Array.from(val);
  }

}
 