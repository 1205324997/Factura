import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

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
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }

    // Construye el formulario con los campos y valores predeterminados
    this.loginForm = this.formBuilder.group({
      business_id: ['89359a33-1554-401f-ba03-a1ffe49df50a'],
      username: ['negocio', [Validators.required]],
      password: ['User2024', [Validators.required]],
    });
  }

  // Getter para acceder fácilmente a los controles del formulario
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
        return;
    }

    // Obtener los valores del formulario
    const loginData = {
        business_id: '89359a33-1554-401f-ba03-a1ffe49df50a', // Valor predeterminado
        username: this.f.username.value,
        password: this.f.password.value
    };

    // Llamar al servicio de autenticación
    this.authenticationService.login(loginData).subscribe(
        user => {
            // Navegar a la página principal después de iniciar sesión
            this.router.navigate(['/']);
            console.log('Login Data:', loginData);
        },
        error => {
            // Manejar el error de autenticación
            this.error = error.message || 'Error de autenticación';
        }
    );
}
  // Alternar entre texto visible e invisible para el campo de contraseña
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
