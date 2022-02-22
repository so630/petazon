import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
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
import {DashboardService} from "./dashboard.service";

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


  constructor(private dashboardService: DashboardService, private authService: AuthService, private http: HttpClient, private router: Router, private cookieService: CookieService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // @ts-ignore
    document.body.style = "background-color: white; opacity: 0";
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.dashboardService.todoChanged.subscribe(val => {
      this.todo = val;
    })

    this.route.params.subscribe((params: Params) => {
      this.type = params['type'];
      if (this.type === 'user') {
        this.authService.checkAuth();
        this.http.get('http://localhost:7000/user/purchases/' + this.cookieService.get('id'), {
          observe: 'response',
          responseType: 'json'
        }).subscribe(res => {
          this.ids = <{ item, id }[]>res.body;
          console.log(this.ids);
        })

        this.http.get('http://localhost:5000/todo/'+this.cookieService.get('id'), {
          observe: 'response',
          responseType: 'json'
        }).subscribe(res => {
          // @ts-ignore
          this.todo = res.body.todo;
        })
      } else if (this.type === 'business') {
        this.authService.checkBusinessAuth();
        this.http.get('http://localhost:7000/products/business/'+this.cookieService.get('id'), {
          observe: 'response',
          responseType: 'json'
        }).subscribe(res => {
          this.products = <{name, desc, image_name, price, sales, _id, business_id}[]>res.body;
        })
      }
    })
  }

  reload() {
    console.log('reload called');
    this.http.get('http://localhost:5000/todo/'+this.cookieService.get('id'), {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      // @ts-ignore
      this.todo = res.body.todo;
      console.log(this.todo);
    })
  }

  @ViewChild('todoItems') todoItems: ViewContainerRef;
  @ViewChild('vc') vc: ViewContainerRef;
  childViewRef: ViewRef;

  del = (index) => {
    this.http.post('http://localhost:5000/delete-todo', {
      index: index,
      user_id: this.cookieService.get('id')
    }, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      this.http.get('http://localhost:5000/todo/'+this.cookieService.get('id'), {
        observe: 'response',
        responseType: 'json'
      }).subscribe(res => {
        // @ts-ignore
        this.todo = res.body.todo;
      })
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
  loading: boolean;

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
    this.loading = true;
    this.http.post('http://localhost:7000/api/upload-product', formData, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      console.log(res)
      this.authService.checkBusinessAuth();
      setTimeout(() => {
        this.http.get('http://localhost:7000/products/business/'+this.cookieService.get('id'), {
          observe: 'response',
          responseType: 'json'
        }).subscribe(res => {
          this.products = <{name, desc, image_name, price, sales, _id, business_id}[]>res.body;
          console.log(this.products);
          this.loading = false;
        })
      }, 500);
    });
  }

  reloadProducts = (id) => {
    this.loading = true;
    this.http.post('http://localhost:7000/products/delete', {
      product_id: id,
      business_id: this.cookieService.get('id')
    }, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      console.log(res.body)
      this.http.get('http://localhost:7000/products/business/'+this.cookieService.get('id'), {
        observe: 'response',
        responseType: 'json'
      }).subscribe(res => {
        this.products = <{name, desc, image_name, price, sales, _id, business_id}[]>res.body;
        console.log(this.products);
        this.loading = false;
      })
    })
  }

  fileChanged(image: any) {
    this.file = image.target.files[0]
  }

  @ViewChild('t') t: NgForm;
  topupEvent: EventEmitter<string> = new EventEmitter<string>();

  topup() {
    let amount = this.t.value.amount;

    this.http.post('http://localhost:7000/topup', {
      user_id: this.cookieService.get('id'),
      amount: amount
    }, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      this.topupEvent.emit(res.body['balance']);
    })
  }

  @ViewChild('todoF') todoF: NgForm;
  date: string;
  time: string;

  todoSubmit() {
    let user_id = this.cookieService.get('id');
    let title = this.todoF.value.title;
    let type = this.todoF.value.type;

    this.http.post('http://localhost:5000/todo-add', {
      user_id: user_id,
      title: title,
      date: this.date,
      time: this.time,
      type: type
    }, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      this.reload();
    })
  }

  handleDate(event) {
    this.date = event.target.value;
  }

  handleTime(event) {
    this.time = event.target.value;
  }
}
