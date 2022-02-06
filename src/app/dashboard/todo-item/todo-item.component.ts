import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  @Input() title: string;
  @Input() date: string;
  @Input() time: string;
  @Input() type: string;
  @Input() index: number;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit(): void {
  }

  delete() {
    this.http.post('https://arcane-reaches-61421.herokuapp.com/delete-todo', {
      index: this.index,
      user_id: this.cookieService.get('id')
    }, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      window.location.reload()
    })
  }
}
