import { Component } from '@angular/core';
import { EmailService, EmailData } from 'src/app/core/services/email.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent {
  
  mostrarFormularioEmail = false;
  emailData: EmailData = {
    emails: [''],
    subject: '',
    body: '',
    attachments: ['']
  };

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
  }

  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.emailData.attachments = [file.name];
    }
  }

  enviarCorreo() {
    console.log('Datos a enviar:', this.emailData);
    this.emailService.enviarCorreo(this.emailData)
      .then(response => {
        console.log('Correo enviado correctamente:', response);
      })
      .catch(error => {
        console.error('Error al enviar el correo:', error);
      });
  }
    
  cancelarEnvio(): void {
    this.emailService.cambiarMostrarFormularioEmail(false);
  }
  
}
