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
          // Aquí se maneja el registro de usuario para un backend falso
          // return this.userService.register({ email, username, password }).pipe(
          //   map((user) => {
          //     this.router.navigate(['/auth/login']);
          //     return RegisterSuccess({ user });
          //   }),
          //   catchError((error) => of(RegisterFailure({ error })))
          // );
        }
      })
    )
  );
  


  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) => {
        if (environment.defaultauth === "firebase") {
          // Aquí se maneja el login para un backend falso
          // return this.AuthfakeService.login(email, password).pipe(
          //   map((user) => {
          //     if (user) {
          //       localStorage.setItem('currentUser', JSON.stringify(user));
          //       localStorage.setItem('token', user.token);
          //       this.router.navigate(['/']);
          //     }
          //     return loginSuccess({ user });
          //   }),
          //   catchError((error) => of(loginFailure({ error })))
          // );
        } else if (environment.defaultauth === "firebase") {
          return this.AuthenticationService.login(email, password).pipe(
            map((userCredential) => {
              const user = userCredential.user;
              localStorage.setItem('currentUser', JSON.stringify(user));
              // Aquí deberías usar el token de Firebase si lo necesitas
              // const token = userCredential.accessToken;
              // localStorage.setItem('token', token);
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
