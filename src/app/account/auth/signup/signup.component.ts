import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { UserProfileService } from '../../../core/services/user.service';
import { Store } from '@ngrx/store';
import { Register } from 'src/app/store/Authentication/authentication.actions';
import { FirestoreService } from 'src/app/core/services/firestore.service';
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

  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private userService: UserProfileService, public store: Store, private firestoreService: FirestoreService) { }

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
  
    // User Registered in Firebase Authentication
    this.authenticationService.register(email, password)
      .subscribe((authResult: any) => { 
          
        const user: User = {
          email: email,
          username: name,
          password: password,
          ruc: ruc
        };
  
        console.log("Usuario a agregar en Firestore:", user);
  
        // Saving additional information in Cloud Firestore
        this.firestoreService.addUser(user)
          .then(() => {
            console.log("Usuario agregado con éxito en Firestore");
            this.successmsg = true;
          })
          .catch(error => {
            console.error("Error al agregar usuario en Firestore:", error);
            this.error = error.message;
          });
      }, error => {
        // Handling registration errors in Firebase Authentication
        console.error("Error al registrar usuario en Firebase:", error);
        this.error = error.message;
      });
  }
}
