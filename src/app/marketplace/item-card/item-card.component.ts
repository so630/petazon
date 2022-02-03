import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {

  @Input() title: string;
  @Input() imageStr: string;


  constructor() { }

  ngOnInit(): void {
  }

}
