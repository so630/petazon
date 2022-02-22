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
  isBuy: boolean;
  user_id: string;


  constructor(private cookieService: CookieService, private http: HttpClient) { }

  ngOnInit(): void {
    this.user_id = this.cookieService.get('id')
  }

  buy() {
    this.isBuy = true;
  }

  closeModal = () => {
    this.isBuy = false;
  }
}
