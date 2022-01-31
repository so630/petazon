import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bussiness-card',
  templateUrl: './bussiness-card.component.html',
  styleUrls: ['./bussiness-card.component.css']
})
export class BussinessCardComponent implements OnInit {
  @Input() title: string;
  @Input() desc: string;
  @Input() image: string;

  constructor() { }

  ngOnInit(): void {
  }

}
