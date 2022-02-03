import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private cookieService: CookieService) { }

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

}
