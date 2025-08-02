import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'pt-horizontal-line',
  imports: [NgIf],
  templateUrl: './horizontal-line.component.html',
  styleUrl: './horizontal-line.component.css'
})
export class HorizontalLineComponent {

  @Input({required: false})
  tiles = .2

  @Input({required: false})
  whitespase?: boolean = false

  @Input({required: false})
  bottomConnection?: boolean = false

  tileWidth = 50

}
