import { Component, ElementRef, HostListener, ViewChild, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'pt-round-phylogenetic-tree',
  imports: [],
  templateUrl: './round-phylogenetic-tree.component.html',
  styleUrl: './round-phylogenetic-tree.component.css'
})
export class RoundPhylogeneticTreeComponent {
  @ViewChild('canvas') canvas! : ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {  }
  ngAfterViewInit(){
    if (isPlatformBrowser(this.platformId)) {
      this.resizeCanvas();
    }
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeCanvas();
  }


  resizeCanvas(){
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
  }
}
