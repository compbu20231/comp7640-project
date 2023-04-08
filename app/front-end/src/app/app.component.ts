import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavbarService } from "./services/navbar.service";
import { Router, NavigationEnd } from "@angular/router";
import { ScormService } from "./services/scorm.service";
// tslint:disable-next-line: ban-types
declare let gtag: Function;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "Comp7640-Project";
  isOpen: boolean;

  constructor(
    private nbService: NavbarService,
    private router: Router
  ) {
    // const visitor = ua('UA-55890067-1', { http: true });
  }

  ngOnInit() {
    this.nbService.navbarStatusChanged.subscribe(
      (isOpen) => (this.isOpen = isOpen)
    );
  }

  ngOnDestroy(): void {

  }
}
