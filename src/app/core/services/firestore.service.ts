import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators'; 
import { User } from 'src/app/store/Authentication/auth.models';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  
  addUser(user: User): Promise<any> {
    return this.firestore.collection('users').add(user);
  }
 
  

  getUsers(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges().pipe(
      take(1), 
      map(users => {
        console.log('Usuarios en Firestore:', users);
        return users;
      })
    );
  }
  

  getAuthenticatedUser(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('users', ref => ref.where('email', '==', user.email)).valueChanges({ idField: 'id' });
        } else {
          return of(null);
        }
      })
    );
  }
  
}
