import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators'; 
import { User } from 'src/app/store/Authentication/auth.models';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

getUserEmailByRuc(ruc: string): Promise<string | null> {
  console.log("Consultando Firestore para el RUC:", ruc);
  return this.firestore.collection('users', ref => ref.where('ruc', '==', ruc))
    .valueChanges({ idField: 'id' })
    .pipe(
      take(1),
      map((users: any[]) => {
        console.log("Usuarios encontrados:", users);
        return users.length > 0 ? users[0].email : null;
      })
    )
    .toPromise() as Promise<string | null>; 
}

  
  addUser(user: User): Promise<any> {
    return this.firestore.collection('users').add(user);
  }

  getUsers(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges();
  }
}
