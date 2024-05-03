import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
//import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: UntypedFormGroup;
  submitted: any = false;
  error: any = '';
  returnUrl: string;
  fieldTextType!: boolean;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private store: Store,
    private authservice: AuthenticationService) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    // form validation
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // Obtener los valores ingresados por el usuario
    const email = this.f.email.value;
    const password = this.f.password.value;

    // Iniciar sesión con los valores ingresados
    this.authenticationService.login(email, password).subscribe(
      user => {
        // Si la autenticación es exitosa, redirigir al usuario a la página principal
        this.router.navigate(['/']);
        console.log(email)
      },
      error => {
        // Si hay un error durante la autenticación, mostrar el mensaje de error
        this.error = error.message || 'Error de autenticación';
      }
    );
  }

  /**
 * Password Hide/Show
 */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
