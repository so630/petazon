import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate, Params,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {NgForm} from "@angular/forms";

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, CanActivate {

  type: string;
  products: {name, desc, image_name, price, sales, _id, business_id}[];
  ids: { item, id }[];
  todo: any[];


  constructor(private authService: AuthService, private http: HttpClient, private router: Router, private cookieService: CookieService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // @ts-ignore
    document.body.style = "background-color: white; opacity: 0";
    this.route.params.subscribe((params: Params) => {
      this.type = params['type'];
      if (this.type === 'user') {
        this.authService.checkAuth();
        this.http.get('https://shrouded-citadel-28062.herokuapp.com/user/purchases/' + this.cookieService.get('id'), {
          observe: 'response',
          responseType: 'json'
        }).subscribe(res => {
          this.ids = <{ item, id }[]>res.body;
        })

        this.http.get('https://arcane-reaches-61421.herokuapp.com/todo/'+this.cookieService.get('id'), {
          observe: 'response',
          responseType: 'json'
        }).subscribe(res => {
          // @ts-ignore
          this.todo = res.body.todo;
        })
      } else if (this.type === 'business') {
        this.authService.checkBusinessAuth();
        this.http.get('https://shrouded-citadel-28062.herokuapp.com/products/business/'+this.cookieService.get('id'), {
          observe: 'response',
          responseType: 'json'
        }).subscribe(res => {
          this.products = <{name, desc, image_name, price, sales, _id, business_id}[]>res.body;
        })
      }
    })
  }

  // @ts-ignore
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.auth;
  }

  @ViewChild("f") productForm: NgForm;
  product = {
    file: null,
    price: 0,
    name: '',
    desc: '',
    business_id: '',
    category: ''
  }
  submitted: boolean;
  file: File;

  onSubmit() {
    this.submitted = true;
    this.product.price = this.productForm.value.price;
    this.product.name = this.productForm.value.name;
    this.product.desc = this.productForm.value.desc;
    this.product.business_id = this.cookieService.get('id');
    this.product.category = this.productForm.value.category;
    this.product.file = this.file;

    let formData: FormData = new FormData();
    formData.append('file', this.product.file);
    formData.append('price', "" + this.product.price)
    formData.append('name', this.product.name)
    formData.append('desc', this.product.desc)
    formData.append('business_id', this.product.business_id)
    formData.append('category', this.product.category)

    this.http.post('https://shrouded-citadel-28062.herokuapp.com/api/upload-product', formData, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      console.log(res)
    });

    window.location.replace('/dashboard/business')
  }

  fileChanged(image: any) {
    this.file = image.target.files[0]
  }

  @ViewChild('t') t: NgForm;

  topup() {
    let amount = this.t.value.amount;

    this.http.post('https://shrouded-citadel-28062.herokuapp.com/topup', {
      user_id: this.cookieService.get('id'),
      amount: amount
    }, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      // do nothing
      this.t.reset();
    })
  }

  @ViewChild('todoF') todoF: NgForm;
  date: string;
  time: string;

  todoSubmit() {
    let user_id = this.cookieService.get('id');
    let title = this.todoF.value.title;
    let type = this.todoF.value.type;

    this.http.post('https://arcane-reaches-61421.herokuapp.com/todo-add', {
      user_id: user_id,
      title: title,
      date: this.date,
      time: this.time,
      type: type
    }, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      window.location.reload();
    })
  }

  handleDate(event) {
    this.date = event.target.value;
  }

  handleTime(event) {
    this.time = event.target.value;
  }
}
