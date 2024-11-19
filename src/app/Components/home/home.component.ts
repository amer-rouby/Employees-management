import { Component, OnInit } from '@angular/core';
import { PermissionsService } from '../../Services/permissions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  canRegisterUser: boolean = false;

  constructor(private permissionsService: PermissionsService) {}

  ngOnInit() {
    this.canRegisterUser = this.permissionsService.canRegisterUser();
  }
}
