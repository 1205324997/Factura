import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { User } from 'src/app/store/Authentication/auth.models';

@Component({
  selector: 'app-firestore',
  templateUrl: './firestore.component.html',
  styleUrls: ['./firestore.component.css']
})
export class FirestoreComponent implements OnInit {
  users: any[] = [];
  newUser: User = {
    
  };

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  addUser(): void {
    this.firestoreService.addUser(this.newUser)
      .then(() => {
        console.log('User added successfully');
        this.newUser = {}; 
        this.loadUsers(); 
      })
      .catch(error => {
        console.error('Error adding user: ', error);
      });
  }

  loadUsers(): void {
    this.firestoreService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
}
