import { ITreeSettings } from '../shared/interfaces/ITreeSettings';

export class TreeSettings implements ITreeSettings {
    debugMode = false;
    displayCladeNames = false;
    displayClades = false;
    selectedOnly = false;
    startingClade = 'Dinosauria';
    disableAnimations = false;
}
