import {Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
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
  @Input() reload: Function;
  @Input() delete: Function;
  edit: boolean = false;
  @ViewChild('todo') todo: ElementRef;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit(): void {
  }

  check() {
    !this.edit ? this.delete(this.index) : this.setEdit();
  }

  setEdit = () => {
    this.edit = false;
    console.log(this.edit);
  }
}
