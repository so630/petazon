import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Feature} from "./feature.model";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit, AfterViewInit {

  features: Feature[] = [
    new Feature('Marketplace for Pets', 'assets/images/shop.png'),
    new Feature('Find Nearby Vets', 'assets/images/doctor.png'),
    new Feature('Find if your pet is sick', 'assets/images/health.png'),
    new Feature('Find other Pet Enthusiasts', 'assets/images/dog.png')
  ]

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
