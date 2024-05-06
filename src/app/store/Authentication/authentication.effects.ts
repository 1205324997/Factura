import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthenticationService } from '../../core/services/auth.service';
import { login, loginSuccess, loginFailure, logout, logoutSuccess, Register, RegisterSuccess, RegisterFailure } from './authentication.actions';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationEffects {

  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ email, username, password, ruc }) => {
        if (environment.defaultauth === 'firebase') {
          return this.AuthenticationService.register(email, password).pipe(
            map(() => {
              this.router.navigate(['/auth/login']);
              return RegisterSuccess({ user: null });
            }),
            catchError((error) => of(RegisterFailure({ error })))
          );
        } else {
         
        }
      })
    )
  );
  


  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) => {
        if (environment.defaultauth === "firebase") {
      
        } else if (environment.defaultauth === "firebase") {
          return this.AuthenticationService.login(email, password).pipe(
            map((userCredential) => {
              const user = userCredential.user;
              localStorage.setItem('currentUser', JSON.stringify(user));
             
              this.router.navigate(['/']);
              return loginSuccess({ user });
            }),
            catchError((error) => of(loginFailure({ error })))
          );
        }
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        // Perform any necessary cleanup or side effects before logging out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }),
      exhaustMap(() => of(logoutSuccess()))
    )
  );

  constructor(
    private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private router: Router
  ) { }

}
