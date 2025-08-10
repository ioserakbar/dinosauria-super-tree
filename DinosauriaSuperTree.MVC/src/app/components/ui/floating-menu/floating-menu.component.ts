import { NgIf } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { Component, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'pt-floating-menu',
    imports: [FontAwesomeModule, NgIf],
    templateUrl: './floating-menu.component.html'
})
export class FloatingMenuComponent {
    faCircleInfo = faCircleInfo;

    @Output() randomAction = new EventEmitter<void>();

    constructor() {}

    isMenuOpened = true;
    ControlSettingsText: 'Open' | 'Close' = 'Close';

    toggleMenu() {
        this.isMenuOpened = !this.isMenuOpened;
        this.ControlSettingsText = this.ControlSettingsText == 'Open' ? 'Close' : 'Open';
    }
}
