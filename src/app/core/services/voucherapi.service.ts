import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient) { }

  public getVouchers(params: HttpParams): Observable<any> {
    const url = 'http://3.93.5.254:8030/sri/v1/vouchers';
    return this.http.get<any>(url, { params });
  }
}
