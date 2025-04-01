import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { HorizontalLineComponent } from './list-components/horizontal-line/horizontal-line.component';
import { VerticalLineMiddleComponent } from './list-components/vertical-line-middle/vertical-line-middle.component';
import { VerticalLineEndComponent } from "./list-components/vertical-line-end/vertical-line-end.component";
import { RenderLineComponent } from './list-component/render-line/render-line.component';

@Component({
  selector: 'pt-cladogram-list',
  imports: [NgbAccordionModule, RenderLineComponent],
  templateUrl: './cladogram-list.component.html',
  styleUrl: './cladogram-list.component.css'
})
export class CladogramListComponent {
  
}
