import { Component, OnInit } from '@angular/core';
import {MarketplaceService} from "../../marketplace.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  categories: string[];

  constructor(private marketPlaceService: MarketplaceService, private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('https://shrouded-citadel-28062.herokuapp.com/categories', {
      observe: "response",
      responseType: 'json'
    }).subscribe(res => {
      console.log(res.body)
      this.categories = <string[]>res.body;
    })
  }

  setCategories(categories: string[]) {
    console.log(categories);
    console.log(this)
  }

}
