import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  // Reemplaza esta URL con la URL de tu servidor de correo
  private correoUrl = 'http://tu-servidor-de-correo.com/enviar';

  constructor(private http: HttpClient) { }

  enviarCorreo(correo: string, asunto: string, cuerpo: string): Observable<any> {
    const payload = { correo, asunto, cuerpo };

    // Utiliza la URL del servidor de correo configurada
    return this.http.post(this.correoUrl, payload);
  }
}
