import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, AfterViewInit {

  @ViewChild('heroCard') heroCard: ElementRef<HTMLDivElement>;

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.heroCard.nativeElement.classList.add('open')
    }, 3)
  }

  buttonClick(e: Event) {
  }

}
