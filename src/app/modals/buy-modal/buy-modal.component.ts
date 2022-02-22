import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-buy-modal',
  templateUrl: './buy-modal.component.html',
  styleUrls: ['./buy-modal.component.css']
})
export class BuyModalComponent implements OnInit, AfterViewInit {
  @Input() name: string;
  amount: number;
  @Input() closeModal: Function;
  @Input() user_id: string;
  @Input() product_id: string;
  invalid: boolean = false;

  ngOnInit(): void {
  }

  @ViewChild('modal') modalElement: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.modalElement.nativeElement.classList.remove('opacity-0');
      this.modalElement.nativeElement.classList.add('opacity-1');
      this.modalElement.nativeElement.classList.add('mt-10');
    }, 200);
  }

  constructor(private http: HttpClient) {  }

  handleAmountChange(event) {
    this.amount = <number>event.target.value;
  }

  handleSubmit() {
    if (this.amount === undefined) {
      this.modalElement.nativeElement.classList.add('rotate-2');
      setTimeout(() => {
        this.modalElement.nativeElement.classList.remove('rotate-2');
        setTimeout(() => {
          this.modalElement.nativeElement.classList.add('-rotate-2');
          setTimeout(() => {
            this.modalElement.nativeElement.classList.remove('-rotate-2');
            this.invalid = true;
          }, 50)
        }, 50)
      }, 50)
    } else {
      this.http.post('http://localhost:7000/buy', {user_id: this.user_id, product_id: this.product_id, items: this.amount}, {
        observe: 'response',
        responseType: 'text'
      }).subscribe(res => {
        console.log('bought')
      })
    }
  }

  handleClose() {
    this.modalElement.nativeElement.classList.remove('opacity-1');
    this.modalElement.nativeElement.classList.remove('mt-10');
    this.modalElement.nativeElement.classList.add('opacity-0');

    setTimeout(() => {
      this.closeModal();
    }, 200);
  }
}
