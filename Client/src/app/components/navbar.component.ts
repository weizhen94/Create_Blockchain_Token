import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  logout() {
    localStorage.removeItem('token');
    console.log("Successfully logged out: Jwt deleted")
  }

}
