import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  protected static base_url = 'http://notificaciones.backcobasoft.net/';
  protected static version = 'notifications/v1';

  constructor(private http: HttpClient) { }

  enviarCorreo(destinatario: string, asunto: string, cuerpo: string, adjuntos: string[]): Promise<any> {
    const url = `${EmailService.base_url}${EmailService.version}/email/message`;
    const correo = {
      emails: [destinatario],
      subject: asunto,
      body: cuerpo,
      attachments: adjuntos
    };
    return this.http.post(url, correo).toPromise();
  }
}
