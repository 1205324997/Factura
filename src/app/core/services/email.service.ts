import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface EmailData {
  emails: string[];
  subject: string;
  body: string;
  attachments?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  protected static base_url = 'http://notificaciones.backcobasoft.net/';
  protected static version = 'notifications/v1';

  constructor(private http: HttpClient) { }

  enviarCorreo(datosCorreo: EmailData): Promise<any> {
    if (!this.validarDatosCorreo(datosCorreo)) {
      return Promise.reject('Datos de correo inválidos');
    }

    const url = `${EmailService.base_url}${EmailService.version}/email/message`;
    return this.http.post(url, datosCorreo).toPromise();
  }

  public validarDatosCorreo(datosCorreo: EmailData): boolean {
    if (!(datosCorreo.emails && datosCorreo.emails.length > 0 &&
          datosCorreo.subject && datosCorreo.body)) {
      throw new Error('Datos de correo inválidos');
    }
    return true;
  }  
}
