import {Component, Input, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {

  @Input() title: string;
  @Input() imageStr: string;
  @Input() businessId: string;
  @Input() desc: string;
  @Input() price: number;
  @Input() sales: number;
  @Input() type: string;
  @Input() id: string;


  constructor(private cookieService: CookieService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  buy() {
    let items = +prompt('Enter the amount of items you would like: ');
    console.log(items)
    this.http.post('https://shrouded-citadel-28062.herokuapp.com/buy', {user_id: this.cookieService.get('id'), product_id: this.id, items: items}, {
      observe: 'response',
      responseType: 'text'
    }).subscribe(res => {
      console.log('bought')
    })
  }
}
