import { Injectable } from '@angular/core';
import { Clade } from '../../shared/models/Clade';
import { HttpClient } from '@angular/common/http';
import { ADD_CLADE, CLADE_URL } from '../../shared/constants/urls';
import { Observable } from 'rxjs';
import { ICladeInterface } from '../../shared/interfaces/ICladeRegister';

@Injectable({
  providedIn: 'root'
})
export class CladeService {

  constructor(private http: HttpClient) { }


  getAll(): Observable<Clade[]>{
    return  this.http.get<Clade[]>(CLADE_URL)
  }

  addClade(newSpecies: ICladeInterface): Observable<Clade>{
    console.log(newSpecies)
    return this.http.post<Clade>(ADD_CLADE, newSpecies)
  }
}
