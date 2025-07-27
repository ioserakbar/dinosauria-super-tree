import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faX, faPlay, faHexagonNodes, faBug, faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pt-floating-menu',
  imports: [FontAwesomeModule, NgIf],
  templateUrl: './floating-menu.component.html'
})
export class FloatingMenuComponent {
  faBars = faBars;
  faX = faX;
  faPlay = faPlay;
  faHexagonNodes = faHexagonNodes;
  faBug = faBug;
  faStar = faStar;

  isMenuOpened = true;



  toggleMenu(){
    this.isMenuOpened = !this.isMenuOpened;
    document.getElementById('options-menu')?.classList.toggle("opened")
  }

}
