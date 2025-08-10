import { Injectable } from '@angular/core';
import { Clade } from '../shared/models/Clade';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICladeInterface } from '../shared/interfaces/ICladeRegister';
import { BaseService } from './baseService';

@Injectable({
    providedIn: 'root'
})
export class CladeService extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    routePrefix = this.baseUrl + 'clade/';

    getAll(): Observable<Clade[]> {
        return this.http.get<Clade[]>(`${this.routePrefix}get/all`);
    }

    addClade(newClade: ICladeInterface): Observable<Clade> {
        return this.http.post<Clade>(`${this.routePrefix}create`, newClade);
    }
}
