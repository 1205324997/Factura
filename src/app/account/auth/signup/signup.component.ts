import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { User } from 'src/app/store/Authentication/auth.models';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup; 
  submitted: boolean = false;
  error: any = '';
  successmsg: boolean = false;

  // set the current year
  year: number = new Date().getFullYear();

  constructor(private formBuilder: UntypedFormBuilder, private router: Router, public store: Store) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      ruc: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;
    
    if (this.signupForm.invalid) {
      return;
    }
  
    const email = this.f['email'].value;
    const ruc = this.f['ruc'].value;
    const name = this.f['username'].value;
    const password = this.f['password'].value;
  
    console.log("Datos del formulario:", email, ruc, name, password);
  
    // Simulación de registro sin servicios externos
    const user: User = {
      email: email,
      username: name,
      password: password,
      ruc: ruc
    };

    try {
      // Simular el almacenamiento del usuario en localStorage
      localStorage.setItem('registeredUser', JSON.stringify(user));
      console.log("Usuario registrado con éxito");
      this.successmsg = true;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      this.error = error.message;
    }
  }
}
