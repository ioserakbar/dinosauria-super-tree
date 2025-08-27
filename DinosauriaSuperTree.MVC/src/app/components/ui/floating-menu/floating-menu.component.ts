import { NgIf } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { Component, Output, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { TreeSettings } from '../../../data/TreeSettings';
import { ETreeSettings } from '../../../data/TreeSettingsEnum';

@Component({
    selector: 'pt-floating-menu',
    imports: [FontAwesomeModule, NgIf],
    templateUrl: './floating-menu.component.html'
})
export class FloatingMenuComponent implements OnInit {
    @Output() changeSettings = new EventEmitter<TreeSettings>();
    settings = new TreeSettings();
    faCircleInfo = faCircleInfo;
    treeSettingsEnum = ETreeSettings;

    constructor() {}

    showSettings = true;

    toggleMenu() {
        this.showSettings = !this.showSettings;
    }

    ngOnInit() {}

    onSettingChange(setting: ETreeSettings, startingClade?: string) {
        switch (setting) {
            case ETreeSettings.debugMode:
                this.settings.debugMode = !this.settings.debugMode;
                break;
            case ETreeSettings.disableAnimations:
                this.settings.disableAnimations = !this.settings.disableAnimations;
                break;
            case ETreeSettings.startingClade:
                this.settings.startingClade = startingClade;
                break;
            default:
                break;
        }

        this.changeSettings.emit(this.settings);
    }
}
