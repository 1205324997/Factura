import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private authfackservice: AuthfakeauthenticationService
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<any> {
        return from(this.handleRequest(request, next));
    }

    private async handleRequest(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Promise<any> {
        if (environment.defaultauth === 'firebase') {
            try {
                const currentUser = await this.authenticationService.currentUser();
                if (currentUser && currentUser.token) {
                    request = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${currentUser.token}`,
                        },
                    });
                }
                return next.handle(request).toPromise();
            } catch (error) {
                return throwError(error);
            }
        } else {
            const currentUser = this.authfackservice.currentUserValue;
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                });
            }
            return next.handle(request).toPromise();
        }
    }
}
