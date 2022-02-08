import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit, AfterViewInit {

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

  ngAfterViewInit() {
    setTimeout(() => {
      this.todo.nativeElement.classList.remove('bottom-4');
      this.todo.nativeElement.classList.remove('opacity-0');
      this.todo.nativeElement.classList.add('bottom-0');
      this.todo.nativeElement.classList.add('opacity-1');
    }, 3);
  }

  check() {
    !this.edit ? this.delete(this.index) : this.setEdit();
  }

  setEdit = () => {
    this.edit = false;
    console.log(this.edit);
  }

  del() {
    setTimeout(() => {
      this.todo.nativeElement.classList.remove('bottom-0');
      this.todo.nativeElement.classList.remove('opacity-1');
      this.todo.nativeElement.classList.add('bottom-4');
      this.todo.nativeElement.classList.add('opacity-0');
      setTimeout(() => {
        console.log('called');
        this.delete(this.index);
      }, 150);
    }, 3);
  }
}
