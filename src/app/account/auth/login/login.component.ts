import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/voucherapi.service';// Importa tu servicio ApiService aquí

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean = false;
  error: string = '';
  fieldTextType: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private apiService: ApiService // Inyecta el servicio ApiService aquí
  ) {}

  ngOnInit() {
    console.log('Login component initialized');

    // Construye el formulario de inicio de sesión
    this.loginForm = this.formBuilder.group({
      business_id: ['89359a33-1554-401f-ba03-a1ffe49df50a'],
      username: ['negocio', [Validators.required]],
      password: ['User2024.', [Validators.required]],
    });
  }

  // Maneja el envío del formulario
  onSubmit() {
    this.submitted = true;
    console.log('Login form submitted');

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      console.log('Invalid form');
      return;
    }

    // Obtener los valores del formulario
    const loginData = {
      business_id: this.loginForm.value.business_id,
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    console.log('Login data:', loginData);

    // Llamar al servicio de autenticación
    this.authenticationService.login(loginData).subscribe(
      response => {
        console.log('Authentication response:', response);
        // Manejar la respuesta de autenticación aquí
        if (response && response.access_token) {
          // Si se recibe un token en la respuesta, encriptarlo y guardarlo en el almacenamiento local
          const encryptedToken = this.hashToken(response.access_token);
          localStorage.setItem('token', encryptedToken);
          // Establecer el token en el servicio ApiService
          this.apiService.setAuthToken(encryptedToken);
          // Redirigir al usuario a la página deseada (por ejemplo, la página principal)
          this.router.navigate(['/']);
        } else {
          // Si no se recibe un token en la respuesta, muestra un mensaje de error
          this.error = 'No se pudo iniciar sesión. Por favor, verifique sus credenciales.';
        }
      },
      error => {
        console.error('Authentication error:', error);
        // Manejar el error de autenticación
        this.error = error.message || 'Error de autenticación';
      }
    );
  }

  // Getter conveniente para acceder fácilmente a los controles del formulario
  get f() { return this.loginForm.controls; }

  // Método para alternar entre texto visible e invisible para el campo de contraseña
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  // Función para encriptar el token
  private hashToken(token: string): string {
    // Aquí puedes implementar la función de hashing adecuada
    // Por ahora, simplemente devolveremos el token sin cambios
    return token;
  }
}
