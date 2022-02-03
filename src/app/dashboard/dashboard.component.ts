import { Component, OnInit } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, CanActivate {

  constructor(private authService: AuthService, private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  ngOnInit(): void {
    // @ts-ignore
    document.body.style = "background-color: white; opacity: 0";
    // @ts-ignore
    if (this.cookieService.get('session') == JSON.parse(localStorage.getItem('user'))?._id) {
      // @ts-ignore
      document.body.style = "background-color: white;";
      console.log('reached')
    } else {
      window.location.replace('/sign-in')
    }
  }

  // @ts-ignore
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.auth;
  }


}
