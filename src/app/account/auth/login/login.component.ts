import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
//import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/core/services/firestore.service';


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
  users: any[];

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute,
     private router: Router, private authenticationService: AuthenticationService, private store: Store,
    private authservice: AuthenticationService, private firestoreService: FirestoreService ) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    // form validation
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      ruc:['', [Validators.required]],
    });

    this.firestoreService.getAuthenticatedUser().subscribe(user => {
      if (user) {
        console.log('RUC del usuario autenticado:', user[0].ruc);
      } else {
        console.log('No hay usuario autenticado');
      }
    });

    
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    const email = this.f.email.value;
    const password = this.f.password.value;
   const ruc = this.f.ruc.value;

    this.authenticationService.login(email, password).subscribe(
      user => {
       
        this.router.navigate(['/']);
        console.log(email, ruc)
      },
      error => {
      
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
