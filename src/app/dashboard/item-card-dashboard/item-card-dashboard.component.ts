import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-item-card-dashboard',
  templateUrl: './item-card-dashboard.component.html',
  styleUrls: ['./item-card-dashboard.component.css']
})
export class ItemCardDashboardComponent implements OnInit {

  @Input() title: string;
  @Input() imageStr: string;
  @Input() businessId: string;
  @Input() desc: string;
  @Input() price: number;
  @Input() sales: number;
  @Input() type: string;
  @Input() id: string;
  @Input() reload: Function;
  opacity: string = 'inline-grid';
  category: string;
  @ViewChild('card') card: ElementRef;


  constructor(private cookieService: CookieService, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['type'] === 'user') {
        this.type = 'user';
        this.http.get('http://localhost:7000/product/'+this.id, {
          observe: 'response',
          responseType: 'json'
        }).subscribe(res => {
          // @ts-ignore
          if (res.body.status === '404') {
            this.opacity = 'none';
          } else {
            // @ts-ignore
            this.title = res.body.name;
            // @ts-ignore
            this.imageStr = res.body.image_name;
            // @ts-ignore
            this.businessId = res.body.business_id;
            // @ts-ignore
            this.price = res.body.price;
            // @ts-ignore
            this.desc = res.body.desc;
            // @ts-ignore
            this.category = res.body.category;
          }
        })
      }

      setTimeout(() => {
        this.card.nativeElement.classList.remove('bottom-4');
        this.card.nativeElement.classList.add('bottom-0');

        this.card.nativeElement.classList.remove('opacity-0');
        this.card.nativeElement.classList.add('opacity-1');
      }, 100);
    })
  }

  delete() {
    setTimeout(() => {
      this.card.nativeElement.classList.remove('bottom-0');
      this.card.nativeElement.classList.add('bottom-4');

      this.card.nativeElement.classList.remove('opacity-1');
      this.card.nativeElement.classList.add('opacity-0');
    }, 100);

    setTimeout(() => {
      this.reload(this.id)
    }, 200);
  }
}
