import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected static base_url = 'http://3.93.5.254:8030/';
  protected static version = 'sri/v1';
  private filtroTipoFactura: string;

  constructor(public http: HttpClient, private router: Router) { }

  public setFiltroTipoFactura(tipoFactura: string): void {
    this.filtroTipoFactura = tipoFactura;
  }

  public getVouchers(params: HttpParams): Observable<any> {
    const url = `${ApiService.base_url}${ApiService.version}/vouchers`;
    if (this.filtroTipoFactura) {
      params = params.set('tipoFactura', this.filtroTipoFactura);
    }
    return this.http.get<any>(url, { params });
  }

  redirectToUrl(url: string): void {
    this.router.navigateByUrl(url);
  }
}
