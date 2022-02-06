import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  buy(product_id) {
    let user_id = this.cookieService.get('id');
    this.http.post('https://shrouded-citadel-28062.herokuapp.com/buy', {
      user_id: user_id,
      product_id: product_id
    }, {
      observe: 'response'
    })
  }
}
