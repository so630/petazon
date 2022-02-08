import {Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-header-stats',
  templateUrl: './header-stats.component.html',
  styleUrls: ['./header-stats.component.css']
})
export class HeaderStatsComponent implements OnInit {

  @Input() sales: string = '0';
  revenue: string;

  @Input() type: string;
  @Input() event: EventEmitter<string>;
  @ViewChild('balance') balance: ElementRef;

  constructor(private http: HttpClient, private cookieService: CookieService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.type === 'business') {
      this.http.get('http://localhost:7000/sales/' + this.cookieService.get('id'), {
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

      this.http.get('http://localhost:7000/revenue/' + this.cookieService.get('id'), {
        observe: 'response',
        responseType: 'json'
      }).subscribe(res => {
        // @ts-ignore
        this.revenue = res.body.revenue;
      })
    } else {

      this.event.subscribe(next => {
        setTimeout(() => {
          this.balance.nativeElement.classList.add('opacity-0')
          this.balance.nativeElement.classList.add('bottom-4')
        }, 100);
        setTimeout(() => {
          this.revenue = next;
        }, 150);
        setTimeout(() => {
          this.balance.nativeElement.classList.remove('opacity-0')
          this.balance.nativeElement.classList.remove('bottom-4')
        }, 400);
      })

      this.http.get('http://localhost:7000/user/data/' + this.cookieService.get('id'), {
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
