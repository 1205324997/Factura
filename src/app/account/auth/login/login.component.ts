import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/voucherapi.service';

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
    private apiService: ApiService 
  ) {}

  ngOnInit() {
    console.log('Login component initialized');

    //formualrio de incio de sesion 
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

   
    const loginData = {
      business_id: this.loginForm.value.business_id,
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    console.log('Login data:', loginData);


    this.authenticationService.login(loginData).subscribe(
      response => {
        console.log('Authentication response:', response);
        if (response && response.access_token) {
          const encryptedToken = this.hashToken(response.access_token);
          localStorage.setItem('token', encryptedToken);
          this.apiService.setAuthToken(encryptedToken);
          this.router.navigate(['/']);
        } else {
          this.error = 'No se pudo iniciar sesión. Por favor, verifique sus credenciales.';
        }
      },
      error => {
        console.error('Authentication error:', error);
        this.error = error.message || 'Error de autenticación';
      }
    );
  }

  get f() { return this.loginForm.controls; }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  // Función para encriptar el token
  private hashToken(token: string): string {
    return token;
  }
}
