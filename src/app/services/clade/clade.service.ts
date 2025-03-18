import { Injectable } from '@angular/core';
import { Clade } from '../../shared/models/Clade';
import { HttpClient } from '@angular/common/http';
import { CLADE_URL } from '../../shared/constants/urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CladeService {

  constructor(private http: HttpClient) { }


  getAll(): Observable<Clade[]>{
    return  this.http.get<Clade[]>(CLADE_URL)
  }
}
