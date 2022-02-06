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
  @Input() link: string;
  @Input() type: string;
  text: string = 'Register';

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem('business') === 'true' && this.type === 'business') {
      this.text = 'Sign in';
      this.link = '/business-login';
      console.log('reached');
    }
  }

}
