import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

export interface EmailData {
  emails: string[];
  subject: string;
  body: string;
  attachments?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  enviarCorreo(data: EmailData) {
    const url = 'https://notificaciones.backcobasoft.net/notifications/v1/email/message';
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(url, data, { headers }).toPromise();
  }
  
//Comunicacion de vista para componentes
  private mostrarFormularioEmailSource = new Subject<boolean>();
  mostrarFormularioEmail$ = this.mostrarFormularioEmailSource.asObservable();

  cambiarMostrarFormularioEmail(mostrar: boolean): void {
    this.mostrarFormularioEmailSource.next(mostrar);
  }

}
