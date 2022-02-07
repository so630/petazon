import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  todoChanged = new Subject<any[]>();

  constructor() { }

  changeRecipe(todo) {
    this.todoChanged.next(todo);
  }
}
