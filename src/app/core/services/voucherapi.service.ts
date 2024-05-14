import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected static base_url = 'https://factux.backcobasoft.net/';
  protected static version = 'v1';
  private filtroTipoFactura: string;

  constructor(public http: HttpClient, private router: Router) { }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuZWdvY2lvIiwiZXhwIjoxNzE1NjY0NjUyfQ.6QriXWDhA0KwRtd5XjZ6FUTDZXkhG8Ch-dYfX0FXH6E`
    });
    return headers;
  }
  
  public setFiltroTipoFactura(tipoFactura: string): void {
    this.filtroTipoFactura = tipoFactura;
  }

  public getVouchers(params: HttpParams): Observable<any> {
    const url = `${ApiService.base_url}${ApiService.version}/vouchers/?pageSize=100&startIndex=0&environment=1`;

    if (this.filtroTipoFactura) {
      params = params.set('tipoFactura', this.filtroTipoFactura);
    }
    const headers = this.getHeaders(); 
    return this.http.get<any>(url, { headers, params });
  }

  //Peticion descarga facturas pdf
  public getPdfVoucher(id: string, environment: number): Observable<any> {
    const url = `${ApiService.base_url}${ApiService.version}/vouchers/pdf/${id}?environment=${environment}`;
    const headers = this.getHeaders();
    return this.http.get<any>(url, { headers, responseType: 'blob' as 'json' }); 
  }
  
  redirectToUrl(url: string): void {
    this.router.navigateByUrl(url);
  }
}

