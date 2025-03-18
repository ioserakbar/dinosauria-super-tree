import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Species } from '../../shared/models/Species';
import { sample_Species } from '../../../data';
import { SPECIES_URL } from '../../shared/constants/urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Species[]>{
    return this.http.get<Species[]>(SPECIES_URL);
  }
}
