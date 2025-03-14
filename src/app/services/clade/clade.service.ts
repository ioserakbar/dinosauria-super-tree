import { Injectable } from '@angular/core';
import { Clade } from '../../shared/models/Clade';
import { sapmle_Clades } from '../../../data';

@Injectable({
  providedIn: 'root'
})
export class CladeService {

  constructor() { }


  getAll(): Clade[]{
    return sapmle_Clades
  }
}
