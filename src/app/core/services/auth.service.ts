import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { User } from 'src/app/store/Authentication/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    constructor(private http: HttpClient) { }

    /**
     * Returns the current user
     */
    public currentUser(): Observable<User | null> {
        return of(null);
    }

    /**
     * Performs the login
     * @param loginData
     */
    login(loginData: { business_id: string, username: string, password: string }): Observable<any> {
        const body = {
            business_id: loginData.business_id,
            username: loginData.username,
            password: loginData.password
        };
        
        return this.http.post<any>('https://factux.backcobasoft.net/v1/auth/', body)
            .pipe(
                tap(response => {
                    if (response && response.access_token) {
                        localStorage.setItem('token', response.access_token);
                    }
                })
            );
    }
    


    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, password: string): Observable<any> {
        const url = 'https://your-api-url.com/register';
        return this.http.post(url, { email, password });
      }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string): Observable<any> {
        return of(null);
    }

    /**
     * Logout the user
     */
    logout(): Observable<any> {
        return of(null);
    }
}
