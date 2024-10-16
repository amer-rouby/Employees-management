import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  canRegisterUser: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.canRegisterUser = this.authService.canRegisterUser(); // Get the permissions on init
  }
}
