import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/store/Authentication/auth.models';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    constructor(private afAuth: AngularFireAuth) { }

    /**
     * Returns the current user
     */
    public currentUser(): Promise<User | null> {
        return new Promise((resolve, reject) => {
            this.afAuth.onAuthStateChanged((user) => {
                resolve(user);
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
     * Performs the login
     * @param email email of user
     * @param password password of user
     */
    login(email: string, password: string) {
        return from(this.afAuth.signInWithEmailAndPassword(email, password));
    }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(email: string, password: string) {
        return from(this.afAuth.createUserWithEmailAndPassword(email, password));
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return from(this.afAuth.sendPasswordResetEmail(email));
    }

    /**
     * Logout the user
     */
    logout() {
        return from(this.afAuth.signOut());
    }
}
