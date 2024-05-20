import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected static base_url = 'https://factux.backcobasoft.net/';
  protected static version = 'v1';
  private filtroTipoFactura: string;
  private authToken: string;

  constructor(public http: HttpClient, private router: Router) { }

  private getHeaders(): HttpHeaders {
    // Comprobar si el token de autenticación está presente
    if (!this.authToken) {
      // Si no hay token, redirigir a la página de inicio de sesión o manejar el caso en consecuencia
      console.error('No se ha proporcionado un token de autenticación.');
      // Manejar la situación, como redirigir al usuario a la página de inicio de sesión
      return new HttpHeaders();
    }
    
    // Agregar el token de autenticación a los encabezados
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authToken}`
    });
    return headers;
  }

  // Método para establecer el token de autenticación
  public setAuthToken(token: string): void {
    this.authToken = token;
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

  // Peticion descarga facturas pdf
  public getPdfVoucher(id: string, environment: number): Observable<any> {
    const url = `${ApiService.base_url}${ApiService.version}/vouchers/pdf/${id}?environment=${environment}`;
    const headers = this.getHeaders();
    return this.http.get<any>(url, { headers, responseType: 'blob' as 'json' }); 
  }
  
  redirectToUrl(url: string): void {
    this.router.navigateByUrl(url);
  }
}
