import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-header-stats',
  templateUrl: './header-stats.component.html',
  styleUrls: ['./header-stats.component.css']
})
export class HeaderStatsComponent implements OnInit {

  sales: string = '0';
  revenue: string;

  @Input() type: string;

  constructor(private http: HttpClient, private cookieService: CookieService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.type === 'business') {
      this.http.get('https://shrouded-citadel-28062.herokuapp.com/sales/' + this.cookieService.get('id'), {
        observe: 'response',
        responseType: 'json'
      }).subscribe(res => {
        // @ts-ignore
        if (!res.body.sales) {
          this.sales = '0';
        } else {
          // @ts-ignore
          this.sales = res.body.sales;
        }

      })

      this.http.get('https://shrouded-citadel-28062.herokuapp.com/revenue/' + this.cookieService.get('id'), {
        observe: 'response',
        responseType: 'json'
      }).subscribe(res => {
        // @ts-ignore
        this.revenue = res.body.revenue;
      })
    } else {
      this.http.get('https://shrouded-citadel-28062.herokuapp.com/user/data/' + this.cookieService.get('id'), {
        observe: 'response',
        responseType: 'json'
      }).subscribe(res => {
        // @ts-ignore
        this.revenue = res.body.balance;
        // @ts-ignore
        this.sales = res.body.products_bought;
      })
    }
  }

}
