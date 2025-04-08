import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Species } from '../../shared/models/Species';
import { SPECIES_URL, GET_FAMILY } from '../../shared/constants/urls';
import { Observable } from 'rxjs';
import { Clade } from '../../shared/models/Clade';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Species[]>{
    return this.http.get<Species[]>(SPECIES_URL);
  }

  getFamily(speciesId: string): Observable<Clade[]>{
    return this.http.get<Clade[]>(GET_FAMILY + speciesId)
  }
}
