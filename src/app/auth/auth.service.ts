import {HttpClient, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Injectable()
export class AuthService {

  authPromise: Observable<HttpResponse<boolean>>;
  auth: boolean;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  login(username, password) {
    this.http.post('http://localhost:5000/login', {
      username: username,
      password: password
    }, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).subscribe(res => {
      this.router.navigate(['/dashboard/user'])
    });
  }

  loginBusiness(username, password) {
    this.http.post('http://localhost:7000/business-login', {
      username: username,
      password: password
    }, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).subscribe(res => {
      localStorage.setItem('business', 'true');
      this.router.navigate(['/dashboard/business'])
    })
  }

  register(username, password, name) {
    this.http.post('http://localhost:5000/register', {
      username: username,
      password: password,
      name: name
    }, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).subscribe(res => {
      console.log(res.body);
      this.router.navigate(['/dashboard/user'])
    });
  }

  registerBusiness(username, password, name) {
    this.http.post('http://localhost:7000/business-register', {
      username: username,
      password: password,
      name: name
    }, {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).subscribe(res => {
      localStorage.setItem('business', 'true');
      this.router.navigate(['/dashboard/business'])
    })
  }

  logout() {
    this.http.post('http://localhost:5000/logout', {}, {
      withCredentials: true,
      observe: "response"
    }).subscribe(res => {
      this.router.navigate(['/']);
    });
  }

  checkBusinessAuth() {
    this.http.get('http://localhost:7000/business-authenticated', {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).subscribe(res => {
      // @ts-ignore
      if (!res.body.authenticated) {
        localStorage.getItem('business') === 'true' ? window.location.replace('/business-login') : window.location.replace('/business-register');
      } else {
        // @ts-ignore
        document.body.style = 'background-color: white;'
      }
    })
  }

  checkAuth() {
    this.http.get('http://localhost:5000/is-authenticated', {
      observe: 'response',
      responseType: 'json',
      withCredentials: true
    }).subscribe(res => {
      // @ts-ignore
      if (!res.body.auth) {
        window.location.replace('/sign-in');
      } else {
        // @ts-ignore
        document.body.style = 'background-color: white;'
      }
    })
  }

  businessLogout() {
    this.http.post('http://localhost:7000/business-logout', {}, {
      withCredentials: true,
      observe: "response"
    }).subscribe(res => {
      this.router.navigate(['/']);
    });
  }
}
