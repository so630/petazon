import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-businesses',
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.css']
})
export class BusinessesComponent implements OnInit, AfterViewInit {

  @ViewChild('business') business: ElementRef;

  constructor() { }

  isInViewport (elem) {
    const rect = elem.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  ngAfterViewInit(): void {
    document.addEventListener('scroll', (event) => {
      if (this.isInViewport(this.business.nativeElement)) {
        console.log(this.business.nativeElement)
        console.log(this.business.nativeElement.classList.add('open'))
      }
    })
  }

  ngOnInit() {
  }

}
