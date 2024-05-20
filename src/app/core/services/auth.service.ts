import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/store/Authentication/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    constructor() { }

    /**
     * Returns the current user
     */
    public currentUser(): Observable<User | null> {
        // Aquí puedes implementar la lógica para obtener el usuario actual
        // Por ejemplo, puedes almacenar el usuario en el almacenamiento local
        // y luego recuperarlo cuando sea necesario.
        // Por ahora, simplemente devolveremos un observable vacío.
        return of(null);
    }

    /**
     * Performs the login
     * @param loginData Objeto que contiene los datos de inicio de sesión
     *                  { business_id, username, password }
     */
    login(loginData: { business_id: string, username: string, password: string }): Observable<any> {
        // Aquí puedes implementar la lógica de inicio de sesión sin Firebase
        // Por ahora, simplemente devolveremos un observable vacío.
        return of(null);
    }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, password: string): Observable<any> {
        // Aquí puedes implementar la lógica de registro sin Firebase
        // Por ahora, simplemente devolveremos un observable vacío.
        return of(null);
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string): Observable<any> {
        // Aquí puedes implementar la lógica para restablecer la contraseña sin Firebase
        // Por ahora, simplemente devolveremos un observable vacío.
        return of(null);
    }

    /**
     * Logout the user
     */
    logout(): Observable<any> {
        // Aquí puedes implementar la lógica para cerrar sesión sin Firebase
        // Por ahora, simplemente devolveremos un observable vacío.
        return of(null);
    }
}
