import { Injectable } from '@angular/core';
import { Species } from '../../shared/models/Species';
import { sample_Species } from '../../../data';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {

  constructor() { }

  getAll(): Species[]{
    return sample_Species;
  }
}
