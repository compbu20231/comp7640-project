import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavbarService } from "./services/navbar.service";
import { Router } from "@angular/router";
// tslint:disable-next-line: ban-types
declare let gtag: Function;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Comp7640-Project";
  constructor(
  ) {

  }
}
