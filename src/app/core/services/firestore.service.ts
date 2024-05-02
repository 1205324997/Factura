import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; 
import { User } from 'src/app/store/Authentication/auth.models';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {} 

  addUser(user: User){
    return this.firestore.collection('users').add(user); 
  }
}
