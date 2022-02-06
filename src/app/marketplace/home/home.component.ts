import { Component, OnInit } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title: string;
  items: {name, desc, image_name, price, sales, _id, business_id}[];

  constructor(private cookieService: CookieService, private authService: AuthService, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // @ts-ignore
    document.body.style = "background-color: white; opacity: 0";
    this.authService.checkAuth();

    this.route.params.subscribe((param: Params) => {
      this.title = param['category'];
      this.title = this.title[0].toUpperCase() + this.title.substring(1);
      if (param['category'] === 'home') {
        // we render everything
        this.http.get('http://localhost:7000/products', {
          observe: 'response',
          responseType: 'json'
        }).subscribe(res => {
          this.items = <[]>res.body;
        })
      } else {
        this.http.get('http://localhost:7000/products/' + param['category'], {
          observe: 'response',
          responseType: 'json'
        }).subscribe(res => {
          console.log(res.body);
          this.items = <[]>res.body;
        })
      }
    })
  }

  buy(product_id) {
    let items;
    // @ts-ignore
    const dialogRef = this.dialog.open(ItemsDialogComponent, {
      width: '250px',
      items: items
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    })
  }

}
