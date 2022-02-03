import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private cookieService: CookieService, private authService: AuthService) { }

  ngOnInit(): void {
    // @ts-ignore
    document.body.style = "background-color: white; opacity: 0";
    this.authService.checkAuth();
  }

}
