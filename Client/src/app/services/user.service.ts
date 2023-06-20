import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userEmail = new BehaviorSubject<string>('');

  constructor() { }

  setUserEmail(email: string) {
    this.userEmail.next(email);
  }

  getUserEmail() {
    return this.userEmail.asObservable();
  }
}
