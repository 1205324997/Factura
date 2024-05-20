import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private authFakeService: AuthfakeauthenticationService
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return this.handleRequest(request, next);
    }

    private handleRequest(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (environment.defaultauth === 'firebase') {
            return this.handleFirebaseRequest(request, next);
        } else {
            return this.handleFakeAuthRequest(request, next);
        }
    }

    private handleFirebaseRequest(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return this.authenticationService.currentUser().pipe(
            catchError(error => {
                return throwError(error);
            }),
            switchMap(currentUser => {
                if (currentUser && currentUser.token) {
                    request = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${currentUser.token}`,
                        },
                    });
                }
                return next.handle(request);
            })
        );
    }

    private handleFakeAuthRequest(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const currentUser = this.authFakeService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
        }
        return next.handle(request).pipe(
            catchError(error => {
                return throwError(error);
            })
        );
    }
}
