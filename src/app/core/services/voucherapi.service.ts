// api.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private filtroTipoFactura: string;

  constructor(public http: HttpClient) { }

  public setFiltroTipoFactura(tipoFactura: string): void {
    this.filtroTipoFactura = tipoFactura;
  }

  public getVouchers(params: HttpParams): Observable<any> {
    const url = 'http://3.93.5.254:8030/sri/v1/vouchers';
    if (this.filtroTipoFactura) {
      params = params.set('tipoFactura', this.filtroTipoFactura);
    }
    return this.http.get<any>(url, { params });
  }
}
