import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from 'src/app/store/Authentication/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthfakeauthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    // Credenciales predeterminadas
    private readonly defaultUsername = 'negocio';
    private readonly defaultPassword = 'User2024.';
    private readonly businessId = '89359a33-1554-401f-ba03-a1ffe49df50a'; // ID del negocio

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(): Observable<User> {
        // Utiliza las credenciales predeterminadas y el ID del negocio
        return this.http.post<any>('https://factux.backcobasoft.net/v1/auth/', { 
            username: this.defaultUsername,
            password: this.defaultPassword,
            business_id: this.businessId
        })
        .pipe(
            map(response => {
                // Check if the response contains a token
                const token = response?.token;
                if (token) {
                    // Store the token in local storage
                    localStorage.setItem('token', token);
                    // Update the current user subject
                    const user: User = { username: this.defaultUsername }; // Assuming you have a User model
                    this.currentUserSubject.next(user);
                }
                return response;
            }),
            catchError(error => {
                // Handle error
                return throwError(error);
            })
        );
    }

    logout() {
        // Remove token from local storage and reset current user subject
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }
}
