import { Component } from '@angular/core';
import { NgSwitch, NgSwitchDefault, NgSwitchCase } from '@angular/common';
import { Input } from '@angular/core';
import { WIDTH_FOR_LIST } from '../../../../../shared/constants/cssVariables';

@Component({
  selector: 'pt-render-line',
  imports: [NgSwitch, NgSwitchDefault, NgSwitchCase],
  templateUrl: './render-line.component.html',
  styleUrl: './render-line.component.css'
})
export class RenderLineComponent {
  @Input({required: true})
  type!: string

  @Input()
  tiles = 1;

  tileWidth = WIDTH_FOR_LIST;

}
