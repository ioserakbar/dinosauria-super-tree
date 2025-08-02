import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Species } from '../../shared/models/Species';
import { SPECIES_URL, GET_FAMILY, ADD_SPECIES } from '../../shared/constants/urls';
import { Observable, tap } from 'rxjs';
import { Clade } from '../../shared/models/Clade';
import { ISpeciesRegister } from '../../shared/interfaces/ISpeciesRegister';

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
  
  addSpecies(newSpecies: ISpeciesRegister): Observable<Species>{
    console.log(newSpecies)
    return this.http.post<Species>(ADD_SPECIES, newSpecies)
  }
}
