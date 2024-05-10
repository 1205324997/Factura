import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  protected static base_url = 'http://notificaciones.backcobasoft.net/';
  protected static version = 'notifications/v1';

  constructor(private http: HttpClient) { }

  enviarCorreo(datosCorreo: any): Promise<any> {
    const url = `${EmailService.base_url}${EmailService.version}/email/message`;
    return this.http.post(url, datosCorreo).toPromise();
  }
}
