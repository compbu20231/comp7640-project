import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  isIE = false;
  users = [];

  constructor(private nbSerive: NavbarService, private router: Router) { }

  ngOnInit() {
    this.nbSerive.changeVideosSatus();

  }

  getAllUsers() {
    this.nbSerive.getAllUsers().then((users: any) => {
      this.users = users;
      console.log('users', users);
    });;

  }

  goTo(route: string) {
    this.nbSerive.goTo(route);
  }

  openLink(b) {
    this.nbSerive.openLink(b);
  }

}
